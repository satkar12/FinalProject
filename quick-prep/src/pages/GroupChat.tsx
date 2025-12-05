import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Paperclip, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface Message {
    id: string;
    content: string | null;
    file_url: string | null;
    file_name: string | null;
    file_type: string | null;
    user_id: string;
    created_at: string;
}

interface Group {
    id: string;
    name: string;
    university: string;
    description: string | null;
}

const GroupChat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [group, setGroup] = useState<Group | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate("/login");
            return;
        }

        if (!id) return;

        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchGroup(), fetchMessages()]);
            setIsLoading(false);
        };

        loadData();
        const channel = supabase
            .channel(`group-${id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `group_id=eq.${id}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, user, authLoading]);

    const fetchGroup = async () => {
        const { data, error } = await supabase
            .from("groups")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            toast({
                title: "Error",
                description: "Failed to load group",
                variant: "destructive",
            });
            return;
        }

        setGroup(data);
    };

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("group_id", id)
            .order("created_at", { ascending: true });

        if (error) {
            toast({
                title: "Error",
                description: "Failed to load messages",
                variant: "destructive",
            });
            return;
        }

        setMessages(data || []);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;

        const { error } = await supabase.from("messages").insert({
            group_id: id,
            user_id: user.id,
            content: newMessage,
        });

        if (error) {
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            });
            return;
        }

        setNewMessage("");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);

        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("group-files")
            .upload(fileName, file);

        if (uploadError) {
            toast({
                title: "Error",
                description: "Failed to upload file",
                variant: "destructive",
            });
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from("group-files")
            .getPublicUrl(fileName);

        const { error: messageError } = await supabase.from("messages").insert({
            group_id: id,
            user_id: user.id,
            file_url: publicUrl,
            file_name: file.name,
            file_type: file.type,
        });

        if (messageError) {
            toast({
                title: "Error",
                description: "Failed to send file",
                variant: "destructive",
            });
        }

        setUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <div className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
                <div className="mb-4 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/groups")}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{group?.name}</h1>
                        <p className="text-sm text-muted-foreground">{group?.university}</p>
                    </div>
                </div>

                <Card className="flex flex-col h-[calc(100vh-240px)]">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.user_id === user?.id ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${message.user_id === user?.id
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                            }`}
                                    >
                                        {message.content && <p>{message.content}</p>}
                                        {message.file_url && (
                                            <a
                                                href={message.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 mt-2 underline"
                                            >
                                                {message.file_type?.startsWith("image/") ? (
                                                    <>
                                                        <ImageIcon className="h-4 w-4" />
                                                        <span>{message.file_name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileText className="h-4 w-4" />
                                                        <span>{message.file_name}</span>
                                                    </>
                                                )}
                                            </a>
                                        )}
                                        <p className="text-xs opacity-70 mt-1">
                                            {new Date(message.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="border-t p-4">
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                            <Button

                                variant="outline"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="hover:bg-green-600"
                            >
                                <Paperclip className="h-4 w-4 " />
                            </Button>
                            <Textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="resize-none"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            <BottomNav />
        </div>
    );
};

export default GroupChat;

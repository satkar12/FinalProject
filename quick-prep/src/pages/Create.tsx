import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Create = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState("");
    const [university, setUniversity] = useState("");
    const [description, setDescription] = useState("");
    const [groupType, setGroupType] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Authentication required",
                    description: "Please log in to create a group.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }

            const { error } = await supabase
                .from("groups")
                .insert({
                    name: groupName,
                    university: university,
                    group_type: groupType,
                    description: description,
                    created_by: user.id,
                    student_count: 1,
                });

            if (error) throw error;

            toast({
                title: "Group created!",
                description: "Your study group has been created successfully.",
            });

            // Reset form
            setGroupName("");
            setUniversity("");
            setDescription("");
            setGroupType("");

            // Navigate to explore page after a short delay
            setTimeout(() => navigate("/chat"), 1000);
        } catch (error) {
            console.error("Error creating group:", error);
            toast({
                title: "Error",
                description: "Failed to create group. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex min-h-screen bg-background pb-20">
            <div className="flex-1 flex flex-col">
                <Header />

                <main className="flex-1 overflow-auto">
                    <div className="max-w-2xl mx-auto p-6">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Plus className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold">Create Study Group</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Start a new study group and invite students to join
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="groupName">Group Name *</Label>
                                <Input
                                    id="groupName"
                                    placeholder="e.g., Computer Science 101"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2 ">
                                <Label htmlFor="university">University *</Label>
                                <Select value={university} onValueChange={setUniversity} required>
                                    <SelectTrigger id="university">
                                        <SelectValue placeholder="Select your university" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tribhuvan">Tribhuvan University</SelectItem>
                                        <SelectItem value="pokhara">Pokhara University</SelectItem>
                                        <SelectItem value="kathmandu">Kathmandu University</SelectItem>
                                        <SelectItem value="purbanchal">Purbanchal University</SelectItem>
                                        <SelectItem value="lumbini">Lumbini Buddhist University</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="groupType">Group Type *</Label>
                                <Select value={groupType} onValueChange={setGroupType} required>
                                    <SelectTrigger id="groupType">
                                        <SelectValue placeholder="Select group type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="course">Course</SelectItem>
                                        <SelectItem value="subject">Subject</SelectItem>
                                        <SelectItem value="general">General Study</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what this group is about..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                                Create Group
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Create;

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import GroupCard from "@/components/GroupCard";
import FilterSection from "@/components/FilterSection";
import BottomNav from "@/components/BottomNav";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FloatingShapes from "@/components/FloatingShapes";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const DiscussionIndex = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activeFilter, setActiveFilter] = useState("Popular");
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("groups")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setGroups(data || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinGroup = async (groupId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({
                    title: "Authentication required",
                    description: "Please login to join groups",
                    variant: "destructive",
                });
                navigate("/login");
                return;
            }

            const { data: existingMember } = await supabase
                .from("group_members")
                .select("id")
                .eq("group_id", groupId)
                .eq("user_id", user.id)
                .maybeSingle();

            if (existingMember) {
                // Already a member, just navigate to the group
                navigate(`/groups/${groupId}`);
                return;
            }

            const { error } = await supabase
                .from("group_members")
                .insert({ group_id: groupId, user_id: user.id });

            if (error) {
                console.error("Join group error:", error);
                toast({
                    title: "Error",
                    description: error.code === "23505" ? "You're already a member of this group" : "Failed to join group. Please try again.",
                    variant: "destructive",
                });
                return;
            }

            // Update student count
            const group = groups.find(g => g.id === groupId);
            if (group) {
                await supabase
                    .from("groups")
                    .update({ student_count: group.student_count + 1 })
                    .eq("id", groupId);
            }

            toast({
                title: "Success",
                description: "Joined group successfully",
            });

            navigate(`/groups/${groupId}`);
        } catch (error) {
            console.error("Error joining group:", error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    };

    const filteredGroups = groups.filter(group => {
        const matchesSearch = searchQuery === "" ||
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.university.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = activeFilter === "All" ||
            activeFilter === "Popular" ||
            group.university === activeFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex min-h-screen bg-gradient-subtle pb-20 relative">
            <FloatingShapes />
            <div className="flex-1 flex flex-col relative z-10">
                <Header />

                <main className="flex-1 overflow-auto">
                    <div className="flex gap-6 p-6">
                        {/* Filters Sidebar */}
                        <aside className="w-72 flex-shrink-0">
                            <div className="sticky top-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    <h2 className="text-lg font-semibold">Explore</h2>
                                </div>
                                <FilterSection
                                    activeFilter={activeFilter}
                                    onFilterChange={setActiveFilter}
                                    onSearchChange={setSearchQuery}
                                    searchQuery={searchQuery}
                                />
                            </div>
                        </aside>

                        {/* Groups Grid */}
                        <div className="flex-1">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    <h2 className="text-xl font-semibold">Popular</h2>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {filteredGroups.length} groups • Nepal
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {isLoading ? (
                                    <p className="text-muted-foreground">Loading groups...</p>
                                ) : filteredGroups.length === 0 ? (
                                    <p className="text-muted-foreground">No groups found. Try a different search or filter!</p>
                                ) : (
                                    filteredGroups.map((group) => (
                                        <GroupCard
                                            key={group.id}
                                            name={group.name}
                                            university={group.university}
                                            studentCount={group.student_count}
                                            type={group.group_type as "course" | "subject" | "general"}
                                            members={[]}
                                            onJoin={() => handleJoinGroup(group.id)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default DiscussionIndex;

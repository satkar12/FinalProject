import { useState, useEffect } from "react";
import Header from "@/components/Header";
import GroupCard from "@/components/GroupCard";
import BottomNav from "@/components/BottomNav";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";


const Groups = () => {
    const navigate = useNavigate();
    const [myGroups, setMyGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMyGroups();
    }, []);

    const fetchMyGroups = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("group_members")
                .select(`
          group_id,
          groups (
            id,
            name,
            university,
            student_count,
            group_type,
            created_at
          )
        `)
                .eq("user_id", user.id)
                .order("joined_at", { ascending: false });
            if (error) throw error;

            setMyGroups(data || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background pb-20">
            <div className="flex-1 flex flex-col">
                <Header />

                <main className="flex-1 overflow-auto">
                    <div className="p-6">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold">My Groups</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {myGroups.length} groups you've joined
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {isLoading ? (
                                <p className="text-muted-foreground">Loading your groups...</p>
                            ) : myGroups.length === 0 ? (
                                <p className="text-muted-foreground">You haven't created any groups yet. Create your first group!</p>
                            ) : (
                                myGroups.map((membership: any) => (
                                    <GroupCard
                                        key={membership.groups.id}
                                        name={membership.groups.name}
                                        university={membership.groups.university}
                                        studentCount={membership.groups.student_count}
                                        type={membership.groups.group_type as "course" | "subject" | "general"}
                                        members={[]}
                                        onJoin={() => navigate(`/groups/${membership.groups.id}`)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Groups;

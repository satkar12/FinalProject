import { Folder, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupCardProps {
    name: string;
    university: string;
    studentCount: number;
    type?: "course" | "subject" | "general";
    lastActive?: string;
    members?: { name: string; avatar?: string }[];
    onJoin?: () => void;
}

const GroupCard = ({
    name,
    university,
    studentCount,
    type = "course",
    lastActive,
    members = [],
    onJoin,
}: GroupCardProps) => {
    const iconColor = type === "course" ? "text-accent" : "text-primary";
    const Icon = type === "course" ? Folder : Users;

    return (
        <Card className="p-4 hover:shadow-card-hover transition-all duration-300 border border-border">
            <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-muted ${iconColor}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-card-foreground mb-1 truncate">
                        {name}
                    </h3>
                    {lastActive && (
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                            Last active {lastActive}
                        </p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="truncate">{university}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {members.slice(0, 3).map((member, idx) => (
                            <Avatar key={idx} className="h-7 w-7 border-2 border-card">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {member.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {studentCount} {studentCount === 1 ? "student" : "students"}
                    </span>
                </div>

                <Button size="sm" className="gap-1" onClick={onJoin}>
                    Join
                    <span className="text-lg leading-none">+</span>
                </Button>
            </div>
        </Card>
    );
};

export default GroupCard;

import { Home, BookOpen, FileText, MessageCircle, HelpCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
    className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
    const navItems = [
        { icon: Home, label: "Home", active: true },
        { icon: BookOpen, label: "My Library", active: false },
        { icon: FileText, label: "AI Notes", active: false },
        { icon: MessageCircle, label: "Ask AI", active: false },
        { icon: HelpCircle, label: "AI Quiz", badge: "New", active: false },
        { icon: Clock, label: "Recent", active: false },
    ];

    return (
        <aside className={`w-64 border-r bg-sidebar h-screen flex flex-col ${className}`}>
            <div className="p-4 border-b">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-primary text-primary-foreground">SG</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">Student Name</h3>
                        <p className="text-xs text-muted-foreground truncate">University Name</p>
                    </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                        <span>0 Followers</span>
                        <span>0 Uploads</span>
                        <span>0 Upvotes</span>
                    </div>
                </div>

                <Button className="w-full mt-3" size="sm">
                    + New
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <nav className="p-2">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${item.active
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}

                    <div className="mt-6 px-3">
                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">My Library</h4>
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent/50 text-sidebar-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span>Courses</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent/50 text-sidebar-foreground">
                            <FileText className="h-4 w-4" />
                            <span>Studylists</span>
                        </button>
                    </div>
                </nav>
            </ScrollArea>
        </aside>
    );
};

export default Sidebar;

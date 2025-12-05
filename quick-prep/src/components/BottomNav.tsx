import { Users, Compass, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: "/groups", icon: Users, label: "Groups" },
        { path: "/discussion", icon: Compass, label: "Explore" },
        { path: "/create", icon: Plus, label: "Create" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
            <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${isActive
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;

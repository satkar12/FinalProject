import { Search, Settings, LogOut, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Brain } from "lucide-react";

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast({
            title: "Logged out",
            description: "You have been logged out successfully",
        });
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border/50">
            <div className="flex items-center gap-6 px-6 py-3">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                        <GraduationCap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">QuickPrep</span>
                </Link>

                {/* Navigation Links */}

                {/* Search Bar */}
                <div className="flex-1 max-w-xl relative">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses, groups, or universities..."
                        className="pl-10 bg-muted/40 border-border/50 rounded-xl focus:bg-card focus:border-primary/50 transition-all"
                    />
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-muted-foreground hover:text-foreground"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                                Login
                            </Button>
                            <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity" onClick={() => navigate("/signup")}>
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
export default Header;

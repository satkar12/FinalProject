import {
    Brain,
    BookOpen,
    Target,
    Upload,
    MessageSquare,
    Book,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
    const { user, signOut } = useAuth();

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">QuickPrep</span>
            </div>

            {/* Middle: Navigation links */}
            <div className="hidden md:flex items-center gap-8">
                <Link
                    to="/dashboard"
                    className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                    <BookOpen className="w-4 h-4" />
                    Dashboard
                </Link>
                <Link
                    to="/summarizer"
                    className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                    <Brain className="w-4 h-4" />
                    AI Summarizer
                </Link>
                <Link
                    to="/askme"
                    className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                    <Target className="w-4 h-4" />
                    Ask Me🚀
                </Link>
                <Link
                    to="/upload"
                    className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload PDFs
                </Link>
                <Link
                    to="/discussion"
                    className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                    <MessageSquare className="w-4 h-4" />
                    Discussion
                </Link>
                <Link
                    to="/resources"
                    className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                    <Book className="w-4 h-4" />
                    Resources
                </Link>
            </div>

            {/* Right: Auth Section */}
            <div className="flex items-center gap-3">
                {!user ? (
                    <>
                        {/* If no user logged in → Sign In + Get Started */}
                        <Link
                            to="/login"
                            className="text-foreground hover:text-primary transition-colors"
                        >
                            Sign In
                        </Link>
                        <Button variant="default" size="sm">
                            Get Started
                        </Button>
                    </>
                ) : (
                    <>
                        {/* If user logged in → Avatar dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold focus:outline-none">
                                    {user.email?.charAt(0).toUpperCase()}
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem disabled>
                                    {user.email}
                                </DropdownMenuItem>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={signOut}
                                    className="text-red-500"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;

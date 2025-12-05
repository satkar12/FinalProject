import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { set } from "date-fns";

const Login = () => {
    const { user, signOut, loading } = useAuth();
    const navigate = useNavigate();



    useEffect(() => {

        if (!loading && !user) {
            navigate("/auth");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-xl text-muted-foreground">Loading...🔃</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="mb-4 text-4xl font-bold">Welcome to QuickPrep📚</h1>
                <p className="text-xl text-muted-foreground">
                    Hello, {user.email}! You're successfully logged in.
                </p>
                <Button onClick={signOut} variant="outline">
                    Sign Out⬆️
                </Button>
            </div>
        </div>
    );
};

export default Login;
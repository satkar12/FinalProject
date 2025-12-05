import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap } from "lucide-react";


const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0"> QuickPrep</div>



            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-hero opacity-5" />

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 text-center">
                <div className="mx-auto max-w-4xl">
                    {/* Badge */}
                    <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium shadow-elegant">
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI-Powered Exam Preparation
                    </Badge>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                        Master Your{" "}
                        <span className="relative inline-block">
                            <span className="text-primary font-bold">
                                Exams
                            </span>
                            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-primary opacity-30 rounded-full blur-sm"></div>
                        </span>{" "}
                        with AI
                    </h1>

                    {/* Subheading */}
                    <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                        Transform your study materials into smart summaries, generate practice questions,
                        and ace your exams with our intelligent preparation platform.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6 mb-12">
                        <Button
                            size="lg"
                            className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-smooth text-lg px-8 py-3"
                        >
                            <Brain className="mr-2 h-5 w-5" />
                            Start Learning
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-3 hover:bg-accent transition-smooth"
                        >
                            Watch Demo
                        </Button>
                    </div>

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Brain className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">AI Summarization</h3>
                            <p className="text-sm text-muted-foreground text-center">
                                Turn lengthy PDFs into concise, digestible summaries
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info/10">
                                <Zap className="h-6 w-6 text-info" />
                            </div>
                            <h3 className="font-semibold">Smart Questions</h3>
                            <p className="text-sm text-muted-foreground text-center">
                                Auto-generated practice questions from your materials
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                                <Sparkles className="h-6 w-6 text-success" />
                            </div>
                            <h3 className="font-semibold">Progress Tracking</h3>
                            <p className="text-sm text-muted-foreground text-center">
                                Monitor your learning progress and exam readiness
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 opacity-20 animate-float">
                <div className="h-16 w-16 rounded-lg bg-gradient-primary" />
            </div>
            <div className="absolute top-40 right-16 opacity-20 animate-float" style={{ animationDelay: "2s" }}>
                <div className="h-12 w-12 rounded-full bg-gradient-primary" />
            </div>
            <div className="absolute bottom-32 left-20 opacity-20 animate-float" style={{ animationDelay: "4s" }}>
                <div className="h-20 w-20 rounded-full bg-gradient-primary" />
            </div>
        </section>
    );
};

export default HeroSection;
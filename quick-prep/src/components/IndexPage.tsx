import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Upload, Users } from "lucide-react";
import { Link } from "react-router-dom";

const IndexPage = () => {
    return (
        <div className="min-h-screen bg-gradient-secondary">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-primary opacity-5 blur-3xl"></div>
                <div className="relative max-w-7xl mx-auto px-8 py-24 lg:py-32">
                    <div className="text-center space-y-8 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-sm font-semibold text-primary">Welcome to Resource Hub</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                            <span className="block text-foreground mb-2">Share Knowledge,</span>
                            <span className="block bg-gradient-primary bg-clip-text text-transparent">
                                Empower Learning
                            </span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Access a curated library of educational resources shared by our community.
                            Upload, discover, and learn together.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link to="/resources">
                                <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow hover:shadow-xl transition-all duration-300 text-lg px-8 group">
                                    Explore Resources
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/upload">
                                <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-semibold text-lg px-8">
                                    <Upload className="mr-2 h-5 w-5" />
                                    Upload Resource
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 animate-fade-in">
                        <div className="p-4 bg-gradient-primary rounded-xl w-fit mb-6 group-hover:shadow-glow transition-all duration-300">
                            <BookOpen className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-foreground">Rich Library</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Access a diverse collection of educational PDFs covering various topics and subjects.
                        </p>
                    </div>

                    <div className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <div className="p-4 bg-gradient-primary rounded-xl w-fit mb-6 group-hover:shadow-glow transition-all duration-300">
                            <Upload className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-foreground">Easy Sharing</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Upload your resources effortlessly and contribute to the community's knowledge base.
                        </p>
                    </div>

                    <div className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="p-4 bg-gradient-primary rounded-xl w-fit mb-6 group-hover:shadow-glow transition-all duration-300">
                            <Users className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-foreground">Community Driven</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Join a vibrant community of learners and educators sharing valuable resources.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;

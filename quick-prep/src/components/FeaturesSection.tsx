import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Brain,

    Image,
    MessageSquare,
    Trophy,
    BookOpen,
    Zap,
    Users
} from "lucide-react";
interface FilterSectionProps {
    onFilterChange?: (filter: string) => void;
    activeFilter?: string;

}

const FeaturesSection = () => {
    const features = [
        {
            icon: FileText,
            title: "PDF Management",
            description: "Upload, organize, and manage your semester-wise study materials with intelligent categorization.",
            badge: "Core Feature",
            color: "bg-primary/10 text-primary"
        },
        {
            icon: Brain,
            title: "AI Summarization",
            description: "Get both extractive and abstractive summaries of your PDFs using advanced NLP models.",
            badge: "AI Powered",
            color: "bg-info/10 text-info"
        },
        {
            icon: Image,
            title: "Image-to-Text",
            description: "Upload book pages and get OCR-powered text extraction with intelligent summarization.",
            badge: "OCR Technology",
            color: "bg-success/10 text-success"
        },
        {
            icon: Zap,
            title: "Question Generation",
            description: "Automatically generate practice questions from your study materials and PDFs.",
            badge: "Smart Learning",
            color: "bg-warning/10 text-warning"
        },
        {
            icon: Trophy,
            title: "Quiz Module",
            description: "Practice with AI-generated quizzes and track your performance across different topics.",
            badge: "Interactive",
            color: "bg-primary/10 text-primary"
        },
        {
            icon: MessageSquare,
            title: "Discussion Forum",
            description: "Connect with peers, ask questions, and share knowledge in our collaborative community.",
            badge: "Community",
            color: "bg-info/10 text-info"
        }
    ];

    return (
        <section id="features" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4 px-4 py-2">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Platform Features
                    </Badge>
                    <h2 className="text-3xl font-bold mb-4 sm:text-4xl">
                        Everything You Need to&nbsp;
                        <span className="relative inline-block">
                            <span className="text-primary font-bold">
                                Succeed
                            </span>
                            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-primary opacity-30 rounded-full blur-sm"></div>
                        </span>{" "}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our comprehensive suite of AI-powered tools transforms how engineering students
                        prepare for exams and master their coursework.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="relative overflow-hidden shadow-card hover:shadow-elegant transition-smooth group"
                        >
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`p-2 rounded-lg ${feature.color}`}>
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {feature.badge}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-smooth" />
                        </Card>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                        <div className="text-sm text-muted-foreground">PDFs Processed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-info mb-2">50K+</div>
                        <div className="text-sm text-muted-foreground">Questions Generated</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-success mb-2">2K+</div>
                        <div className="text-sm text-muted-foreground">Active Students</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-warning mb-2">95%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
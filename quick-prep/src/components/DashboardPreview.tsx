import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Upload,
    FileText,
    Brain,
    Trophy,
    TrendingUp,
    Clock,
    CheckCircle,
    ArrowRight,
    Zap
} from "lucide-react";

const DashboardPreview = () => {
    const recentActivity = [
        {
            type: "upload",
            title: "Data Structures Notes.pdf",
            time: "2 hours ago",
            status: "processed"
        },
        {
            type: "quiz",
            title: "Algorithms Quiz",
            time: "1 day ago",
            status: "completed",
            score: "85%"
        },
        {
            type: "summary",
            title: "Computer Networks Summary",
            time: "2 days ago",
            status: "generated"
        }
    ];

    const quickStats = [
        { label: "PDFs Uploaded", value: "12", icon: FileText, color: "text-primary" },
        { label: "Summaries Generated", value: "8", icon: Brain, color: "text-info" },
        { label: "Quizzes Completed", value: "15", icon: Trophy, color: "text-success" },
        { label: "Study Streak", value: "7 days", icon: TrendingUp, color: "text-warning" }
    ];

    return (
        <section id="dashboard" className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4 px-4 py-2">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Student Dashboard
                    </Badge>
                    <h2 className="text-3xl font-bold mb-4 sm:text-4xl">
                        Your Personalized &nbsp;
                        <span className="relative inline-block">
                            <span className="text-primary font-bold">
                                Learning Platform
                            </span>
                            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-primary opacity-30 rounded-full blur-sm"></div>
                        </span>{" "}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Track your progress, manage your study materials, and access AI-powered tools
                        all from your personalized dashboard.
                    </p>
                </div>

                {/* Dashboard Mock-up */}
                <div className="max-w-6xl mx-auto">
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        {quickStats.map((stat, index) => (
                            <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                            <p className="text-2xl font-bold">{stat.value}</p>
                                        </div>
                                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Dashboard Area */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Actions */}
                            <Card className="shadow-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-primary" />
                                        Quick Actions
                                    </CardTitle>
                                    <CardDescription>
                                        Jump into your most common tasks
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                                        <Upload className="h-6 w-6 text-primary" />
                                        <span className="font-medium">Upload PDF</span>
                                        <span className="text-xs text-muted-foreground">Add new study material</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                                        <Brain className="h-6 w-6 text-info" />
                                        <span className="font-medium">Generate Summary</span>
                                        <span className="text-xs text-muted-foreground">AI-powered insights</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                                        <Trophy className="h-6 w-6 text-success" />
                                        <span className="font-medium">Take Quiz</span>
                                        <span className="text-xs text-muted-foreground">Test your knowledge</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                                        <FileText className="h-6 w-6 text-warning" />
                                        <span className="font-medium">View Library</span>
                                        <span className="text-xs text-muted-foreground">Browse your files</span>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Study Progress */}
                            <Card className="shadow-card">
                                <CardHeader>
                                    <CardTitle>Study Progress</CardTitle>
                                    <CardDescription>Your learning journey this semester</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Data Structures & Algorithms</span>
                                            <span className="text-muted-foreground">75%</span>
                                        </div>
                                        <Progress value={75} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Computer Networks</span>
                                            <span className="text-muted-foreground">60%</span>
                                        </div>
                                        <Progress value={60} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Database Management</span>
                                            <span className="text-muted-foreground">90%</span>
                                        </div>
                                        <Progress value={90} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Recent Activity */}
                            <Card className="shadow-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-smooth">
                                            <div className="flex-shrink-0">
                                                {activity.type === 'upload' && <Upload className="h-4 w-4 text-primary" />}
                                                {activity.type === 'quiz' && <Trophy className="h-4 w-4 text-success" />}
                                                {activity.type === 'summary' && <Brain className="h-4 w-4 text-info" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{activity.title}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{activity.time}</span>
                                                    {activity.score && <Badge variant="secondary" className="text-xs">{activity.score}</Badge>}
                                                </div>
                                            </div>
                                            <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Upcoming Exams */}
                            <Card className="shadow-card">
                                <CardHeader>
                                    <CardTitle>Upcoming Exams</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="p-3 border rounded-lg">
                                        <p className="font-medium text-sm">Data Structures</p>
                                        <p className="text-xs text-muted-foreground">March 15, 2024</p>
                                        <Badge variant="outline" className="text-xs mt-1">5 days left</Badge>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <p className="font-medium text-sm">Algorithms</p>
                                        <p className="text-xs text-muted-foreground">March 22, 2024</p>
                                        <Badge variant="outline" className="text-xs mt-1">12 days left</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <Button size="lg" className="bg-gradient-primary shadow-elegant">
                        Get Started with QuickPrep
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchResources, Resource, createSignedUrl } from '@/lib/resourceService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, User, Eye, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Resources = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await fetchResources();
            setResources(data);
        } catch (err) {
            console.error('Error loading resources:', err);
            toast({
                title: "Error",
                description: "Failed to load resources",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (resource: Resource) => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to view resources",
                variant: "destructive"
            });
            return;
        }

        try {
            const signedUrl = await createSignedUrl(resource.file_url);
            window.open(signedUrl, '_blank');
        } catch (err) {
            console.error('View error:', err);
            toast({
                title: "Error",
                description: "Failed to open resource",
                variant: "destructive"
            });
        }
    };

    const handleDownload = async (resource: Resource) => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to download resources",
                variant: "destructive"
            });
            return;
        }

        try {
            const signedUrl = await createSignedUrl(resource.file_url);
            const link = document.createElement('a');
            link.href = signedUrl;
            link.download = resource.file_name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Download error:', err);
            toast({
                title: "Error",
                description: "Failed to download resource",
                variant: "destructive"
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-secondary p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20 animate-fade-in">
                        <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
                        <p className="mt-6 text-muted-foreground text-lg font-medium">Loading resources...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-secondary">
            {/* Hero Header with Gradient */}
            <div className="bg-gradient-primary text-primary-foreground py-12 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 animate-fade-in">
                        <div className="space-y-3">
                            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                                Resource Library
                            </h1>
                            <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-2xl">
                                Discover and share educational resources with the community
                            </p>
                        </div>

                        <div>
                            <Link to="/upload">
                                <Button
                                    size="lg"
                                    className="bg-white text-primary hover:bg-white/90 shadow-glow hover:shadow-xl transition-all duration-300 font-semibold group"
                                >
                                    <Upload className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                                    Upload Resource
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                {resources.length === 0 ? (
                    /* Empty State */
                    <Card className="text-center py-20 shadow-card border-border/50 animate-scale-in">
                        <CardContent className="pt-6">
                            <div className="max-w-md mx-auto space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
                                    <div className="relative p-6 bg-secondary rounded-full w-28 h-28 mx-auto flex items-center justify-center">
                                        <FileText className="h-14 w-14 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-bold text-foreground">No resources yet</h3>
                                    <p className="text-muted-foreground text-lg">
                                        Be the first to share knowledge with the community!
                                    </p>
                                </div>
                                <Link to="/upload">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-glow transition-all duration-300"
                                    >
                                        <Upload className="h-5 w-5 mr-2" />
                                        Upload First Resource
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Resource Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.map((resource, index) => (
                            <Card
                                key={resource.id}
                                className="group hover:shadow-card-hover transition-all duration-300 shadow-card border-border/50 overflow-hidden animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Card Header with Icon */}
                                <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-br from-secondary/50 to-transparent">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gradient-primary rounded-xl shadow-md group-hover:shadow-glow transition-all duration-300">
                                            <FileText className="h-7 w-7 text-primary-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg font-semibold line-clamp-2 leading-snug text-foreground group-hover:text-primary transition-colors">
                                                {resource.file_name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6 space-y-5">
                                    {/* Meta Information */}
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <div className="p-2 bg-secondary rounded-lg">
                                                <Calendar className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-medium">{formatDate(resource.uploaded_at)}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <div className="p-2 bg-secondary rounded-lg">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-medium truncate">
                                                {resource.uploaded_by.slice(0, 8)}...
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Separated and Prominent */}
                                    <div className="pt-3 space-y-3">
                                        <Button
                                            variant="outline"
                                            className="w-full border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-semibold transition-all duration-300 group/btn"
                                            size="lg"
                                            onClick={() => handleView(resource)}
                                            disabled={!user}
                                        >
                                            <Eye className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                                            View Document
                                        </Button>

                                        <Button
                                            className="w-full bg-gradient-primary hover:opacity-90 shadow-md hover:shadow-glow transition-all duration-300 font-semibold group/btn"
                                            size="lg"
                                            onClick={() => handleDownload(resource)}
                                            disabled={!user}
                                        >
                                            <Download className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                                            Download PDF
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;

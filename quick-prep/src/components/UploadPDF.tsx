import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { uploadResource } from '@/lib/resourceService';

const UploadResource = () => {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [summary, setSummary] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast({
                title: "Invalid File",
                description: "Please select a PDF file",
                variant: "destructive"
            });
            return;
        }

        if (file.size > 20 * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: "File size must be less than 20MB",
                variant: "destructive"
            });
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast({
                title: "No File Selected",
                description: "Please select a file to upload",
                variant: "destructive"
            });
            return;
        }

        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to upload resources",
                variant: "destructive"
            });
            return;
        }

        try {
            setUploading(true);
            await uploadResource(selectedFile);
            toast({
                title: "Success",
                description: "Resource uploaded successfully",
            });

            // Reset form
            setSelectedFile(null);
            setSummary('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Redirect to resources page after 1 second
            setTimeout(() => {
                navigate('/resources');
            }, 1000);
        } catch (err) {
            console.error('Upload error:', err);
            toast({
                title: "Upload Failed",
                description: err instanceof Error ? err.message : "Failed to upload resource",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gradient-secondary">
            {/* Header */}
            <div className="bg-gradient-primary text-primary-foreground py-8 px-8">
                <div className="max-w-4xl mx-auto">
                    <Button
                        variant="ghost"
                        className="mb-6 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                        onClick={() => navigate('/resources')}
                    >
                        <ArrowLeft className="h-3 w-4 mr-2" />
                        Back to Resources
                    </Button>

                    <div className="space-y-3 animate-fade-in">
                        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                            Upload Resource
                        </h1>
                        <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-2xl">
                            Share your knowledge with the community by uploading educational PDFs
                        </p>
                    </div>
                </div>
            </div>

            {/* Upload Form */}
            <div className="max-w-4xl mx-auto px-8 py-12">
                <Card className="shadow-card-hover border-border/50 animate-scale-in">
                    <CardHeader className="border-b border-border/50 bg-gradient-to-br from-secondary/50 to-transparent">
                        <CardTitle className="text-2xl">Upload Details</CardTitle>
                        <CardDescription className="text-base">
                            Fill in the details below to share your resource with the community
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8 space-y-8">
                        {/* File Upload Area */}
                        <div className="space-y-3">
                            <Label htmlFor="file-upload" className="text-base font-semibold">
                                Select PDF File *
                            </Label>
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${selectedFile
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50 bg-secondary/30'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />

                                {selectedFile ? (
                                    <div className="flex items-center gap-4 animate-fade-in">
                                        <div className="p-3 bg-gradient-primary rounded-xl">
                                            <FileText className="h-8 w-8 text-primary-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground truncate">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="p-4 bg-secondary rounded-xl w-fit mx-auto mb-4">
                                            <Upload className="h-10 w-10 text-primary" />
                                        </div>
                                        <p className="text-foreground font-medium mb-2">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            PDF files only (max 20MB)
                                        </p>
                                    </div>
                                )}

                                <label
                                    htmlFor="file-upload"
                                    className="absolute inset-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Optional Summary */}
                        <div className="space-y-3">
                            <Label htmlFor="summary" className="text-base font-semibold">
                                Resource Summary (Optional)
                            </Label>
                            <Textarea
                                id="summary"
                                placeholder="Provide a brief description of what this resource covers..."
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className="min-h-[120px] resize-none border-2 focus:border-primary transition-colors"
                            />
                            <p className="text-sm text-muted-foreground">
                                Help others understand what they'll learn from this resource
                            </p>
                        </div>

                        {/* Upload Guidelines */}
                        <div className="p-6 bg-secondary/50 rounded-xl border border-border/50">
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Upload Guidelines
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>Only PDF files are accepted</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>Maximum file size is 20MB</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>Ensure your content is educational and appropriate</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>You must have rights to share the resource</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 border-2 border-border hover:border-primary/50 hover:bg-secondary"
                                size="lg"
                                onClick={() => navigate('/resources')}
                                disabled={uploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-glow transition-all duration-300 font-semibold"
                                size="lg"
                                onClick={handleUpload}
                                disabled={uploading || !selectedFile}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-5 w-5 mr-2" />
                                        Upload Resource
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UploadResource;

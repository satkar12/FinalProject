import { useState, useRef } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import FloatingShapes from "@/components/FloatingShapes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileText, Zap, Copy, Check, Upload, X, Image, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SummaryResult {
    extractedText: string;
    summary: string;
    keypoints: string;
}

const Summarizer = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [result, setResult] = useState<SummaryResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image (JPEG, PNG, WebP, GIF) or PDF file",
                variant: "destructive",
            });
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please upload a file smaller than 10MB",
                variant: "destructive",
            });
            return;
        }

        setUploadedFile(file);
        setResult(null);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setFilePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setFilePreview(null);
        setResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSummarize = async () => {
        if (!uploadedFile) {
            toast({
                title: "No file uploaded",
                description: "Please upload a PDF or image to summarize",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const form = new FormData();
            form.append("image", uploadedFile);

            const response = await fetch("http://localhost:4000/extract-summarize", {
                method: "POST",
                body: form,
            });

            if (!response.ok) {
                throw new Error("Failed to process the document");
            }

            const data = await response.json();
            setResult(data);

            toast({
                title: "Summary generated!",
                description: "Your document has been processed successfully",
            });
        } catch (error) {
            console.error("Summarize error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to generate summary",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string, section: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(section);
        toast({ title: "Copied to clipboard!" });
        setTimeout(() => setCopied(null), 2000);
    };

    const getFileIcon = () => {
        if (!uploadedFile) return <Upload className="h-12 w-12 text-muted-foreground/50" />;
        if (uploadedFile.type.startsWith('image/')) return <Image className="h-12 w-12 text-primary" />;
        return <File className="h-12 w-12 text-primary" />;
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <FloatingShapes />


            <main className="container mx-auto px-4 pt-24 pb-24 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">AI-Powered Study Tool</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Summarize Your{" "}
                        <span className="text-primary underline decoration-primary/30">Documents</span>
                    </h1>

                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Upload PDFs or images of your study materials and get instant AI-powered summaries with key points.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-background/60 backdrop-blur-sm border-border/50 text-center">
                        <CardContent className="pt-6">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Text Extraction</h3>
                            <p className="text-sm text-muted-foreground">Extract text from images and PDFs automatically</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-background/60 backdrop-blur-sm border-border/50 text-center">
                        <CardContent className="pt-6">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-6 w-6 text-green-500" />
                            </div>
                            <h3 className="font-semibold mb-2">Smart Summary</h3>
                            <p className="text-sm text-muted-foreground">Get concise summaries of your content</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-background/60 backdrop-blur-sm border-border/50 text-center">
                        <CardContent className="pt-6">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="h-6 w-6 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">Key Points</h3>
                            <p className="text-sm text-muted-foreground">Identify important concepts for quick review</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Upload Section */}
                <Card className="bg-background/80 backdrop-blur-sm border-border/50 mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-primary" />
                            Upload Document
                        </CardTitle>
                        <CardDescription>
                            Upload a PDF or image of your study materials
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="min-h-[200px] border-2 border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        >
                            {uploadedFile ? (
                                <div className="flex flex-col items-center p-4 w-full">
                                    {filePreview ? (
                                        <img
                                            src={filePreview}
                                            alt="Preview"
                                            className="max-h-32 max-w-full object-contain rounded-lg mb-4"
                                        />
                                    ) : (
                                        getFileIcon()
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm font-medium truncate max-w-[200px]">
                                            {uploadedFile.name}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile();
                                            }}
                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {getFileIcon()}
                                    <p className="text-muted-foreground mt-4 text-center">
                                        <span className="font-medium text-primary">Click to upload</span>
                                        <br />
                                        <span className="text-sm">Image or PDF (max 10MB)</span>
                                    </p>
                                </>
                            )}
                        </div>

                        <Button
                            onClick={handleSummarize}
                            disabled={isLoading || !uploadedFile}
                            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Extract & Summarize
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Section */}
                {result && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Extracted Text */}
                        <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Extracted Text
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopy(result.extractedText, 'extracted')}
                                        className="gap-1 h-8"
                                    >
                                        {copied === 'extracted' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-[300px] overflow-auto p-3 rounded-lg bg-muted/30 border border-border/30">
                                    <p className="text-sm whitespace-pre-wrap">{result.extractedText}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary */}
                        <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Summary
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopy(result.summary, 'summary')}
                                        className="gap-1 h-8"
                                    >
                                        {copied === 'summary' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-[300px] overflow-auto p-3 rounded-lg bg-muted/30 border border-border/30">
                                    <p className="text-sm whitespace-pre-wrap">{result.summary}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Key Points */}
                        <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Zap className="h-5 w-5 text-primary" />
                                        Key Points
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopy(result.keypoints, 'keypoints')}
                                        className="gap-1 h-8"
                                    >
                                        {copied === 'keypoints' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-[300px] overflow-auto p-3 rounded-lg bg-muted/30 border border-border/30">
                                    <pre className="text-sm whitespace-pre-wrap font-sans">{result.keypoints}</pre>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Empty State */}
                {!result && !isLoading && (
                    <Card className="bg-background/60 backdrop-blur-sm border-border/50">
                        <CardContent className="py-12">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Sparkles className="h-16 w-16 mb-4 opacity-30" />
                                <p className="text-center text-lg">
                                    Upload a document to see the extracted text, summary, and key points here.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>


        </div>
    );
};

export default Summarizer;
import { useState, useRef } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import FloatingShapes from "@/components/FloatingShapes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, FileText, Brain, Copy, Check, Upload, X, Image, File, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface QuizResult {
    questions: Question[];
}

const Quiz = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState<number | null>(null);
    const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
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
        setRevealedAnswers(new Set());

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
        setRevealedAnswers(new Set());
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleGenerate = async () => {
        if (!uploadedFile) {
            toast({
                title: "No file uploaded",
                description: "Please upload a PDF or image to generate questions",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setResult(null);
        setRevealedAnswers(new Set());

        try {
            const text = await uploadedFile.text();

            const response = await fetch("http://localhost:4000/generate-questions", {
                method: "POST",
                body: text,
            });

            if (!response.ok) {
                throw new Error("Failed to process the document");
            }


            const data = await response.json();
            setResult(data);
            toast({
                title: "Quiz generated!",
                description: `${data.questions?.length || 0} questions created from your document`,
            });
        } catch (error) {
            console.error("Quiz generation error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to generate quiz",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (question: Question, index: number) => {
        const text = `Q: ${question.question}\n\nOptions:\n${question.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n')}\n\nAnswer: ${question.correctAnswer}\n\nExplanation: ${question.explanation}`;
        await navigator.clipboard.writeText(text);
        setCopied(index);
        toast({ title: "Copied to clipboard!" });
        setTimeout(() => setCopied(null), 2000);
    };

    const toggleAnswer = (index: number) => {
        setRevealedAnswers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
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
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">AI Quiz Generator</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Generate{" "}
                        <span className="text-primary underline decoration-primary/30">Quiz Questions</span>
                    </h1>

                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Upload your study materials and get AI-generated quiz questions to test your knowledge.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-background/60 backdrop-blur-sm border-border/50 text-center">
                        <CardContent className="pt-6">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Content Analysis</h3>
                            <p className="text-sm text-muted-foreground">AI analyzes your documents to understand key concepts</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-background/60 backdrop-blur-sm border-border/50 text-center">
                        <CardContent className="pt-6">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <HelpCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <h3 className="font-semibold mb-2">Multiple Choice</h3>
                            <p className="text-sm text-muted-foreground">Get well-crafted questions with answer options</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-background/60 backdrop-blur-sm border-border/50 text-center">
                        <CardContent className="pt-6">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                <Brain className="h-6 w-6 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">Explanations</h3>
                            <p className="text-sm text-muted-foreground">Each answer includes detailed explanations</p>
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
                            onClick={handleGenerate}
                            disabled={isLoading || !uploadedFile}
                            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                                    Generating Questions...
                                </>
                            ) : (
                                <>
                                    <Brain className="h-4 w-4 mr-2" />
                                    Generate Quiz
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Section */}
                {result && result.questions && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <HelpCircle className="h-6 w-6 text-primary" />
                            Generated Questions ({result.questions.length})
                        </h2>

                        {result.questions.map((q, index) => (
                            <Card key={index} className="bg-background/80 backdrop-blur-sm border-border/50">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <CardTitle className="text-lg flex items-start gap-2">
                                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                                                {index + 1}
                                            </span>
                                            <span>{q.question}</span>
                                        </CardTitle>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopy(q, index)}
                                            className="gap-1 h-8 flex-shrink-0"
                                        >
                                            {copied === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        {q.options.map((option, optIndex) => (
                                            <div
                                                key={optIndex}
                                                className={`p-3 rounded-lg border transition-colors ${revealedAnswers.has(index) && option === q.correctAnswer
                                                    ? "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400"
                                                    : "bg-muted/30 border-border/30"
                                                    }`}
                                            >
                                                <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                                {option}
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleAnswer(index)}
                                        className="w-full text-muted-foreground hover:text-foreground"
                                    >
                                        {revealedAnswers.has(index) ? (
                                            <>
                                                <ChevronUp className="h-4 w-4 mr-2" />
                                                Hide Answer
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="h-4 w-4 mr-2" />
                                                Show Answer
                                            </>
                                        )}
                                    </Button>

                                    {revealedAnswers.has(index) && (
                                        <div className="p-4 rounded-lg bg-muted/50 border border-border/30 space-y-2">
                                            <p className="text-sm">
                                                <span className="font-semibold text-green-600 dark:text-green-400">Correct Answer:</span>{" "}
                                                {q.correctAnswer}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-semibold">Explanation:</span> {q.explanation}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!result && !isLoading && (
                    <Card className="bg-background/60 backdrop-blur-sm border-border/50">
                        <CardContent className="py-12">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Brain className="h-16 w-16 mb-4 opacity-30" />
                                <p className="text-center text-lg">
                                    Upload a document to generate quiz questions for your study session.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>


        </div>
    );
};

export default Quiz;

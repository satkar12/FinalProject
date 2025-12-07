import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";
import Auth from "./pages/Auth";
import DashboardPreview from "./components/DashboardPreview";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import Navigation from "./components/Navigation";
import UploadResources from "./components/UploadPDF";
import IndexPage from "./components/IndexPage";
import UsersList from "./components/UsersList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Resources from "./components/Resources";
import AskMe from "./pages/AskMe";
import GroupChat from "./pages/GroupChat";
import Create from "./pages/Create";
import Groups from "./pages/Groups";
import { ProtectedRoute } from "@/components/ProtectedRoutes";
import DiscussionIndex from "./pages/DiscussionIndex";
import Summarizer from "./pages/Summarizer";
import Quiz from "./pages/Quiz";






const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Index />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="/dashboard" element={<DashboardPreview />} />
                        <Route path="/features" element={<FeaturesSection />} />
                        <Route path="/hero" element={<HeroSection />} />
                        <Route path="/navigation" element={<Navigation />} />
                        <Route path="/summarizer" element={<Summarizer />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/upload" element={<UploadResources />} />
                        <Route path="/users" element={<UsersList />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
                        <Route path="/groups/:id" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />
                        <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
                        <Route path="/" element={<Index />} />
                        <Route path="/discussion" element={<ProtectedRoute><DiscussionIndex /></ProtectedRoute>} />
                        <Route path="/" element={<IndexPage />} />
                        <Route path="/askme" element={<AskMe />} />




                        <Route path="/login" element={<Login key={Date.now()} />} />
                        <Route path="/resources" element={<Resources />} />


                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;

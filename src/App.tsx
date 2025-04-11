
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkflowsProvider } from "@/hooks/use-workflows";
import Index from "./pages/Index";
import StocksPage from "./pages/StocksPage";
import ImportPage from "./pages/ImportPage";
import SavedStocksPage from "./pages/SavedStocksPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import AnalysisPage from "./pages/AnalysisPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WorkflowsProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/saved" element={<SavedStocksPage />} />
            <Route path="/ai-insights" element={<AIInsightsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WorkflowsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

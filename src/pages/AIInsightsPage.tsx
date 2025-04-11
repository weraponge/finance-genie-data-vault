
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIPromptInput } from "@/components/stocks/AIPromptInput";
import { AIResponseCard } from "@/components/stocks/AIResponseCard";
import { toast } from "sonner";
import { StockData } from "@/components/stocks/StockCard";
import { getSavedStocks } from "@/services/stockService";
import { analyzeStocks } from "@/services/aiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const AIInsightsPage = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptHistory, setPromptHistory] = useState<
    { prompt: string; response: string }[]
  >([]);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      // First try to get from session storage (recent stocks)
      const recentStocksJson = sessionStorage.getItem("recentStocks");
      if (recentStocksJson) {
        const recentStocks = JSON.parse(recentStocksJson);
        if (recentStocks.length > 0) {
          setStocks(recentStocks);
          return;
        }
      }
      
      // If no recent stocks, get saved stocks
      const savedStocks = await getSavedStocks();
      setStocks(savedStocks);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load stocks for analysis");
    }
  };

  const handleSubmitPrompt = async (prompt: string) => {
    if (stocks.length === 0) {
      toast.error("No stocks available for analysis. Please add some stocks first.");
      return;
    }
    
    setIsLoading(true);
    setAiResponse("");
    
    try {
      const response = await analyzeStocks(prompt, stocks);
      setAiResponse(response);
      
      // Add to history
      setPromptHistory((prev) => [
        { prompt, response },
        ...prev.slice(0, 4), // Keep only last 5 prompts
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze stocks");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPromptResponse = (item: { prompt: string; response: string }) => {
    setAiResponse(item.response);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">
            Get AI-powered analysis and insights for your stocks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" /> AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIPromptInput
                  onSubmit={handleSubmitPrompt}
                  isLoading={isLoading}
                  placeholder="Ask about market trends, stock performance, risk analysis, or investment strategies..."
                />
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Example prompts:</h3>
                  <div className="space-y-2">
                    {[
                      "Compare these stocks based on P/E ratio and market cap",
                      "Which of these stocks has the best dividend yield?",
                      "Analyze the risk profile of these stocks",
                      "Give me investment recommendations based on these stocks",
                      "What are the general market trends for these sectors?",
                    ].map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-2 text-left font-normal"
                        onClick={() => handleSubmitPrompt(prompt)}
                        disabled={isLoading}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {promptHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Prompts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {promptHistory.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-2 text-left font-normal"
                        onClick={() => loadPromptResponse(item)}
                      >
                        {item.prompt.length > 40
                          ? `${item.prompt.substring(0, 40)}...`
                          : item.prompt}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <AIResponseCard
              response={
                aiResponse ||
                "Ask me anything about the stocks you've analyzed. I can help with comparisons, recommendations, risk analysis, and more."
              }
              isLoading={isLoading}
            />
            
            {stocks.length === 0 ? (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No stocks available for analysis. Please add some stocks first.
                    </p>
                    <Button asChild>
                      <Link to="/stocks">Search for Stocks</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Stocks Being Analyzed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stocks.map((stock) => (
                      <div
                        key={stock.symbol}
                        className="bg-muted px-3 py-1 rounded-md text-sm"
                      >
                        {stock.symbol} (
                        <span
                          className={
                            stock.changePercent >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                        )
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Add this to make TypeScript happy
const Link = ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) => {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
};

export default AIInsightsPage;

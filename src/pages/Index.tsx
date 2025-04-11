
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockSymbolInput } from "@/components/stocks/StockSymbolInput";
import { StockCard, StockData } from "@/components/stocks/StockCard";
import { toast } from "sonner";
import { fetchStockData, saveStockData, getSavedStocks } from "@/services/stockService";
import { LineChart, BarChart2, Compass, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AIPromptInput } from "@/components/stocks/AIPromptInput";
import { AIResponseCard } from "@/components/stocks/AIResponseCard";
import { analyzeStocks } from "@/services/aiService";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [recentStocks, setRecentStocks] = useState<StockData[]>([]);
  const [savedStocks, setSavedStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Load saved stocks on mount
    loadSavedStocks();
    
    // Try to load recent stocks from session storage
    const recentStocksJson = sessionStorage.getItem("recentStocks");
    if (recentStocksJson) {
      setRecentStocks(JSON.parse(recentStocksJson));
    }
  }, []);

  const loadSavedStocks = async () => {
    const stocks = await getSavedStocks();
    setSavedStocks(stocks);
  };

  const handleFetchStocks = async (symbols: string[]) => {
    setIsLoading(true);
    try {
      const data = await fetchStockData(symbols);
      setRecentStocks(data);
      
      // Save to session storage
      sessionStorage.setItem("recentStocks", JSON.stringify(data));
      
      toast.success(`Fetched data for ${data.length} stocks`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch stock data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStock = async (stock: StockData) => {
    const success = await saveStockData(stock);
    if (success) {
      toast.success(`Saved ${stock.symbol} to database`);
      loadSavedStocks();
    }
  };

  const handleAnalyzeStocks = async (prompt: string) => {
    setIsAiLoading(true);
    try {
      const stocksToAnalyze = recentStocks.length > 0 ? recentStocks : savedStocks;
      if (stocksToAnalyze.length === 0) {
        toast.error("Please fetch or save some stocks first");
        return;
      }
      
      const response = await analyzeStocks(prompt, stocksToAnalyze);
      setAiResponse(response);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze stocks");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor, analyze, and manage your stock portfolio
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/import">
                <LineChart className="mr-2 h-4 w-4" />
                Import Data
              </Link>
            </Button>
            <Button asChild>
              <Link to="/stocks">
                <BarChart2 className="mr-2 h-4 w-4" />
                Stock Lookup
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quick Stock Lookup</CardTitle>
            </CardHeader>
            <CardContent>
              <StockSymbolInput onSubmit={handleFetchStocks} isLoading={isLoading} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Compass className="h-4 w-4" />
                <span>Ask me anything about stocks or the market</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4" />
                <span>Get AI-powered analysis and insights</span>
              </div>
              <Button asChild className="w-full mt-2">
                <Link to="/ai-insights">
                  Try AI Analysis
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Recent Stocks</TabsTrigger>
            <TabsTrigger value="saved">Saved Stocks</TabsTrigger>
            <TabsTrigger value="analysis">Quick Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-6">
            {recentStocks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentStocks.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onSave={handleSaveStock}
                    isSaved={savedStocks.some((s) => s.symbol === stock.symbol)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No recent stocks. Use the lookup above to fetch stock data.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            {savedStocks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedStocks.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onSave={handleSaveStock}
                    isSaved={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No saved stocks. Save stocks to view them here.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/stocks">Go to Stock Lookup</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <AIPromptInput 
                  onSubmit={handleAnalyzeStocks}
                  isLoading={isAiLoading}
                  placeholder="Ask about the stocks you've looked up or saved..."
                />
                
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Try asking:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>"Compare these stocks based on performance"</li>
                    <li>"Which stock has the best dividend yield?"</li>
                    <li>"Analyze the risk level of these stocks"</li>
                    <li>"Which stock would you recommend?"</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <AIResponseCard 
                  response={aiResponse} 
                  isLoading={isAiLoading} 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

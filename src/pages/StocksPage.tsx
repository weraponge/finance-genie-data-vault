
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockSymbolInput } from "@/components/stocks/StockSymbolInput";
import { StockCard, StockData } from "@/components/stocks/StockCard";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { fetchStockData, saveStockData, getSavedStocks } from "@/services/stockService";

const StocksPage = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [savedStocks, setSavedStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchStocks = async (symbols: string[]) => {
    setIsLoading(true);
    try {
      const data = await fetchStockData(symbols);
      setStocks(data);
      
      // Save to session storage for persistence
      sessionStorage.setItem("recentStocks", JSON.stringify(data));
      
      // Load saved stocks to check which ones are already saved
      const saved = await getSavedStocks();
      setSavedStocks(saved);
      
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
      
      // Update saved stocks
      const saved = await getSavedStocks();
      setSavedStocks(saved);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Lookup</h1>
          <p className="text-muted-foreground">
            Search for stocks and view their latest data
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <StockSymbolInput onSubmit={handleFetchStocks} isLoading={isLoading} />
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-32 bg-muted rounded animate-pulse mt-1" />
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <div key={j} className="flex justify-between">
                            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <div className="h-8 w-28 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : stocks.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onSave={handleSaveStock}
                  isSaved={savedStocks.some((s) => s.symbol === stock.symbol)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
};

export default StocksPage;

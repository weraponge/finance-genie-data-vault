
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { StockCard, StockData } from "@/components/stocks/StockCard";
import { toast } from "sonner";
import { saveStockData, getSavedStocks } from "@/services/stockService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const SavedStocksPage = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSavedStocks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStocks(stocks);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStocks(
        stocks.filter(
          (stock) =>
            stock.symbol.toLowerCase().includes(query) ||
            stock.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, stocks]);

  const loadSavedStocks = async () => {
    setIsLoading(true);
    try {
      const savedStocks = await getSavedStocks();
      setStocks(savedStocks);
      setFilteredStocks(savedStocks);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load saved stocks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async (stock: StockData) => {
    const success = await saveStockData(stock);
    if (success) {
      toast.success(`Updated ${stock.symbol} data`);
      loadSavedStocks();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saved Stocks</h1>
            <p className="text-muted-foreground">
              View and manage your saved stock data
            </p>
          </div>
          <div>
            <Button asChild>
              <Link to="/stocks">Add More Stocks</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Input
                placeholder="Search saved stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="space-y-4 text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p>Loading saved stocks...</p>
            </div>
          </div>
        ) : filteredStocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                onSave={handleUpdateStock}
                isSaved={true}
              />
            ))}
          </div>
        ) : stocks.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No stocks match your search. Try a different query.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You haven't saved any stocks yet.
            </p>
            <Button asChild className="mt-4">
              <Link to="/stocks">Search for Stocks</Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SavedStocksPage;

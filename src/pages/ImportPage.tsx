
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/stocks/FileUploader";
import { StockCard, StockData } from "@/components/stocks/StockCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockSymbolInput } from "@/components/stocks/StockSymbolInput";
import { toast } from "sonner";
import { fetchStockData, saveStockData, getSavedStocks } from "@/services/stockService";

const ImportPage = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [savedStocks, setSavedStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleProcessSymbols = async (symbols: string[]) => {
    setIsLoading(true);
    try {
      const data = await fetchStockData(symbols);
      setStocks(data);
      
      // Load saved stocks to check which ones are already saved
      const saved = await getSavedStocks();
      setSavedStocks(saved);
      
      toast.success(`Processed ${data.length} stocks`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to process stock data");
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
          <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
          <p className="text-muted-foreground">
            Import stock symbols via CSV or manual entry
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Options</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="csv">
              <TabsList className="mb-4">
                <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="csv">
                <div className="space-y-2">
                  <FileUploader onFileProcess={handleProcessSymbols} isLoading={isLoading} />
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV file should contain stock symbols in a column named "symbol" or "ticker", or simply one symbol per line.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="manual">
                <div className="space-y-2">
                  <StockSymbolInput onSubmit={handleProcessSymbols} isLoading={isLoading} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center p-8">
                <div className="space-y-4 text-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p>Processing stock data...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : stocks.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Imported Stocks</h2>
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

export default ImportPage;

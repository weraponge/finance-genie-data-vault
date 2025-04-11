
import { toast } from "sonner";
import { StockData } from "@/components/stocks/StockCard";

// Mock data for development until Supabase is connected
const mockStockData: Record<string, any> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.68,
    change: 1.28,
    changePercent: 0.69,
    attributes: [
      { label: "Market Cap", value: 2870000000000, type: "currency" },
      { label: "P/E Ratio", value: 29.12, type: "number" },
      { label: "Dividend Yield", value: 0.54, type: "percent" },
      { label: "52W High", value: 199.62, type: "currency" },
      { label: "52W Low", value: 143.90, type: "currency" },
      { label: "Volume", value: 48567200, type: "number" },
      { label: "Avg Volume", value: 56213800, type: "number" },
      { label: "Beta", value: 1.31, type: "number", info: "Measures volatility compared to the market" },
    ],
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 402.82,
    change: -1.52,
    changePercent: -0.38,
    attributes: [
      { label: "Market Cap", value: 3010000000000, type: "currency" },
      { label: "P/E Ratio", value: 35.07, type: "number" },
      { label: "Dividend Yield", value: 0.72, type: "percent" },
      { label: "52W High", value: 428.22, type: "currency" },
      { label: "52W Low", value: 309.64, type: "currency" },
      { label: "Volume", value: 20718600, type: "number" },
      { label: "Avg Volume", value: 26754300, type: "number" },
      { label: "Beta", value: 0.98, type: "number", info: "Measures volatility compared to the market" },
    ],
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 163.98,
    change: 0.87,
    changePercent: 0.53,
    attributes: [
      { label: "Market Cap", value: 2040000000000, type: "currency" },
      { label: "P/E Ratio", value: 25.07, type: "number" },
      { label: "Dividend Yield", value: 0.52, type: "percent" },
      { label: "52W High", value: 171.68, type: "currency" },
      { label: "52W Low", value: 115.35, type: "currency" },
      { label: "Volume", value: 18674300, type: "number" },
      { label: "Avg Volume", value: 23125600, type: "number" },
      { label: "Beta", value: 1.06, type: "number", info: "Measures volatility compared to the market" },
    ],
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 178.75,
    change: 1.13,
    changePercent: 0.64,
    attributes: [
      { label: "Market Cap", value: 1880000000000, type: "currency" },
      { label: "P/E Ratio", value: 60.75, type: "number" },
      { label: "Dividend Yield", value: 0, type: "percent" },
      { label: "52W High", value: 188.34, type: "currency" },
      { label: "52W Low", value: 118.35, type: "currency" },
      { label: "Volume", value: 35698200, type: "number" },
      { label: "Avg Volume", value: 41567900, type: "number" },
      { label: "Beta", value: 1.15, type: "number", info: "Measures volatility compared to the market" },
    ],
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 172.63,
    change: -4.29,
    changePercent: -2.42,
    attributes: [
      { label: "Market Cap", value: 551000000000, type: "currency" },
      { label: "P/E Ratio", value: 48.95, type: "number" },
      { label: "Dividend Yield", value: 0, type: "percent" },
      { label: "52W High", value: 256.60, type: "currency" },
      { label: "52W Low", value: 138.80, type: "currency" },
      { label: "Volume", value: 91073100, type: "number" },
      { label: "Avg Volume", value: 102574600, type: "number" },
      { label: "Beta", value: 2.01, type: "number", info: "Measures volatility compared to the market" },
    ],
  },
};

// This would typically be a real API call to Yahoo Finance
export async function fetchStockData(symbols: string[]): Promise<StockData[]> {
  try {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now we're using mock data, but this would be replaced with actual API call
    const results = symbols.map(symbol => {
      const stockData = mockStockData[symbol];
      
      if (!stockData) {
        // For symbols not in our mock data, create a random mock
        return {
          symbol,
          name: `${symbol} Corp`,
          price: 100 + Math.random() * 200,
          change: (Math.random() * 10) - 5,
          changePercent: (Math.random() * 5) - 2.5,
          attributes: [
            { label: "Market Cap", value: Math.random() * 1000000000, type: "currency" },
            { label: "P/E Ratio", value: 15 + Math.random() * 30, type: "number" },
            { label: "Dividend Yield", value: Math.random() * 3, type: "percent" },
            { label: "Volume", value: Math.random() * 10000000, type: "number" },
          ],
        };
      }
      
      return stockData;
    });

    return results;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    toast.error("Failed to fetch stock data. Please try again later.");
    return [];
  }
}

// Save stock data to local storage for now
// This would be replaced with Supabase integration
export async function saveStockData(stock: StockData): Promise<boolean> {
  try {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get existing saved stocks
    const savedStocksJson = localStorage.getItem("savedStocks");
    const savedStocks = savedStocksJson ? JSON.parse(savedStocksJson) : [];
    
    // Check if stock already exists
    const stockIndex = savedStocks.findIndex((s: StockData) => s.symbol === stock.symbol);
    
    if (stockIndex >= 0) {
      // Update existing stock
      savedStocks[stockIndex] = stock;
    } else {
      // Add new stock
      savedStocks.push(stock);
    }
    
    // Save back to localStorage
    localStorage.setItem("savedStocks", JSON.stringify(savedStocks));
    
    return true;
  } catch (error) {
    console.error("Error saving stock data:", error);
    toast.error("Failed to save stock data. Please try again later.");
    return false;
  }
}

// Get saved stocks from local storage
// This would be replaced with Supabase integration
export async function getSavedStocks(): Promise<StockData[]> {
  try {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const savedStocksJson = localStorage.getItem("savedStocks");
    return savedStocksJson ? JSON.parse(savedStocksJson) : [];
  } catch (error) {
    console.error("Error getting saved stocks:", error);
    toast.error("Failed to get saved stocks. Please try again later.");
    return [];
  }
}

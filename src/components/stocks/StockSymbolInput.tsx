
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StockSymbolInputProps {
  onSubmit: (symbols: string[]) => void;
  isLoading?: boolean;
}

export function StockSymbolInput({ onSubmit, isLoading = false }: StockSymbolInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast.error("Please enter at least one stock symbol");
      return;
    }
    
    const symbols = input
      .split(",")
      .map(symbol => symbol.trim().toUpperCase())
      .filter(symbol => symbol !== "");
    
    if (symbols.length === 0) {
      toast.error("Please enter valid stock symbols");
      return;
    }
    
    onSubmit(symbols);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter stock symbols separated by commas (e.g. AAPL, MSFT, GOOGL)"
            className="bg-card pr-10"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Enter ticker symbols separated by commas (e.g., AAPL, MSFT, GOOGL)
      </p>
    </form>
  );
}

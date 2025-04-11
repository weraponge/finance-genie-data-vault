
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StockAttribute {
  label: string;
  value: string | number;
  type?: "currency" | "percent" | "number" | "text";
  change?: number;
  info?: string;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  attributes: StockAttribute[];
}

interface StockCardProps {
  stock: StockData;
  onSave: (stock: StockData) => void;
  isSaved?: boolean;
}

export function StockCard({ stock, onSave, isSaved = false }: StockCardProps) {
  const formatValue = (attr: StockAttribute) => {
    if (attr.value === null || attr.value === undefined) return "N/A";
    
    if (attr.type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(attr.value));
    }
    
    if (attr.type === "percent") {
      return `${Number(attr.value).toFixed(2)}%`;
    }
    
    if (attr.type === "number") {
      return new Intl.NumberFormat("en-US").format(Number(attr.value));
    }
    
    return attr.value.toString();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{stock.symbol}</CardTitle>
              <Badge variant={stock.change >= 0 ? "default" : "destructive"}>
                {stock.change >= 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {stock.changePercent.toFixed(2)}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{stock.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">
              ${stock.price.toFixed(2)}
            </p>
            <p
              className={
                stock.change >= 0 ? "text-green-500" : "text-red-500"
              }
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          {stock.attributes.map((attr, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">{attr.label}</span>
                {attr.info && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{attr.info}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{formatValue(attr)}</span>
                {attr.change !== undefined && (
                  <span
                    className={
                      attr.change >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {attr.change >= 0 ? "+" : ""}
                    {attr.change.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant={isSaved ? "outline" : "default"}
            size="sm"
            onClick={() => onSave(stock)}
          >
            {isSaved ? "Saved" : "Save to Database"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

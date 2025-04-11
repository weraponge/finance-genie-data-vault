
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AIResponseCardProps {
  response: string;
  isLoading?: boolean;
}

export function AIResponseCard({ response, isLoading = false }: AIResponseCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ) : (
          <div className="text-sm whitespace-pre-line">{response}</div>
        )}
      </CardContent>
    </Card>
  );
}

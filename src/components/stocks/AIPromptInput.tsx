
import { useState } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AIPromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function AIPromptInput({
  onSubmit,
  isLoading = false,
  placeholder = "Ask AI to analyze the stock data...",
}: AIPromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="pr-16 resize-none min-h-[120px]"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-2 right-2"
          disabled={isLoading || !prompt.trim()}
        >
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
}

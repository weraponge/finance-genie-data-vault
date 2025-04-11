
import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileProcess: (symbols: string[]) => void;
  isLoading?: boolean;
}

export function FileUploader({ onFileProcess, isLoading = false }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "text/csv") {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const processFile = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const symbols = content
          .split(/[\n,]/)
          .map(symbol => symbol.trim().toUpperCase())
          .filter(symbol => symbol !== "" && symbol !== "SYMBOL" && symbol !== "TICKER");
        
        if (symbols.length === 0) {
          toast.error("No valid stock symbols found in the file");
          return;
        }
        
        onFileProcess(symbols);
      } catch (error) {
        console.error(error);
        toast.error("Error processing the file. Please check the format.");
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="w-full space-y-4">
      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("csv-upload")?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drag and drop your CSV file or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                The CSV should contain stock symbols in a column
              </p>
            </div>
          </div>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-muted p-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={removeFile}
            >
              <X size={18} />
            </Button>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={processFile} disabled={isLoading}>
              {isLoading ? "Processing..." : "Process File"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

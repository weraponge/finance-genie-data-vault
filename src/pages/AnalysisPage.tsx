
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIPromptInput } from "@/components/stocks/AIPromptInput";
import { AIResponseCard } from "@/components/stocks/AIResponseCard";
import { toast } from "sonner";
import { analyzeStocks } from "@/services/aiService";
import { getSavedStocks } from "@/services/stockService";
import { useWorkflows } from "@/hooks/use-workflows";
import { Button } from "@/components/ui/button";
import { BarChart2, PieChart, LineChart, FilePieChart, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnalysisPage = () => {
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { workflows } = useWorkflows();
  
  const handleCustomAnalysis = async (prompt: string) => {
    setIsLoading(true);
    setAiResponse("");
    
    try {
      // Get saved stocks for analysis
      const stocks = await getSavedStocks();
      
      if (stocks.length === 0) {
        toast.error("No stocks available for analysis. Please add some stocks first.");
        return;
      }
      
      // Use our AI service to analyze the stocks
      const response = await analyzeStocks(prompt, stocks);
      setAiResponse(response);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze stocks");
    } finally {
      setIsLoading(false);
    }
  };

  // Industry-specific analysis presets
  const industryAnalysis = [
    { 
      name: "Technology", 
      description: "Analyze tech stocks including metrics like R&D spend, innovation pipeline, and growth rates",
      prompt: "Analyze these technology stocks focusing on R&D investment, innovation pipeline, and market adoption rates"
    },
    { 
      name: "Financial", 
      description: "Evaluate financial stocks based on interest rate sensitivity, asset quality, and capital reserves",
      prompt: "Review these financial stocks considering interest rate sensitivity, asset quality, and regulatory capital"
    },
    { 
      name: "Healthcare", 
      description: "Examine healthcare stocks based on clinical pipelines, regulatory approvals, and market access",
      prompt: "Examine these healthcare stocks analyzing clinical pipelines, regulatory approvals, and market access"
    },
    { 
      name: "Energy", 
      description: "Assess energy stocks with focus on sustainability initiatives, regulatory impacts, and reserves",
      prompt: "Assess these energy stocks with focus on sustainability initiatives, regulatory impacts, and resource reserves"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Analysis</h1>
          <p className="text-muted-foreground">
            Deep insights and automated analysis for your portfolio
          </p>
        </div>

        <Tabs defaultValue="custom">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="custom">Custom Analysis</TabsTrigger>
            <TabsTrigger value="industry">Industry Analysis</TabsTrigger>
            <TabsTrigger value="workflows">Analysis Workflows</TabsTrigger>
          </TabsList>
          
          <TabsContent value="custom" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Custom Stock Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AIPromptInput
                      onSubmit={handleCustomAnalysis}
                      isLoading={isLoading}
                      placeholder="Ask for specific analysis of your stocks..."
                    />
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Example prompts:</h3>
                      <div className="space-y-2">
                        {[
                          "Compare these stocks based on P/E ratio and growth potential",
                          "Which of these stocks has the best risk/reward profile?",
                          "Analyze dividend yields and payout sustainability",
                          "Evaluate long-term growth prospects for these stocks",
                        ].map((prompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left text-xs h-auto py-2 font-normal"
                            onClick={() => handleCustomAnalysis(prompt)}
                            disabled={isLoading}
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <AIResponseCard
                  response={
                    aiResponse ||
                    "Enter a prompt to analyze your stocks. You can ask for comparisons, risk analysis, growth potential, and more."
                  }
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="industry" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industryAnalysis.map((industry, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{industry.name} Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{industry.description}</p>
                    <Button 
                      onClick={() => handleCustomAnalysis(industry.prompt)}
                      className="w-full"
                    >
                      Run {industry.name} Analysis
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="workflows" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflows.length > 0 ? (
                workflows.map((workflow) => (
                  <Card key={workflow.id}>
                    <CardHeader>
                      <CardTitle>{workflow.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{workflow.description}</p>
                      <Button className="w-full">Run Workflow</Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No analysis workflows created yet.
                      </p>
                      <Button>Create Your First Workflow</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AnalysisPage;

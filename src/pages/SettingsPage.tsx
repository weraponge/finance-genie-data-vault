
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("5");

  // This would connect to Supabase in a real implementation
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Handle theme changes
  useEffect(() => {
    // Apply dark mode to the body
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleConnectSupabase = () => {
    toast("Please connect to Supabase using the Supabase button in the top right corner.", {
      description: "Supabase integration is required for saving data and AI analysis.",
      action: {
        label: "Learn More",
        onClick: () => window.open("https://docs.lovable.dev/integrations/supabase/"),
      },
    });
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all locally saved data?")) {
      localStorage.removeItem("savedStocks");
      sessionStorage.removeItem("recentStocks");
      toast.success("All locally saved data has been cleared");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and connections
          </p>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API Connections</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for a more comfortable viewing experience in low light
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Refresh</CardTitle>
                <CardDescription>
                  Configure how often stock data refreshes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-refresh">Auto-Refresh</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically refresh stock data at regular intervals
                    </p>
                  </div>
                  <Switch
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>
                
                {autoRefresh && (
                  <div className="flex items-center gap-4 pt-2">
                    <Label htmlFor="refresh-interval">Refresh interval (minutes)</Label>
                    <Input
                      id="refresh-interval"
                      type="number"
                      min="1"
                      max="60"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(e.target.value)}
                      className="w-20"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supabase Connection</CardTitle>
                <CardDescription>
                  Connect to Supabase to enable data persistence and AI features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Connection Status</p>
                    <p className="text-sm text-muted-foreground">
                      {isSupabaseConnected
                        ? "Connected to Supabase"
                        : "Not connected to Supabase"}
                    </p>
                  </div>
                  <Button
                    variant={isSupabaseConnected ? "outline" : "default"}
                    onClick={handleConnectSupabase}
                  >
                    {isSupabaseConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
                
                {!isSupabaseConnected && (
                  <div className="bg-muted rounded-md p-4 text-sm">
                    <p>
                      Connect to Supabase to unlock additional features:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Persistent storage of stock data</li>
                      <li>Advanced AI analysis via Edge Functions</li>
                      <li>Real-time data updates</li>
                      <li>User authentication</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Yahoo Finance API</CardTitle>
                <CardDescription>
                  Configure Yahoo Finance API integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  The Yahoo Finance API integration is currently implemented with mock data. Connect to Supabase to enable live data.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your saved stock data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Currently, your stock data is stored locally in your browser. 
                    Connect to Supabase to enable persistent cloud storage.
                  </p>
                  <Button variant="destructive" onClick={handleClearData}>
                    Clear All Data
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <p className="font-medium mb-1">Export Data</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Export your stock data to a CSV file
                  </p>
                  <Button variant="outline">
                    Export to CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;

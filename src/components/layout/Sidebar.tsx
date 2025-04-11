
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  BarChart2,
  LineChart,
  Upload,
  Database,
  Brain,
  Settings,
  Home,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Stock Lookup", href: "/stocks", icon: BarChart2 },
  { title: "Analysis", href: "/analysis", icon: LineChart },
  { title: "Import Data", href: "/import", icon: Upload },
  { title: "Saved Data", href: "/saved", icon: Database },
  { title: "AI Insights", href: "/ai-insights", icon: Brain },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  return (
    <div
      className={cn(
        "bg-sidebar flex flex-col h-screen transition-all duration-300 border-r border-sidebar-border",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-xl font-bold text-sidebar-foreground">
            Finance<span className="text-primary">Genie</span>
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 mx-2 rounded-md transition-colors",
              location.pathname === item.href
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border flex justify-between items-center">
        {!collapsed && (
          <span className="text-xs text-sidebar-foreground/60">
            &copy; FinanceGenie 2025
          </span>
        )}
      </div>
    </div>
  );
}

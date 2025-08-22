import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Library, Sparkles } from "lucide-react";

type NavigationTab = "create" | "library";

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  storyCount: number;
}

export const Navigation = ({ activeTab, onTabChange, storyCount }: NavigationProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-xl shadow-magical">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                One-Minute Story
              </h1>
              <p className="text-xs text-muted-foreground">Creative AI Stories</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
            <Button
              variant={activeTab === "create" ? "magic" : "ghost"}
              size="sm"
              onClick={() => onTabChange("create")}
              className="gap-2"
            >
              <PenTool className="h-4 w-4" />
              Create
            </Button>
            
            <Button
              variant={activeTab === "library" ? "magic" : "ghost"}
              size="sm"
              onClick={() => onTabChange("library")}
              className="gap-2 relative"
            >
              <Library className="h-4 w-4" />
              Library
              {storyCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 px-1.5 py-0.5 text-xs leading-none min-w-[18px] h-[18px] flex items-center justify-center"
                >
                  {storyCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
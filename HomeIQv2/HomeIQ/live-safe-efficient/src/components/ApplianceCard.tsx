import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Power, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Appliance {
  id: string;
  name: string;
  type: string;
  icon: LucideIcon;
  currentUsage: number;
  normalUsage: number;
  status: "on" | "off";
  monthlyCost: number;
  energyLevel: "high" | "warning" | "normal" | "excellent";
}

interface ApplianceCardProps {
  appliance: Appliance;
  onToggle: () => void;
}

export const ApplianceCard = ({ appliance, onToggle }: ApplianceCardProps) => {
  const { name, icon: Icon, currentUsage, normalUsage, status, monthlyCost, energyLevel } = appliance;

  const getEnergyColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-orange-500 text-white";
      case "normal":
        return "bg-green-500 text-white";
      case "excellent":
        return "bg-emerald-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getEnergyText = (level: string) => {
    switch (level) {
      case "high":
        return "HIGH USAGE";
      case "warning":
        return "NEAR LIMIT";
      case "normal":
        return "NORMAL";
      case "excellent":
        return "EFFICIENT";
      default:
        return "UNKNOWN";
    }
  };

  const getTrendIcon = () => {
    if (currentUsage > normalUsage) return TrendingUp;
    if (currentUsage < normalUsage) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();
  const usagePercentage = normalUsage > 0 ? (currentUsage / normalUsage) * 100 : 0;

  return (
    <Card className="glass float-card group hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${status === "on" ? "bg-primary/20" : "bg-muted/50"} transition-colors`}>
              <Icon className={`w-6 h-6 ${status === "on" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">{name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-xs ${getEnergyColor(energyLevel)}`}>
                  {getEnergyText(energyLevel)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendIcon className="w-3 h-3" />
                  {currentUsage}W
                </div>
              </div>
            </div>
          </div>
          
          <Switch
            checked={status === "on"}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Usage vs Normal</span>
            <span className="font-medium text-foreground">{Math.round(usagePercentage)}%</span>
          </div>
          <Progress 
            value={Math.min(usagePercentage, 100)} 
            className="h-2"
            style={{
              background: energyLevel === "high" ? "rgba(239, 68, 68, 0.2)" : 
                         energyLevel === "warning" ? "rgba(245, 158, 11, 0.2)" : 
                         "rgba(34, 197, 94, 0.2)"
            }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground">Current Usage</p>
            <p className="text-lg font-bold text-foreground">{currentUsage}W</p>
          </div>
          
          <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground">Monthly Cost</p>
            <p className="text-lg font-bold text-foreground">R{monthlyCost}</p>
          </div>
        </div>

        {/* Warning Message */}
        {energyLevel === "high" && status === "on" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700 font-medium">
              ⚠️ High energy consumption detected! Consider turning off when not needed.
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant={status === "on" ? "destructive" : "hero"}
          size="sm"
          onClick={onToggle}
          className="w-full"
        >
          <Power className="w-4 h-4 mr-2" />
          {status === "on" ? "Turn Off" : "Turn On"}
        </Button>
      </CardContent>
    </Card>
  );
};
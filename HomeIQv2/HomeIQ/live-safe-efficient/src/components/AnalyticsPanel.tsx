import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  DollarSign,
  Calendar,
  Target,
  Lightbulb
} from "lucide-react";
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

interface AnalyticsPanelProps {
  appliances: Appliance[];
}

export const AnalyticsPanel = ({ appliances }: AnalyticsPanelProps) => {
  const totalCurrentUsage = appliances.reduce((sum, appliance) => sum + appliance.currentUsage, 0);
  const totalMonthlyCost = appliances.reduce((sum, appliance) => sum + appliance.monthlyCost, 0);
  const activeAppliances = appliances.filter(a => a.status === "on");
  
  // Mock historical data
  const weeklyUsage = [
    { day: "Mon", usage: 2800, cost: 980 },
    { day: "Tue", usage: 3200, cost: 1120 },
    { day: "Wed", usage: 2900, cost: 1015 },
    { day: "Thu", usage: 3400, cost: 1190 },
    { day: "Fri", usage: 2700, cost: 945 },
    { day: "Sat", usage: 4100, cost: 1435 },
    { day: "Sun", usage: 3800, cost: 1330 }
  ];

  const monthlyGoal = 25000; // R250 monthly budget
  const currentProgress = (totalMonthlyCost / monthlyGoal) * 100;

  const efficiencyTips = [
    {
      icon: Lightbulb,
      title: "Peak Hour Savings",
      description: "Switch off non-essential appliances between 6-9 PM to save R50+ monthly",
      savings: "R50-80"
    },
    {
      icon: TrendingDown,
      title: "Heater Optimization",
      description: "Reduce heater usage by 2 hours daily to cut costs significantly",
      savings: "R120-150"
    },
    {
      icon: Target,
      title: "Smart Scheduling",
      description: "Use appliances during off-peak hours for better rates",
      savings: "R30-60"
    }
  ];

  const getUsageBreakdown = () => {
    const breakdown = appliances.map(appliance => ({
      name: appliance.name,
      usage: appliance.currentUsage,
      cost: appliance.monthlyCost,
      percentage: totalCurrentUsage > 0 ? (appliance.currentUsage / totalCurrentUsage) * 100 : 0
    })).sort((a, b) => b.usage - a.usage);
    
    return breakdown;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Average</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(weeklyUsage.reduce((sum, day) => sum + day.usage, 0) / 7)}W
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Goal</p>
                <p className="text-2xl font-bold text-foreground">
                  R{totalMonthlyCost} / R{monthlyGoal/100}
                </p>
              </div>
              <Target className="w-8 h-8 text-energy-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficiency Score</p>
                <p className="text-2xl font-bold text-foreground">85%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-energy-excellent" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold text-foreground">R180</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Usage Breakdown
            </CardTitle>
            <CardDescription>
              Current energy consumption by appliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {getUsageBreakdown().map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="text-muted-foreground">{item.usage}W (R{item.cost})</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Trend
            </CardTitle>
            <CardDescription>
              Usage and cost trends over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyUsage.map((day) => (
                <div key={day.day} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground w-8">{day.day}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(day.usage / 4500) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{day.usage}W</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    R{day.cost/100}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goal Progress */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Monthly Budget Progress
          </CardTitle>
          <CardDescription>
            Track your progress towards your monthly energy budget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current: R{totalMonthlyCost}</span>
            <span className="text-sm text-muted-foreground">Goal: R{monthlyGoal/100}</span>
          </div>
          <Progress value={currentProgress} className="h-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {currentProgress < 80 ? "On Track" : currentProgress < 100 ? "Near Limit" : "Over Budget"}
            </span>
            <span className="text-muted-foreground">
              R{Math.round(monthlyGoal/100 - totalMonthlyCost)} remaining
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Tips */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Efficiency Tips
          </CardTitle>
          <CardDescription>
            Personalized recommendations to reduce your energy costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {efficiencyTips.map((tip, index) => (
              <div
                key={index}
                className="p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <tip.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{tip.description}</p>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Save {tip.savings}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
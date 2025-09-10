import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Lightbulb,
  ThermometerSun,
  Refrigerator,
  Tv,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface Appliance {
  id: string
  name: string
  type: string
  icon: any
  currentUsage: number
  normalUsage: number
  status: "on" | "off"
  monthlyCost: number
  energyLevel: "high" | "warning" | "normal" | "excellent"
}

interface CostPredictionPanelProps {
  appliances: Appliance[]
}

export function CostPredictionPanel({ appliances }: CostPredictionPanelProps) {
  const currentMonthCost = appliances.reduce((sum, appliance) => sum + appliance.monthlyCost, 0)
  const projectedNextMonth = Math.round(currentMonthCost * 1.15) // 15% increase projection
  const avgDailyCost = Math.round(currentMonthCost / 30)
  
  // Calculate peak hours cost (assuming 18:00-20:00 at 3x rate)
  const peakHoursCost = Math.round(currentMonthCost * 0.3)
  
  // Generate mock predictions for next 6 months
  const monthlyPredictions = [
    { month: "Oct 2024", cost: currentMonthCost, trend: "current" },
    { month: "Nov 2024", cost: projectedNextMonth, trend: "up" },
    { month: "Dec 2024", cost: Math.round(projectedNextMonth * 1.25), trend: "up" }, // Summer increase
    { month: "Jan 2025", cost: Math.round(projectedNextMonth * 1.35), trend: "up" },
    { month: "Feb 2025", cost: Math.round(projectedNextMonth * 1.20), trend: "down" },
    { month: "Mar 2025", cost: Math.round(projectedNextMonth * 0.95), trend: "down" },
  ]

  // Calculate potential savings
  const savingsOpportunities = [
    {
      appliance: "Living Room Heater",
      currentCost: 450,
      potentialSaving: 135,
      suggestion: "Reduce temperature by 2°C",
      icon: ThermometerSun
    },
    {
      appliance: "Living Room TV",
      currentCost: 65,
      potentialSaving: 20,
      suggestion: "Use sleep timer more often",
      icon: Tv
    },
    {
      appliance: "Kitchen Appliances",
      currentCost: 120,
      potentialSaving: 25,
      suggestion: "Avoid peak hour usage",
      icon: Refrigerator
    }
  ]

  const totalPotentialSavings = savingsOpportunities.reduce((sum, item) => sum + item.potentialSaving, 0)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Month</p>
                <p className="text-2xl font-bold text-foreground">R{currentMonthCost}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projected Next</p>
                <p className="text-2xl font-bold text-energy-warning">R{projectedNextMonth}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-energy-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Average</p>
                <p className="text-2xl font-bold text-foreground">R{avgDailyCost}</p>
              </div>
              <Calendar className="w-8 h-8 text-energy-excellent" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold text-energy-excellent">R{totalPotentialSavings}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-energy-excellent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Predictions */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              6-Month Cost Forecast
            </CardTitle>
            <CardDescription>
              Predicted electricity costs based on current usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyPredictions.map((prediction, index) => (
              <div
                key={prediction.month}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
              >
                <div className="flex items-center gap-3">
                  {prediction.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-energy-warning" />
                  ) : prediction.trend === "down" ? (
                    <TrendingDown className="w-4 h-4 text-energy-excellent" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{prediction.month}</p>
                    {index === 0 && (
                      <p className="text-xs text-muted-foreground">Current month</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">R{prediction.cost}</p>
                  {index > 0 && (
                    <Badge 
                      variant="outline" 
                      className={
                        prediction.trend === "up" 
                          ? "bg-orange-50 text-orange-700 border-orange-200" 
                          : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {prediction.trend === "up" ? "↑" : "↓"} 
                      {Math.abs(Math.round(((prediction.cost - monthlyPredictions[index-1].cost) / monthlyPredictions[index-1].cost) * 100))}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Savings Opportunities */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Savings Opportunities
            </CardTitle>
            <CardDescription>
              Smart suggestions to reduce your electricity bill
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {savingsOpportunities.map((opportunity) => (
              <div
                key={opportunity.appliance}
                className="p-4 bg-background/50 rounded-lg border border-border/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <opportunity.icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{opportunity.appliance}</p>
                      <p className="text-sm text-muted-foreground">Currently: R{opportunity.currentCost}/month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-energy-excellent">-R{opportunity.potentialSaving}</p>
                    <p className="text-xs text-muted-foreground">potential</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground">{opportunity.suggestion}</p>
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    Apply
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between p-3 bg-energy-excellent/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-energy-excellent" />
                  <p className="font-semibold text-foreground">Total Monthly Savings</p>
                </div>
                <p className="text-xl font-bold text-energy-excellent">R{totalPotentialSavings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours Analysis */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Peak Hours Impact
          </CardTitle>
          <CardDescription>
            Understanding time-of-use electricity rates in South Africa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-center">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Off-Peak</p>
                <p className="text-xs text-green-600 dark:text-green-400">22:00 - 06:00</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-2">R1.20/kWh</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Cheapest rates</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-center">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Standard</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">06:00 - 18:00</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-2">R1.85/kWh</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Normal rates</p>
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-center">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Peak</p>
                <p className="text-xs text-red-600 dark:text-red-400">18:00 - 22:00</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-2">R3.60/kWh</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Highest rates</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-2">Smart Tip</p>
                <p className="text-sm text-muted-foreground">
                  You're currently spending R{peakHoursCost}/month during peak hours. 
                  Try running your dishwasher, washing machine, and charging devices during off-peak hours 
                  to save up to R{Math.round(peakHoursCost * 0.6)}/month.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
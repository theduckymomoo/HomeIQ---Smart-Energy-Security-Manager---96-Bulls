import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Camera, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Flame,
  Bell,
  Mic,
  Phone,
  Users,
  MapPin
} from "lucide-react";
import securityCameraImage from "@/assets/security-camera.png";

export const SecurityPanel = () => {
  const [motionDetection, setMotionDetection] = useState(true);
  const [fireDetection, setFireDetection] = useState(true);
  const [securityMode, setSecurityMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mockCameras = [
    { id: "1", name: "Living Room", status: "active", location: "Ground Floor" },
    { id: "2", name: "Kitchen", status: "active", location: "Ground Floor" },
    { id: "3", name: "Front Door", status: "active", location: "Entrance" },
    { id: "4", name: "Backyard", status: "offline", location: "Outdoor" }
  ];

  const mockAlerts = [
    { id: "1", type: "motion", message: "Motion detected in Living Room", time: "2 minutes ago", severity: "medium" },
    { id: "2", type: "door", message: "Front door opened", time: "15 minutes ago", severity: "low" },
    { id: "3", type: "fire", message: "High temperature detected - Kitchen", time: "1 hour ago", severity: "high" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-orange-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleEmergencyRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      alert("Security footage recorded and sent to emergency contacts!");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Status</p>
                <p className="text-lg font-bold text-foreground">
                  {securityMode ? "ARMED" : "DISARMED"}
                </p>
              </div>
              <Shield className={`w-8 h-8 ${securityMode ? "text-red-500" : "text-muted-foreground"}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Cameras</p>
                <p className="text-lg font-bold text-foreground">
                  {mockCameras.filter(c => c.status === "active").length}/{mockCameras.length}
                </p>
              </div>
              <Camera className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recent Alerts</p>
                <p className="text-lg font-bold text-foreground">{mockAlerts.length}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Controls
            </CardTitle>
            <CardDescription>
              Manage your home security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Security Mode</p>
                <p className="text-sm text-muted-foreground">Arm/disarm security system</p>
              </div>
              <Switch
                checked={securityMode}
                onCheckedChange={setSecurityMode}
                className="data-[state=checked]:bg-red-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Motion Detection</p>
                <p className="text-sm text-muted-foreground">Detect movement in key areas</p>
              </div>
              <Switch
                checked={motionDetection}
                onCheckedChange={setMotionDetection}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Fire Detection</p>
                <p className="text-sm text-muted-foreground">Monitor for fire hazards</p>
              </div>
              <Switch
                checked={fireDetection}
                onCheckedChange={setFireDetection}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Emergency Recording
            </CardTitle>
            <CardDescription>
              Quick access security recording
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img 
                src={securityCameraImage} 
                alt="Security Camera View" 
                className="w-full h-32 object-cover rounded-lg border border-border/50"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-green-500 text-white border-green-500">
                  LIVE
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={isRecording ? "destructive" : "hero"}
                onClick={handleEmergencyRecord}
                disabled={isRecording}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                {isRecording ? "Recording..." : "Record"}
              </Button>
              
              <Button variant="outline" className="w-full">
                <Mic className="w-4 h-4 mr-2" />
                Audio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera Grid */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Camera Status
          </CardTitle>
          <CardDescription>
            Monitor all connected security cameras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockCameras.map((camera) => (
              <div
                key={camera.id}
                className="p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{camera.name}</h4>
                  <Badge
                    variant="outline"
                    className={camera.status === "active" ? "bg-green-500 text-white border-green-500" : "bg-red-500 text-white border-red-500"}
                  >
                    {camera.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {camera.location}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recent Alerts
          </CardTitle>
          <CardDescription>
            Latest security notifications and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                    {alert.type === "fire" ? (
                      <Flame className="w-4 h-4" />
                    ) : alert.type === "motion" ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Actions
          </CardTitle>
          <CardDescription>
            Quick access to emergency services and contacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="emergency" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Call Security
            </Button>
            
            <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">
              <Users className="w-4 h-4 mr-2" />
              Alert Neighbors
            </Button>
            
            <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
              <Phone className="w-4 h-4 mr-2" />
              Emergency Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
"use client"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Zap,
  Shield,
  BarChart3,
  Settings,
  Plus,
  AlertTriangle,
  Camera,
  Mic,
  Power,
  ThermometerSun,
  Tv,
  Refrigerator,
  WashingMachine,
  Clock,
  User,
  Bell,
  Palette,
  Save,
  X,
  Microwave,
  Fan,
  Lightbulb,
  AirVent,
  Coffee,
  Users,
  Mail,
  Phone,
  MapPin,
  Volume2,
  Smartphone,
  Moon,
  Sun,
  LogOut
} from "lucide-react";
import homeIQLogo from "@/assets/home-iq-logo.png";
import { ApplianceCard } from "@/components/ApplianceCard";
import { SecurityPanel } from "@/components/SecurityPanel";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { LucideIcon } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface Appliance {
  id: string;
  name: string;
  type: string;
  room?: string;
  description?: string;
  icon: LucideIcon;
  currentUsage: number;
  normalUsage: number;
  status: "on" | "off";
  monthlyCost: number;
  energyLevel: "high" | "warning" | "normal" | "excellent";
  user_id: string;
  created_at: string;
}

const applianceTypes = [
  // Kitchen Appliances
  { value: "refrigerator", label: "Refrigerator", icon: Refrigerator, avgUsage: 150 },
  { value: "microwave", label: "Microwave", icon: Microwave, avgUsage: 1000 },
  { value: "coffee-maker", label: "Coffee Maker", icon: Coffee, avgUsage: 800 },
  { value: "dishwasher", label: "Dishwasher", icon: WashingMachine, avgUsage: 1800 },
  { value: "oven", label: "Oven", icon: Zap, avgUsage: 2400 },
  { value: "toaster", label: "Toaster", icon: Zap, avgUsage: 1200 },
  { value: "blender", label: "Blender", icon: Zap, avgUsage: 400 },
  { value: "kettle", label: "Electric Kettle", icon: Coffee, avgUsage: 1500 },
  { value: "rice-cooker", label: "Rice Cooker", icon: Coffee, avgUsage: 300 },
  { value: "food-processor", label: "Food Processor", icon: Zap, avgUsage: 600 },
  
  // Laundry & Cleaning
  { value: "washing-machine", label: "Washing Machine", icon: WashingMachine, avgUsage: 500 },
  { value: "dryer", label: "Tumble Dryer", icon: WashingMachine, avgUsage: 2500 },
  { value: "vacuum-cleaner", label: "Vacuum Cleaner", icon: Power, avgUsage: 1000 },
  { value: "iron", label: "Iron", icon: ThermometerSun, avgUsage: 1100 },
  
  // Climate Control
  { value: "air-conditioner", label: "Air Conditioner", icon: AirVent, avgUsage: 3000 },
  { value: "heater", label: "Space Heater", icon: ThermometerSun, avgUsage: 2000 },
  { value: "fan", label: "Ceiling/Desk Fan", icon: Fan, avgUsage: 75 },
  { value: "heat-pump", label: "Heat Pump", icon: AirVent, avgUsage: 4000 },
  { value: "dehumidifier", label: "Dehumidifier", icon: AirVent, avgUsage: 600 },
  { value: "humidifier", label: "Humidifier", icon: AirVent, avgUsage: 25 },
  
  // Electronics & Entertainment
  { value: "tv", label: "Television", icon: Tv, avgUsage: 100 },
  { value: "computer", label: "Desktop Computer", icon: Smartphone, avgUsage: 300 },
  { value: "laptop", label: "Laptop", icon: Smartphone, avgUsage: 65 },
  { value: "gaming-console", label: "Gaming Console", icon: Tv, avgUsage: 150 },
  { value: "sound-system", label: "Sound System", icon: Volume2, avgUsage: 50 },
  { value: "router", label: "WiFi Router", icon: Smartphone, avgUsage: 12 },
  { value: "printer", label: "Printer", icon: Smartphone, avgUsage: 30 },
  
  // Lighting
  { value: "light-led", label: "LED Light", icon: Lightbulb, avgUsage: 10 },
  { value: "light-incandescent", label: "Incandescent Light", icon: Lightbulb, avgUsage: 60 },
  { value: "light-fluorescent", label: "Fluorescent Light", icon: Lightbulb, avgUsage: 32 },
  { value: "outdoor-lights", label: "Outdoor Lighting", icon: Lightbulb, avgUsage: 150 },
  { value: "smart-bulbs", label: "Smart Bulbs", icon: Lightbulb, avgUsage: 12 },
  
  // Water & Plumbing
  { value: "water-heater", label: "Electric Water Heater", icon: ThermometerSun, avgUsage: 4000 },
  { value: "pool-pump", label: "Pool Pump", icon: Power, avgUsage: 2200 },
  { value: "pool-heater", label: "Pool Heater", icon: ThermometerSun, avgUsage: 5000 },
  { value: "water-pump", label: "Water Pump", icon: Power, avgUsage: 800 },
  
  // Security & Monitoring
  { value: "security-camera", label: "Security Camera", icon: Camera, avgUsage: 15 },
  { value: "alarm-system", label: "Alarm System", icon: Shield, avgUsage: 20 },
  { value: "electric-gate", label: "Electric Gate", icon: Power, avgUsage: 300 },
  { value: "garage-door", label: "Garage Door Opener", icon: Power, avgUsage: 350 },
  
  // Health & Wellness
  { value: "treadmill", label: "Treadmill", icon: Power, avgUsage: 700 },
  { value: "exercise-bike", label: "Exercise Bike", icon: Power, avgUsage: 50 },
  { value: "air-purifier", label: "Air Purifier", icon: AirVent, avgUsage: 50 },
  { value: "electric-blanket", label: "Electric Blanket", icon: ThermometerSun, avgUsage: 200 },
  
  // Workshop & Garage
  { value: "power-tools", label: "Power Tools", icon: Power, avgUsage: 1200 },
  { value: "welder", label: "Welder", icon: Zap, avgUsage: 7000 },
  { value: "compressor", label: "Air Compressor", icon: Power, avgUsage: 2200 },
  { value: "workbench-light", label: "Workbench Lighting", icon: Lightbulb, avgUsage: 100 },
  
  // Outdoor & Garden
  { value: "lawn-mower", label: "Electric Lawn Mower", icon: Power, avgUsage: 1200 },
  { value: "hedge-trimmer", label: "Hedge Trimmer", icon: Power, avgUsage: 400 },
  { value: "pressure-washer", label: "Pressure Washer", icon: Power, avgUsage: 2000 },
  { value: "garden-lights", label: "Garden Lighting", icon: Lightbulb, avgUsage: 200 },
  
  // Specialty Items
  { value: "freezer", label: "Chest Freezer", icon: Refrigerator, avgUsage: 200 },
  { value: "wine-fridge", label: "Wine Fridge", icon: Refrigerator, avgUsage: 100 },
  { value: "electric-vehicle", label: "EV Charger", icon: Zap, avgUsage: 7200 },
  { value: "hot-tub", label: "Hot Tub/Jacuzzi", icon: ThermometerSun, avgUsage: 6000 },
  { value: "aquarium", label: "Aquarium System", icon: Power, avgUsage: 150 },
  { value: "sewing-machine", label: "Sewing Machine", icon: Power, avgUsage: 100 },
  
  // Generic/Other
  { value: "other", label: "Other Appliance", icon: Zap, avgUsage: 500 }
];

const getEnergyLevel = (usage: number): "high" | "warning" | "normal" | "excellent" => {
  if (usage > 2000) return "high";
  if (usage > 500) return "warning";
  if (usage > 100) return "normal";
  return "excellent";
};

const getApplianceIcon = (type: string): LucideIcon => {
  const applianceType = applianceTypes.find(at => at.value === type);
  return applianceType?.icon || Zap;
};

// Add Appliance Modal Component
const AddApplianceModal = ({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    room: "",
    description: "",
    customUsage: ""
  });

  const selectedType = applianceTypes.find(type => type.value === formData.type);
  const estimatedUsage = formData.customUsage ?
    parseInt(formData.customUsage) :
    selectedType?.avgUsage || 0;

  const handleSubmit = async () => {
    if (!formData.name || !formData.type || !user) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const now = new Date().toISOString();
      
      const applianceData = {
        user_id: user.id,
        name: formData.name,
        type: formData.type,
        room: formData.room || null,
        description: formData.description || null,
        normal_usage: estimatedUsage,
        status: 'off',
        created_at: now
      };

      console.log('Creating appliance with data:', applianceData);

      const { data, error } = await supabase
        .from('appliances')
        .insert(applianceData)
        .select()
        .single();

      if (error) {
        console.error('Error creating appliance:', error);
        alert('Failed to add appliance. Please try again.');
        return;
      }

      console.log('Appliance created successfully:', data);
      onAdd();
      onClose();
    } catch (error) {
      console.error('Unexpected error creating appliance:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderApplianceTypeSelect = () => {
    const categories = [
      {
        label: "Kitchen Appliances",
        items: ['refrigerator', 'microwave', 'coffee-maker', 'dishwasher', 'oven', 'toaster', 'blender', 'kettle', 'rice-cooker', 'food-processor']
      },
      {
        label: "Laundry & Cleaning",
        items: ['washing-machine', 'dryer', 'vacuum-cleaner', 'iron']
      },
      {
        label: "Climate Control",
        items: ['air-conditioner', 'heater', 'fan', 'heat-pump', 'dehumidifier', 'humidifier']
      },
      {
        label: "Electronics & Entertainment",
        items: ['tv', 'computer', 'laptop', 'gaming-console', 'sound-system', 'router', 'printer']
      },
      {
        label: "Lighting",
        items: ['light-led', 'light-incandescent', 'light-fluorescent', 'outdoor-lights', 'smart-bulbs']
      },
      {
        label: "Water & Plumbing",
        items: ['water-heater', 'pool-pump', 'pool-heater', 'water-pump']
      },
      {
        label: "Security & Monitoring",
        items: ['security-camera', 'alarm-system', 'electric-gate', 'garage-door']
      },
      {
        label: "Health & Wellness",
        items: ['treadmill', 'exercise-bike', 'air-purifier', 'electric-blanket']
      },
      {
        label: "Workshop & Garage",
        items: ['power-tools', 'welder', 'compressor', 'workbench-light']
      },
      {
        label: "Outdoor & Garden",
        items: ['lawn-mower', 'hedge-trimmer', 'pressure-washer', 'garden-lights']
      },
      {
        label: "Specialty Items",
        items: ['freezer', 'wine-fridge', 'electric-vehicle', 'hot-tub', 'aquarium', 'sewing-machine', 'other']
      }
    ];

    return (
      <SelectContent className="max-h-80">
        {categories.map((category, index) => (
          <div key={category.label}>
            {index > 0 && <div className="border-t mt-1 pt-2" />}
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              {category.label}
            </div>
            {applianceTypes.filter(type => 
              category.items.includes(type.value)
            ).map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Add New Appliance</CardTitle>
              <CardDescription>
                Add a smart appliance to monitor and control
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applianceName">Appliance Name *</Label>
                  <Input
                    id="applianceName"
                    placeholder="Living Room TV"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Room/Location</Label>
                  <Input
                    id="room"
                    placeholder="Living Room"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applianceType">Appliance Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select appliance type" />
                  </SelectTrigger>
                  {renderApplianceTypeSelect()}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about this appliance..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-background/50 min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Power Configuration</h3>

              <div className="space-y-2">
                <Label htmlFor="customUsage">Power Usage (Watts)</Label>
                <Input
                  id="customUsage"
                  type="number"
                  placeholder={`Estimated: ${selectedType?.avgUsage || 0}W`}
                  value={formData.customUsage}
                  onChange={(e) => setFormData({...formData, customUsage: e.target.value})}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to use estimated usage based on appliance type
                </p>
              </div>

              {(formData.type || estimatedUsage > 0) && (
                <Card className="bg-accent/20 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {selectedType && <selectedType.icon className="w-5 h-5 text-primary" />}
                      <h4 className="font-semibold">Usage Preview</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Estimated Usage</p>
                        <p className="font-semibold">{estimatedUsage}W</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly Cost</p>
                        <p className="font-semibold">R{Math.round(estimatedUsage * 0.35)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Energy Level</p>
                        <Badge className={`energy-${getEnergyLevel(estimatedUsage)}`}>
                          {getEnergyLevel(estimatedUsage).toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Daily Cost</p>
                        <p className="font-semibold">R{(estimatedUsage * 0.35 / 30).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Adding..." : "Add Appliance"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Settings Page Component
const SettingsPage = ({ onClose }: { onClose: () => void }) => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
  
  const [profileData, setProfileData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    groupChat: ""
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushNotifications: true,
    emergencyAlerts: true,
    energyThreshold: true,
    securityAlerts: true,
    maintenanceReminders: false
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    biometricAuth: true,
    sessionTimeout: "30",
    allowRemoteAccess: true,
    shareLocation: true
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    currency: "ZAR",
    energyUnit: "kWh",
    tempUnit: "celsius",
    soundEnabled: true,
    autoSave: true
  });

  useEffect(() => {
    if (profile && user) {
      setProfileData({
        username: profile.username || "",
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: user.email || profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        emergencyContact: profile.emergency_contact || "",
        emergencyPhone: profile.emergency_phone || "",
        groupChat: profile.group_chat || ""
      });
    }
  }, [profile, user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        username: profileData.username,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        emergency_contact: profileData.emergencyContact,
        emergency_phone: profileData.emergencyPhone,
        group_chat: profileData.groupChat || null
      });

      if (error) {
        alert(`Failed to save settings: ${error}`);
      } else {
        alert("Settings saved successfully!");
        onClose();
      }
    } catch (error) {
      alert(`Error saving settings: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Settings
              </CardTitle>
              <CardDescription>
                Manage your account and application preferences
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/50">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="groupChat">WhatsApp Group Chat</Label>
                      <Input
                        id="groupChat"
                        value={profileData.groupChat}
                        onChange={(e) => setProfileData({...profileData, groupChat: e.target.value})}
                        placeholder="Group invitation link"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="Your home address"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Emergency Contact
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          value={profileData.emergencyContact}
                          onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          value={profileData.emergencyPhone}
                          onChange={(e) => setProfileData({...profileData, emergencyPhone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive alerts and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getNotificationDescription(key)}
                        </div>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNotifications({...notifications, [key]: checked})
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecurity({...security, twoFactorAuth: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Biometric Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition
                      </div>
                    </div>
                    <Switch
                      checked={security.biometricAuth}
                      onCheckedChange={(checked) =>
                        setSecurity({...security, biometricAuth: checked})
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(value) => setSecurity({...security, sessionTimeout: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Allow Remote Access</div>
                      <div className="text-sm text-muted-foreground">
                        Control appliances when away from home
                      </div>
                    </div>
                    <Switch
                      checked={security.allowRemoteAccess}
                      onCheckedChange={(checked) =>
                        setSecurity({...security, allowRemoteAccess: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Share Location</div>
                      <div className="text-sm text-muted-foreground">
                        Allow location sharing for emergency services
                      </div>
                    </div>
                    <Switch
                      checked={security.shareLocation}
                      onCheckedChange={(checked) =>
                        setSecurity({...security, shareLocation: checked})
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>Customize your Home IQ experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={preferences.theme}
                        onValueChange={(value) => setPreferences({...preferences, theme: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <Sun className="w-4 h-4" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <Moon className="w-4 h-4" />
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="auto">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              Auto
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => setPreferences({...preferences, language: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="af">Afrikaans</SelectItem>
                          <SelectItem value="zu">isiZulu</SelectItem>
                          <SelectItem value="xh">isiXhosa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={preferences.currency}
                        onValueChange={(value) => setPreferences({...preferences, currency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ZAR">South African Rand (R)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="energyUnit">Energy Unit</Label>
                      <Select
                        value={preferences.energyUnit}
                        onValueChange={(value) => setPreferences({...preferences, energyUnit: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kWh">Kilowatt-hour (kWh)</SelectItem>
                          <SelectItem value="Wh">Watt-hour (Wh)</SelectItem>
                          <SelectItem value="MWh">Megawatt-hour (MWh)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tempUnit">Temperature Unit</Label>
                      <Select
                        value={preferences.tempUnit}
                        onValueChange={(value) => setPreferences({...preferences, tempUnit: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="celsius">Celsius (°C)</SelectItem>
                          <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base font-medium">Sound Enabled</div>
                        <div className="text-sm text-muted-foreground">
                          Play notification sounds and alerts
                        </div>
                      </div>
                      <Switch
                        checked={preferences.soundEnabled}
                        onCheckedChange={(checked) =>
                          setPreferences({...preferences, soundEnabled: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base font-medium">Auto-Save</div>
                        <div className="text-sm text-muted-foreground">
                          Automatically save changes as you make them
                        </div>
                      </div>
                      <Switch
                        checked={preferences.autoSave}
                        onCheckedChange={(checked) =>
                          setPreferences({...preferences, autoSave: checked})
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function getNotificationDescription(key: string): string {
    const descriptions: Record<string, string> = {
      emailAlerts: "Receive alerts via email",
      smsAlerts: "Receive alerts via SMS",
      pushNotifications: "Show browser notifications",
      emergencyAlerts: "Critical emergency notifications",
      energyThreshold: "Energy usage threshold alerts",
      securityAlerts: "Security system notifications",
      maintenanceReminders: "Appliance maintenance reminders"
    };
    return descriptions[key] || "";
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("appliances");
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loadingAppliances, setLoadingAppliances] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddAppliance, setShowAddAppliance] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Fetch appliances from database
  const fetchAppliances = async () => {
    if (!user) return;

    setLoadingAppliances(true);
    try {
      console.log('Fetching appliances for user:', user.id);
      
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appliances:', error);
        return;
      }

      console.log('Fetched appliances from database:', data);

      // Transform database data to match frontend interface
      const transformedAppliances: Appliance[] = data.map(dbAppliance => ({
        id: dbAppliance.id,
        name: dbAppliance.name,
        type: dbAppliance.type,
        room: dbAppliance.room,
        description: dbAppliance.description,
        icon: getApplianceIcon(dbAppliance.type),
        currentUsage: dbAppliance.status === 'on' ? dbAppliance.normal_usage : 0,
        normalUsage: dbAppliance.normal_usage,
        status: dbAppliance.status as "on" | "off",
        monthlyCost: dbAppliance.status === 'on' ? Math.round(dbAppliance.normal_usage * 0.35) : 0,
        energyLevel: getEnergyLevel(dbAppliance.normal_usage),
        user_id: dbAppliance.user_id,
        created_at: dbAppliance.created_at
      }));

      setAppliances(transformedAppliances);
    } catch (error) {
      console.error('Unexpected error fetching appliances:', error);
    } finally {
      setLoadingAppliances(false);
    }
  };

  // Fetch appliances on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchAppliances();
    }
  }, [user]);

  // Real-time data simulation for existing appliances
  useEffect(() => {
    const simulateDataUpdate = () => {
      setAppliances(prevAppliances =>
        prevAppliances.map(appliance => {
          if (appliance.status === "on") {
            const usageVariation = Math.random() * 20 - 10; // +/- 10W
            const newUsage = Math.max(0, appliance.normalUsage + usageVariation);
            const newCost = Math.round(newUsage * 0.35);

            const shouldToggleOff = Math.random() < 0.05; // 5% chance to turn off

            if (shouldToggleOff) {
              return {
                ...appliance,
                status: "off" as const,
                currentUsage: 0,
                monthlyCost: 0,
              };
            }

            return {
              ...appliance,
              currentUsage: Math.round(newUsage),
              monthlyCost: newCost,
            };
          }
          return appliance;
        })
      );
    };

    const intervalId = setInterval(simulateDataUpdate, 5000);
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    console.log('=== DASHBOARD USER DATA ===');
    console.log('User object:', user ? {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata,
      aud: user.aud,
      role: user.role
    } : null);
    
    console.log('Profile object:', profile ? {
      id: profile.id,
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      emergency_contact: profile.emergency_contact,
      emergency_phone: profile.emergency_phone,
      group_chat: profile.group_chat,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    } : null);
    
    console.log('Display Name:', profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown User');
    console.log('Email Display:', user?.email || 'No email');
    console.log('=== END DASHBOARD DATA ===');
  }, [user, profile]);

  const totalCurrentUsage = appliances.reduce((sum, appliance) => sum + appliance.currentUsage, 0);
  const totalMonthlyCost = appliances.reduce((sum, appliance) => sum + appliance.monthlyCost, 0);

  const toggleAppliance = async (id: string) => {
    const appliance = appliances.find(a => a.id === id);
    if (!appliance) return;

    const newStatus = appliance.status === "on" ? "off" : "on";
    
    try {
      // Update database
      const { error } = await supabase
        .from('appliances')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating appliance status:', error);
        return;
      }

      // Update local state
      setAppliances(prev => prev.map(appliance =>
        appliance.id === id
          ? {
              ...appliance,
              status: newStatus as "on" | "off",
              currentUsage: newStatus === "on" ? appliance.normalUsage : 0,
              monthlyCost: newStatus === "on" ? Math.round(appliance.normalUsage * 0.35) : 0
            }
          : appliance
      ));
    } catch (error) {
      console.error('Unexpected error toggling appliance:', error);
    }
  };

  const handleAddAppliance = () => {
    // Refresh appliances after adding new one
    fetchAppliances();
  };

  const handleSignOut = async () => {
    console.log('Dashboard: Starting sign out process');
    console.log('Current user before signout:', user ? {
      id: user.id,
      email: user.email
    } : 'No user');
    console.log('Current profile before signout:', profile ? {
      name: `${profile.first_name} ${profile.last_name}`,
      username: profile.username
    } : 'No profile');
    
    await signOut();
    
    console.log('Dashboard: Navigating to login after signout');
    navigate('/login');
  };

  if (!user) {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={homeIQLogo || "/placeholder.svg"} alt="Home IQ" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Home IQ</h1>
                <p className="text-xs text-muted-foreground">Smart Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-foreground">{totalCurrentUsage}W</p>
                  <p className="text-muted-foreground">Current Usage</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">R{totalMonthlyCost}</p>
                  <p className="text-muted-foreground">Monthly Cost</p>
                </div>
              </div>

              {/* User info display */}
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-primary font-bold">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'User'}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>

              {/* Emergency Buttons */}
              <Button variant="destructive" size="sm">
                <AlertTriangle className="w-4 h-4" />
                PANIC
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="appliances" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Appliances</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="controls" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Controls</span>
            </TabsTrigger>
          </TabsList>

          {/* Appliances Tab */}
          <TabsContent value="appliances" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Usage</p>
                      <p className="text-2xl font-bold text-foreground">{totalCurrentUsage}W</p>
                    </div>
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Cost</p>
                      <p className="text-2xl font-bold text-foreground">R{totalMonthlyCost}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-energy-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Devices</p>
                      <p className="text-2xl font-bold text-foreground">
                        {appliances.filter(a => a.status === "on").length}
                      </p>
                    </div>
                    <Power className="w-8 h-8 text-energy-excellent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                      <p className="text-2xl font-bold text-foreground">85%</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-energy-excellent/20 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-energy-excellent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Your Appliances Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Your Appliances</h2>
                <Button
                  onClick={() => setShowAddAppliance(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Appliance
                </Button>
              </div>
              
              {loadingAppliances ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading appliances...</p>
                  </div>
                </div>
              ) : appliances.length === 0 ? (
                <Card className="glass">
                  <CardContent className="p-12 text-center">
                    <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Appliances Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start building your smart home by adding your first appliance.
                    </p>
                    <Button
                      onClick={() => setShowAddAppliance(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Appliance
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appliances.map((appliance) => (
                    <ApplianceCard
                      key={appliance.id}
                      appliance={appliance}
                      onToggle={() => toggleAppliance(appliance.id)}
                      variant="default"
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <SecurityPanel />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsPanel appliances={appliances} />
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Camera Controls
                  </CardTitle>
                  <CardDescription>
                    Quick access to record security footage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Recording
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Smart Scheduling
                  </CardTitle>
                  <CardDescription>
                    Set automated schedules for your appliances
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Set Timer
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Routine
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      {showSettings && (
        <SettingsPage onClose={() => setShowSettings(false)} />
      )}

      {showAddAppliance && (
        <AddApplianceModal
          onClose={() => setShowAddAppliance(false)}
          onAdd={handleAddAppliance}
        />
      )}
    </div>
  );
};

export default Dashboard;
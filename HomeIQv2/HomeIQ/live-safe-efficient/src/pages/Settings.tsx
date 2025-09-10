// src/pages/Settings.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  SettingsIcon,
  User,
  Bell,
  Shield,
  Save,
  RotateCcw,
  ArrowLeft,
  AlertCircle,
  Database,
  Loader2,
} from "lucide-react";
import homeIQLogo from "@/assets/home-iq-logo.png";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Updated profile data state to match your database schema exactly
  const [profileData, setProfileData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    group_chat: "",
  });

  // Track original data for comparison
  const [originalData, setOriginalData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    group_chat: "",
  });

  // Track if data has been modified
  const [hasChanges, setHasChanges] = useState(false);

  const [notification, setNotification] = useState({
    email: true,
    sms: false,
    app: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    biometrics: false,
  });

  const [system, setSystem] = useState({
    language: "english",
    timezone: "africa/johannesburg",
  });

  // Enhanced profile data loading with better error handling
  useEffect(() => {
    console.log('=== SETTINGS PAGE PROFILE LOADING ===');
    console.log('Auth loading:', authLoading);
    console.log('User exists:', !!user);
    console.log('Profile exists:', !!profile);
    
    if (user && profile) {
      console.log('Full profile data received:', {
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
      });

      // Map database fields directly to form fields with proper fallbacks
      const newProfileData = {
        username: profile.username || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || user.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        emergency_contact: profile.emergency_contact || "",
        emergency_phone: profile.emergency_phone || "",
        group_chat: profile.group_chat || "",
      };
      
      console.log('Mapped profile data for form:', newProfileData);
      
      setProfileData(newProfileData);
      setOriginalData(newProfileData);
      setHasChanges(false);
      
      console.log('Profile data loaded successfully into form');
    } else if (!authLoading) {
      console.log('Missing data after auth loading completed');
      if (!user) {
        console.log('No user found - redirecting to login');
      }
      if (!profile) {
        console.log('No profile found - this should be created automatically');
      }
    }
    
    console.log('=== END SETTINGS PROFILE LOADING ===');
  }, [profile, user, authLoading]);

  // Handle profile data changes with proper change detection
  const handleProfileChange = (field: string, value: string) => {
    console.log(`Profile field changed: ${field} = "${value}"`);
    
    setProfileData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Check if data has been modified from original
      const hasModifications = Object.keys(newData).some(
        key => key !== 'email' && newData[key as keyof typeof newData] !== originalData[key as keyof typeof originalData]
      );
      
      console.log('Change detection result:', {
        field,
        oldValue: prev[field as keyof typeof prev],
        newValue: value,
        hasModifications
      });
      
      setHasChanges(hasModifications);
      return newData;
    });
  };

  const handleSaveSettings = async () => {
    console.log('Starting save process...');
    console.log('Has changes:', hasChanges);
    console.log('Current profile data:', profileData);
    console.log('Original profile data:', originalData);
    
    if (!hasChanges) {
      console.log('No changes to save');
      toast({
        title: "No Changes",
        description: "No changes were made to save.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save settings.",
      });
      return;
    }

    setLoading(true);

    try {
      // Use database field names directly - exclude email for security
      const updateData = {
        username: profileData.username.trim(),
        first_name: profileData.first_name.trim(),
        last_name: profileData.last_name.trim(),
        phone: profileData.phone.trim(),
        address: profileData.address.trim(),
        emergency_contact: profileData.emergency_contact.trim(),
        emergency_phone: profileData.emergency_phone.trim(),
        group_chat: profileData.group_chat.trim() || null,
      };

      console.log('Sending update data to database:', updateData);

      const { error } = await updateProfile(updateData);

      if (error) {
        console.error('Profile update failed:', error);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: typeof error === 'string' ? error : error.message || "Failed to save settings.",
        });
      } else {
        console.log('Profile update successful');
        
        // Update original data to reflect saved state
        const savedData = { ...profileData, ...updateData };
        setOriginalData(savedData);
        setHasChanges(false);
        
        toast({
          title: "Settings Saved!",
          description: "Your changes have been successfully updated.",
        });
      }
    } catch (error) {
      console.error('Unexpected error during save:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while saving settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    console.log('Resetting settings to original values');
    setProfileData(originalData);
    setHasChanges(false);

    // Reset other settings
    setNotification({ email: true, sms: false, app: true });
    setSecurity({ twoFactor: false, biometrics: false });
    setSystem({ language: "english", timezone: "africa/johannesburg" });

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their saved values.",
    });
  };

  const getNotificationDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      email: "Receive alerts via email",
      sms: "Receive alerts via SMS",
      app: "Show browser notifications",
    };
    return descriptions[key] || "";
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-primary/10 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You must be logged in to access settings.</p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-primary/10 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-6xl mb-6 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <img src={homeIQLogo} alt="Home IQ" className="h-8" />
          <span className="font-bold text-lg">Settings</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/test")}
          className="flex items-center gap-2"
        >
          <Database className="w-4 h-4" />
          Database Test
        </Button>
      </div>

      <main className="w-full max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass mb-6">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system">
              <SettingsIcon className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            <div className="space-y-6">
              {/* Debug Info Card - Remove in production */}
              <Card className="glass border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="text-sm">Debug Info</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div>User ID: {user?.id}</div>
                  <div>Profile ID: {profile?.id}</div>
                  <div>Has Changes: {hasChanges.toString()}</div>
                  <div>Profile Loaded: {!!profile ? 'Yes' : 'No'}</div>
                  {profile && (
                    <details>
                      <summary>Raw Profile Data</summary>
                      <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                        {JSON.stringify(profile, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>

              {/* Basic Profile Information */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profileData.first_name}
                        onChange={(e) => handleProfileChange('first_name', e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profileData.last_name}
                        onChange={(e) => handleProfileChange('last_name', e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="cursor-not-allowed bg-muted/50"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email cannot be changed from this page. Contact support if needed.
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      placeholder="Enter your full address"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact Information */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>
                    Set up emergency contact information for safety purposes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
                    <Input
                      id="emergency_contact"
                      value={profileData.emergency_contact}
                      onChange={(e) => handleProfileChange('emergency_contact', e.target.value)}
                      placeholder="Full name of emergency contact"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                    <Input
                      id="emergency_phone"
                      value={profileData.emergency_phone}
                      onChange={(e) => handleProfileChange('emergency_phone', e.target.value)}
                      placeholder="Emergency contact phone number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Additional Settings */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Additional Settings</CardTitle>
                  <CardDescription>
                    Configure additional profile options.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="group_chat">Group Chat ID (Optional)</Label>
                    <Input
                      id="group_chat"
                      value={profileData.group_chat}
                      onChange={(e) => handleProfileChange('group_chat', e.target.value)}
                      placeholder="Enter group chat identifier"
                    />
                    <p className="text-sm text-muted-foreground">
                      Used for family or household group communications.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-0">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive alerts and notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notification).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {key.charAt(0).toUpperCase() + key.slice(1)} Alerts
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {getNotificationDescription(key)}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNotification({ ...notification, [key]: checked })
                        }
                      />
                    </div>
                    {key !== 'app' && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-0">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Enhance your account security with additional protection.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Two-Factor Authentication</span>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(checked) =>
                      setSecurity({ ...security, twoFactor: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Biometric Login</span>
                    <p className="text-sm text-muted-foreground">
                      Use fingerprint or face recognition to log in
                    </p>
                  </div>
                  <Switch
                    checked={security.biometrics}
                    onCheckedChange={(checked) =>
                      setSecurity({ ...security, biometrics: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="mt-0">
            <Card className="glass">
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>
                  Customize the application's behavior and appearance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full p-2 rounded-lg border border-border bg-background"
                    value={system.language}
                    onChange={(e) => setSystem({ ...system, language: e.target.value })}
                  >
                    <option value="english">English</option>
                    <option value="isiZulu">isiZulu</option>
                    <option value="afrikaans">Afrikaans</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full p-2 rounded-lg border border-border bg-background"
                    value={system.timezone}
                    onChange={(e) => setSystem({ ...system, timezone: e.target.value })}
                  >
                    <option value="africa/johannesburg">Africa/Johannesburg (SAST)</option>
                    <option value="africa/cape_town">Africa/Cape Town (SAST)</option>
                    <option value="africa/durban">Africa/Durban (SAST)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            variant="hero"
            size="lg"
            onClick={handleSaveSettings}
            className="flex items-center gap-2"
            disabled={loading || !hasChanges}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {hasChanges ? "Save Changes" : "No Changes to Save"}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleResetSettings}
            className="flex items-center gap-2 bg-transparent"
            disabled={loading || !hasChanges}
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Saved
          </Button>
        </div>

        {/* Changes Indicator */}
        {hasChanges && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <p className="text-sm text-amber-700">
              You have unsaved changes. Don't forget to save your updates!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;
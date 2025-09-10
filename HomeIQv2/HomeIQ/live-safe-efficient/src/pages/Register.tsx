import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Mail, Phone, MapPin, Users, Eye, EyeOff, Lock, Check, X } from "lucide-react";
import homeIQLogo from "@/assets/home-iq-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    password: "",
    confirmPassword: "",
    groupChat: ""
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const passwordRequirements = [
    { text: "At least 8 characters long", validator: (pass) => pass.length >= 8 },
    { text: "Contains an uppercase letter", validator: (pass) => /[A-Z]/.test(pass) },
    { text: "Contains a lowercase letter", validator: (pass) => /[a-z]/.test(pass) },
    { text: "Contains a number", validator: (pass) => /[0-9]/.test(pass) },
    { text: "Contains a symbol (e.g., !@#$%)", validator: (pass) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pass) },
  ];

  const passwordValidation = passwordRequirements.map(req => ({
    text: req.text,
    isValid: req.validator(formData.password)
  }));

  const assessPasswordStrength = (password) => {
    const metRequirements = passwordRequirements.filter(req => req.validator(password)).length;
    setPasswordStrength(metRequirements);
  };

  const isPasswordValid = passwordValidation.every(req => req.isValid);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet all requirements.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        groupChat: formData.groupChat
      });

      if (error) {
        setError(`Registration failed: ${error.message}`);
      } else {
        alert("Registration successful! Please check your email to confirm your account.");
        navigate('/login');
      }
    } catch (error) {
      setError(`Registration error: ${error.message}`);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirementList = () => (
    <ul className="text-sm space-y-1 mt-2">
      {passwordValidation.map((req, index) => (
        <li 
          key={index} 
          className={`flex items-center gap-2 transition-all duration-300 ease-in-out transform ${
            req.isValid ? 'text-green-500 scale-100' : 'text-red-500 scale-95'
          }`}
        >
          {req.isValid ? (
            <Check className="h-4 w-4 animate-check-bounce" />
          ) : (
            <X className="h-4 w-4" />
          )}
          <span>{req.text}</span>
        </li>
      ))}
    </ul>
  );

  const PasswordStrengthIndicator = () => {
    const strengthLabels = ["N/A", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["#cccccc", "#ef4444", "#f97316", "#fde047", "#22c55e"];
    const width = (passwordStrength / passwordRequirements.length) * 100;

    return (
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-2 w-full rounded-full bg-muted-foreground/30 overflow-hidden">
          <div 
            className="h-full transition-all duration-300 rounded-full" 
            style={{ width: `${width}%`, backgroundColor: strengthColors[passwordStrength] }}
          />
        </div>
        <span 
          className="text-xs font-medium" 
          style={{ color: strengthColors[passwordStrength] }}
        >
          Password Strength: {strengthLabels[passwordStrength]}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-primary/10 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-accent/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="glass shadow-2xl border-white/20">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <img src={homeIQLogo} alt="Home IQ" className="w-16 h-16" />
            </div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join Home IQ for smart living and security
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+27 82 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      placeholder="123 Smart Street, Cape Town, South Africa"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary min-h-[80px]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Emergency Contact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="emergencyContact"
                        placeholder="Jane Doe"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        placeholder="+27 82 987 6543"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groupChat">Group Chat Link (Optional)</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="groupChat"
                      placeholder="WhatsApp group link for emergency alerts"
                      value={formData.groupChat}
                      onChange={(e) => setFormData({...formData, groupChat: e.target.value})}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Security</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({...formData, password: e.target.value});
                          assessPasswordStrength(e.target.value);
                        }}
                        className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <PasswordRequirementList />
                    <PasswordStrengthIndicator />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm mt-6">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
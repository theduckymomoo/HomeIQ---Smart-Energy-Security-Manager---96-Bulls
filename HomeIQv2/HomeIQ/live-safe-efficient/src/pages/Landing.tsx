import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Flame, Shield, Zap, Home, Users } from "lucide-react";
import homeIQLogo from "@/assets/home-iq-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const [panicPressed, setPanicPressed] = useState(false);
  const [firePressed, setFirePressed] = useState(false);

  const handlePanicButton = () => {
    setPanicPressed(true);
    // Simulate alert being sent
    setTimeout(() => {
      alert("Emergency alert sent to contacts and security company!");
      setPanicPressed(false);
    }, 2000);
  };

  const handleFireButton = () => {
    setFirePressed(true);
    // Simulate fire alert
    setTimeout(() => {
      alert("Fire emergency alert sent to emergency services!");
      setFirePressed(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-primary/10 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={homeIQLogo} alt="Home IQ" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Home IQ</h1>
              <p className="text-muted-foreground text-sm">Smart Living</p>
            </div>
          </div>
          
          {/* Emergency Buttons - Always Visible */}
          <div className="flex gap-3">
            <Button
              variant="emergency"
              size="lg"
              onClick={handlePanicButton}
              className={`${panicPressed ? 'emergency-pulse' : ''}`}
              disabled={panicPressed}
            >
              <AlertTriangle className="w-5 h-5" />
              {panicPressed ? 'Alerting...' : 'PANIC'}
            </Button>
            
            <Button
              variant="fire"
              size="lg"
              onClick={handleFireButton}
              className={`${firePressed ? 'fire-animation' : ''}`}
              disabled={firePressed}
            >
              <Flame className="w-5 h-5" />
              {firePressed ? 'Alerting...' : 'FIRE'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Smart Living,
              <br />
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Secure Future
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Monitor your energy consumption, control smart appliances, and ensure 
              your home's security with our comprehensive smart living solution.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 glass hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Energy Management</h3>
              <p className="text-muted-foreground text-sm">
                Monitor and optimize your appliance energy consumption in real-time
              </p>
            </Card>
            
            <Card className="p-6 glass hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Security System</h3>
              <p className="text-muted-foreground text-sm">
                Advanced motion detection and live camera monitoring
              </p>
            </Card>
            
            <Card className="p-6 glass hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Home className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Controls</h3>
              <p className="text-muted-foreground text-sm">
                Control all your appliances remotely from anywhere
              </p>
            </Card>
          </div>

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-6 h-auto"
            >
              <Users className="w-5 h-5" />
              Sign In
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/register')}
              className="text-lg px-8 py-6 h-auto border-2 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Create Account
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Home IQ. Smart Living for a Secure Future.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
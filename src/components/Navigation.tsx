import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Plane, MapPin, Calendar, DollarSign, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      toast.success("Signed out successfully", {
        description: "You have been logged out of your account"
      });
    } else {
      navigate('/auth');
    }
  };

  const handleGetStarted = () => {
    if (user) {
      // Scroll to planning section
      document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-ocean rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">TravelHub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-foreground hover:text-primary transition-colors flex items-center space-x-1"
            >
              <MapPin className="w-4 h-4" />
              <span>Destinations</span>
            </button>
            <button 
              onClick={() => document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-foreground hover:text-primary transition-colors flex items-center space-x-1"
            >
              <Calendar className="w-4 h-4" />
              <span>Planning</span>
            </button>
            <a href="#budget" className="text-foreground hover:text-primary transition-colors flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Budget</span>
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleAuthAction}>
              {user ? <LogOut className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
              {user ? 'Sign Out' : 'Sign In'}
            </Button>
            <Button variant="hero" size="sm" onClick={handleGetStarted}>
              {user ? 'Plan Trip' : 'Get Started'}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => {
                  document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-muted rounded-md"
              >
                Destinations
              </button>
              <button 
                onClick={() => {
                  document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' });
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-muted rounded-md"
              >
                Planning
              </button>
              <a href="#budget" className="block px-3 py-2 text-foreground hover:bg-muted rounded-md">
                Budget
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" className="justify-start" onClick={handleAuthAction}>
                  {user ? <LogOut className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                  {user ? 'Sign Out' : 'Sign In'}
                </Button>
                <Button variant="hero" className="justify-start" onClick={handleGetStarted}>
                  {user ? 'Plan Trip' : 'Get Started'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
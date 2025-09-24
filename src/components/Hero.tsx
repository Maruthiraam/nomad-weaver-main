import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-travel.jpg";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    if (user) {
      document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/auth');
    }
  };

  const handleExploreDestinations = () => {
    if (user) {
      document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/auth');
    }
  };
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Beautiful tropical destination" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Your Complete
          <span className="block bg-gradient-sunset bg-clip-text text-transparent">
            Travel Companion
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
          Plan, budget, book, and explore the world with our all-in-one travel platform. 
          From dream destinations to seamless itineraries.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="hero" size="xl" className="min-w-[200px]" onClick={handleStartPlanning}>
            <Search className="w-5 h-5 mr-2" />
            {user ? 'Start Planning' : 'Get Started'}
          </Button>
          <Button variant="outline" size="xl" className="min-w-[200px] bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleExploreDestinations}>
            <MapPin className="w-5 h-5 mr-2" />
            Explore Destinations
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
            <div className="text-white/80 text-sm">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">50K+</div>
            <div className="text-white/80 text-sm">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
            <div className="text-white/80 text-sm">Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">1M+</div>
            <div className="text-white/80 text-sm">Bookings</div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
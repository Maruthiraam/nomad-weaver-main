import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Plus, Plane, Hotel, Camera, Utensils, Train, Bus, User } from "lucide-react";
import { useHotels } from "@/hooks/useHotels";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import cityImage from "@/assets/city-destination.jpg";
import mountainImage from "@/assets/mountain-adventure.jpg";
import { useBooking } from "@/hooks/useBooking";
const TripPlanning = () => {
  const [selectedDays, setSelectedDays] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { hotels, cities, loading, searchDestinations } = useHotels();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createBooking } = useBooking();
  const handleSearch = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to search destinations",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!searchTerm.trim()) return;

    const results = await searchDestinations(searchTerm);
    setSearchResults(results);
  };

  const handleExploreMore = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    toast({
      title: "Explore Destinations",
      description: "Showing available destinations...",
    });
  };

  const handleAddActivity = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    toast({
      title: "Add Activity",
      description: "Activity planning feature coming soon!",
    });
  };

  const handleQuickAction = (action: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    toast({
      title: `${action}`,
      description: `${action} feature coming soon!`,
    });
  };

  const handleReserveHotels = () => {
    const el = document.getElementById('hotels');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookHotel = async (hotel: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const format = (d: Date) => d.toISOString().split('T')[0];

    await createBooking({
      hotel_id: hotel.id,
      check_in_date: format(today),
      check_out_date: format(tomorrow),
      guests: 2,
      total_amount: hotel.price_per_night,
      currency: 'INR',
    });
  };
  const itineraryByDay = {
    1: [
      { time: "09:00", title: "Airport Departure", location: "IGI Airport, Delhi", type: "flight", icon: Plane, duration: "3 hours" },
      { time: "14:00", title: "Hotel Check-in", location: "Grand Plaza Hotel", type: "hotel", icon: Hotel, duration: "30 minutes" },
      { time: "16:00", title: "India Gate Visit", location: "India Gate, Delhi", type: "activity", icon: Camera, duration: "2 hours" },
      { time: "19:00", title: "Welcome Dinner", location: "Connaught Place", type: "dining", icon: Utensils, duration: "2 hours" }
    ],
    2: [
      { time: "08:00", title: "Breakfast", location: "Hotel Restaurant", type: "dining", icon: Utensils, duration: "1 hour" },
      { time: "10:00", title: "Red Fort Tour", location: "Red Fort, Delhi", type: "activity", icon: Camera, duration: "3 hours" },
      { time: "15:00", title: "Qutub Minar", location: "Qutub Complex", type: "activity", icon: Camera, duration: "2 hours" },
      { time: "19:00", title: "Local Market", location: "Chandni Chowk", type: "activity", icon: User, duration: "2 hours" }
    ],
    3: [
      { time: "07:00", title: "Train Journey", location: "New Delhi Station", type: "activity", icon: Train, duration: "3 hours" },
      { time: "11:00", title: "Taj Mahal Visit", location: "Agra, UP", type: "activity", icon: Camera, duration: "4 hours" },
      { time: "16:00", title: "Agra Fort", location: "Agra Fort", type: "activity", icon: Camera, duration: "2 hours" },
      { time: "19:00", title: "Mughlai Dinner", location: "Agra Restaurant", type: "dining", icon: Utensils, duration: "2 hours" }
    ],
    4: [
      { time: "09:00", title: "Return Journey", location: "Agra to Delhi", type: "activity", icon: Bus, duration: "4 hours" },
      { time: "15:00", title: "Lotus Temple", location: "Lotus Temple, Delhi", type: "activity", icon: Camera, duration: "2 hours" },
      { time: "18:00", title: "Shopping", location: "Khan Market", type: "activity", icon: User, duration: "2 hours" },
      { time: "20:00", title: "Farewell Dinner", location: "Delhi Restaurant", type: "dining", icon: Utensils, duration: "2 hours" }
    ],
    5: [
      { time: "08:00", title: "Hotel Checkout", location: "Grand Plaza Hotel", type: "hotel", icon: Hotel, duration: "30 minutes" },
      { time: "10:00", title: "Last-minute Shopping", location: "Dilli Haat", type: "activity", icon: User, duration: "2 hours" },
      { time: "14:00", title: "Airport Transfer", location: "IGI Airport", type: "activity", icon: Bus, duration: "1 hour" },
      { time: "16:00", title: "Flight Departure", location: "IGI Airport, Delhi", type: "flight", icon: Plane, duration: "3 hours" }
    ]
  };

  const currentItinerary = itineraryByDay[selectedDays as keyof typeof itineraryByDay] || itineraryByDay[1];

  const getTypeColor = (type) => {
    switch (type) {
      case "flight": return "bg-primary";
      case "hotel": return "bg-secondary";
      case "activity": return "bg-accent";
      case "dining": return "bg-secondary";
      default: return "bg-gray-500";
    }
  };

  return (
    <section id="planning" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Trip Planning
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create detailed itineraries with seamless booking integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Destination Search */}
          <Card className="shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-accent" />
                <span>Destination Search</span>
              </CardTitle>
              <CardDescription>
                Find your perfect travel destination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Search destinations..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  Search
                </Button>
              </div>
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Search Results</h4>
                  {searchResults.slice(0, 3).map((city) => (
                    <div key={city.id} className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted">
                      <div className="font-semibold">{city.name}, {city.state}</div>
                      <div className="text-sm text-muted-foreground">{city.description}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Featured Destinations */}
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-lg cursor-pointer group">
                  <img src={cityImage} alt="City destination" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <div className="text-white">
                      <div className="font-semibold">Mumbai, India</div>
                      <div className="text-sm">From ₹3,999</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-lg cursor-pointer group">
                  <img src={mountainImage} alt="Mountain destination" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <div className="text-white">
                      <div className="font-semibold">Shimla, India</div>
                      <div className="text-sm">From ₹4,999</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="adventure" className="w-full" onClick={handleExploreMore}>
                <MapPin className="w-4 h-4 mr-2" />
                Explore More
              </Button>
            </CardContent>
          </Card>

          {/* Itinerary Builder */}
          <Card className="shadow-card-hover lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Your Itinerary</span>
              </CardTitle>
              <CardDescription>
                Day-by-day planning for your perfect trip
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Day Selection */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDays(day)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedDays === day
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Day {day}
                  </button>
                ))}
              </div>

              {/* Itinerary Timeline */}
              <div className="space-y-4">
                {currentItinerary.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${getTypeColor(item.type)} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        {index < currentItinerary.length - 1 && (
                          <div className="w-px h-8 bg-border mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-muted-foreground">{item.time}</span>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.duration}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.location}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button variant="travel" className="w-full" onClick={handleAddActivity}>
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
          <a href="https://www.goindigo.in/" target="_blank" rel="noopener noreferrer">
            <Card className="text-center p-6 hover:shadow-travel transition-shadow cursor-pointer">
              <Plane className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Book Flights</h3>
              <p className="text-sm text-muted-foreground">Fly with IndiGo</p>
            </Card>
          </a>

          <a href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noopener noreferrer">
            <Card className="text-center p-6 hover:shadow-travel transition-shadow cursor-pointer">
              <Train className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Book Trains</h3>
              <p className="text-sm text-muted-foreground">Go to IRCTC</p>
            </Card>
          </a>

          <a href="https://www.redbus.in/" target="_blank" rel="noopener noreferrer">
            <Card className="text-center p-6 hover:shadow-travel transition-shadow cursor-pointer">
              <Bus className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Book Buses</h3>
              <p className="text-sm text-muted-foreground">Go to RedBus</p>
            </Card>
          </a>

          <Card className="text-center p-6 hover:shadow-travel transition-shadow cursor-pointer" onClick={handleReserveHotels}>
            <Hotel className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Reserve Hotels</h3>
            <p className="text-sm text-muted-foreground">Browse and book stays</p>
          </Card>

          <a href="https://www.getyourguide.com/" target="_blank" rel="noopener noreferrer">
            <Card className="text-center p-6 hover:shadow-travel transition-shadow cursor-pointer">
              <User className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Hire Guide</h3>
              <p className="text-sm text-muted-foreground">Book local guides</p>
            </Card>
          </a>
        </div>

        {/* Hotels Section */}
        <section id="hotels" className="mt-12">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-foreground">Top Hotels</h3>
            <p className="text-muted-foreground">Browse and book popular stays</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.slice(0, 6).map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  {hotel.image_url ? (
                    <img
                      src={hotel.image_url}
                      alt={`${hotel.name} hotel image`}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-40 bg-muted" />
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{hotel.name}</h4>
                    <Badge variant="outline">{hotel.rating ? `${hotel.rating}★` : 'New'}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{hotel.address || hotel.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-medium text-foreground">₹{hotel.price_per_night}/night</span>
                    <Button size="sm" onClick={() => handleBookHotel(hotel)}>Book</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default TripPlanning;
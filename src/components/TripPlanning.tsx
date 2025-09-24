import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Plus, Plane, Hotel, Camera, Utensils, Train, Bus, User, Globe2, Navigation2, Sun, Moon } from "lucide-react";
import { useHotels } from "@/hooks/useHotels";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import cityImage from "@/assets/city-destination.jpg";
import mountainImage from "@/assets/mountain-adventure.jpg";
import { useBooking } from "@/hooks/useBooking";

// Define destination image paths - using placeholder until actual images are added
const destinationImages = {
  tajMahal: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
  varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
  jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
  kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  goa: "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80",
  ladakh: "https://images.unsplash.com/photo-1606547151230-d98b416d9c6d?auto=format&fit=crop&w=800&q=80"
};

const TripPlanning = () => {
  const [selectedDays, setSelectedDays] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { hotels, cities, loading, searchDestinations } = useHotels();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createBooking } = useBooking();

  const indianCities = [
    // Andhra Pradesh
    { name: "Visakhapatnam", state: "Andhra Pradesh", type: "Port City", description: "City of Destiny" },
    { name: "Vijayawada", state: "Andhra Pradesh", type: "Commercial", description: "Business Hub" },
    { name: "Guntur", state: "Andhra Pradesh", type: "Agricultural", description: "Chili City" },
    { name: "Tirupati", state: "Andhra Pradesh", type: "Religious", description: "Temple City" },
    { name: "Nellore", state: "Andhra Pradesh", type: "Agricultural", description: "Rice City" },

    // Arunachal Pradesh
    { name: "Itanagar", state: "Arunachal Pradesh", type: "Capital", description: "Gateway to Northeast" },
    { name: "Tawang", state: "Arunachal Pradesh", type: "Spiritual", description: "Buddhist Monastery" },
    { name: "Bomdila", state: "Arunachal Pradesh", type: "Hill Station", description: "Mountain Paradise" },

    // Assam
    { name: "Guwahati", state: "Assam", type: "Gateway", description: "Gateway to Northeast" },
    { name: "Silchar", state: "Assam", type: "Commercial", description: "Tea City" },
    { name: "Dibrugarh", state: "Assam", type: "Industrial", description: "Tea City" },
    { name: "Jorhat", state: "Assam", type: "Cultural", description: "Cultural Capital" },
    { name: "Tezpur", state: "Assam", type: "Educational", description: "City of Eternal Romance" },

    // Bihar
    { name: "Patna", state: "Bihar", type: "Capital", description: "Historical City" },
    { name: "Gaya", state: "Bihar", type: "Religious", description: "Buddhist Pilgrimage" },
    { name: "Muzaffarpur", state: "Bihar", type: "Commercial", description: "Lichi Kingdom" },
    { name: "Bhagalpur", state: "Bihar", type: "Educational", description: "Silk City" },
    { name: "Darbhanga", state: "Bihar", type: "Cultural", description: "Cultural Capital" },

    // Chhattisgarh
    { name: "Raipur", state: "Chhattisgarh", type: "Capital", description: "Rice Bowl" },
    { name: "Bhilai", state: "Chhattisgarh", type: "Industrial", description: "Steel City" },
    { name: "Bilaspur", state: "Chhattisgarh", type: "Commercial", description: "City of Power" },
    { name: "Korba", state: "Chhattisgarh", type: "Industrial", description: "Power Hub" },

    // Delhi
    { name: "New Delhi", state: "Delhi", type: "Capital", description: "National Capital" },
    { name: "Old Delhi", state: "Delhi", type: "Historical", description: "Heritage Area" },

    // Goa
    { name: "Panaji", state: "Goa", type: "Capital", description: "Tourist Paradise" },
    { name: "Margao", state: "Goa", type: "Commercial", description: "Cultural Capital" },
    { name: "Vasco da Gama", state: "Goa", type: "Port", description: "Port City" },
    { name: "Mapusa", state: "Goa", type: "Market", description: "Market Town" },

    // Gujarat
    { name: "Ahmedabad", state: "Gujarat", type: "Commercial", description: "Manchester of India" },
    { name: "Surat", state: "Gujarat", type: "Diamond", description: "Diamond City" },
    { name: "Vadodara", state: "Gujarat", type: "Cultural", description: "Cultural Capital" },
    { name: "Rajkot", state: "Gujarat", type: "Industrial", description: "Industrial Hub" },
    { name: "Gandhinagar", state: "Gujarat", type: "Capital", description: "Green City" },
    { name: "Dwarka", state: "Gujarat", type: "Religious", description: "Holy City" },

    // Haryana
    { name: "Chandigarh", state: "Haryana", type: "Capital", description: "The City Beautiful" },
    { name: "Gurugram", state: "Haryana", type: "IT Hub", description: "Millennium City" },
    { name: "Faridabad", state: "Haryana", type: "Industrial", description: "Industrial Hub" },
    { name: "Panipat", state: "Haryana", type: "Historical", description: "City of Weavers" },
    { name: "Karnal", state: "Haryana", type: "Agricultural", description: "Rice Bowl" },

    // Himachal Pradesh
    { name: "Shimla", state: "Himachal Pradesh", type: "Capital", description: "Queen of Hills" },
    { name: "Manali", state: "Himachal Pradesh", type: "Tourist", description: "Valley of Gods" },
    { name: "Dharamshala", state: "Himachal Pradesh", type: "Spiritual", description: "Little Lhasa" },
    { name: "Kullu", state: "Himachal Pradesh", type: "Valley", description: "Valley of Gods" },
    { name: "Dalhousie", state: "Himachal Pradesh", type: "Hill Station", description: "Mini Switzerland" },

    // Jharkhand
    { name: "Ranchi", state: "Jharkhand", type: "Capital", description: "City of Waterfalls" },
    { name: "Jamshedpur", state: "Jharkhand", type: "Industrial", description: "Steel City" },
    { name: "Dhanbad", state: "Jharkhand", type: "Mining", description: "Coal Capital" },
    { name: "Bokaro", state: "Jharkhand", type: "Industrial", description: "Steel City" },

    // Karnataka
    { name: "Bengaluru", state: "Karnataka", type: "Capital", description: "Silicon Valley of India" },
    { name: "Mysuru", state: "Karnataka", type: "Heritage", description: "City of Palaces" },
    { name: "Mangaluru", state: "Karnataka", type: "Port", description: "Port City" },
    { name: "Hubballi-Dharwad", state: "Karnataka", type: "Commercial", description: "Twin Cities" },
    { name: "Belagavi", state: "Karnataka", type: "Military", description: "Military Hub" },
    { name: "Hampi", state: "Karnataka", type: "Historical", description: "UNESCO Heritage Site" },

    // Kerala
    { name: "Thiruvananthapuram", state: "Kerala", type: "Capital", description: "Evergreen City" },
    { name: "Kochi", state: "Kerala", type: "Commercial", description: "Queen of Arabian Sea" },
    { name: "Kozhikode", state: "Kerala", type: "Historical", description: "City of Spices" },
    { name: "Thrissur", state: "Kerala", type: "Cultural", description: "Cultural Capital" },
    { name: "Munnar", state: "Kerala", type: "Hill Station", description: "Tea Gardens" },
    { name: "Alappuzha", state: "Kerala", type: "Backwaters", description: "Venice of the East" },

    // Madhya Pradesh
    { name: "Bhopal", state: "Madhya Pradesh", type: "Capital", description: "City of Lakes" },
    { name: "Indore", state: "Madhya Pradesh", type: "Commercial", description: "Clean City" },
    { name: "Gwalior", state: "Madhya Pradesh", type: "Historical", description: "Fort City" },
    { name: "Jabalpur", state: "Madhya Pradesh", type: "Tourist", description: "Marble City" },
    { name: "Ujjain", state: "Madhya Pradesh", type: "Religious", description: "Temple City" },
    { name: "Khajuraho", state: "Madhya Pradesh", type: "Heritage", description: "Temple Town" },

    // Maharashtra
    { name: "Mumbai", state: "Maharashtra", type: "Capital", description: "Financial Capital" },
    { name: "Pune", state: "Maharashtra", type: "Educational", description: "Oxford of the East" },
    { name: "Nagpur", state: "Maharashtra", type: "Orange City", description: "Winter Capital" },
    { name: "Nashik", state: "Maharashtra", type: "Religious", description: "Wine Capital" },
    { name: "Aurangabad", state: "Maharashtra", type: "Tourism", description: "Tourism Capital" },
    { name: "Kolhapur", state: "Maharashtra", type: "Historical", description: "Historical City" },
    { name: "Solapur", state: "Maharashtra", type: "Textile", description: "Textile Hub" },
    { name: "Thane", state: "Maharashtra", type: "Industrial", description: "Lake City" },

    // Manipur
    { name: "Imphal", state: "Manipur", type: "Capital", description: "Jewel City" },
    { name: "Thoubal", state: "Manipur", type: "Commercial", description: "Valley Town" },

    // Meghalaya
    { name: "Shillong", state: "Meghalaya", type: "Capital", description: "Scotland of the East" },
    { name: "Cherrapunji", state: "Meghalaya", type: "Rainfall", description: "Wettest Place" },

    // Mizoram
    { name: "Aizawl", state: "Mizoram", type: "Capital", description: "Hill Station Capital" },
    { name: "Lunglei", state: "Mizoram", type: "Commercial", description: "Southern Capital" },

    // Nagaland
    { name: "Kohima", state: "Nagaland", type: "Capital", description: "Land of Festivals" },
    { name: "Dimapur", state: "Nagaland", type: "Commercial", description: "Commercial Capital" },

    // Odisha
    { name: "Bhubaneswar", state: "Odisha", type: "Capital", description: "Temple City" },
    { name: "Cuttack", state: "Odisha", type: "Commercial", description: "Silver City" },
    { name: "Puri", state: "Odisha", type: "Religious", description: "Temple Town" },
    { name: "Rourkela", state: "Odisha", type: "Industrial", description: "Steel City" },
    { name: "Sambalpur", state: "Odisha", type: "Textile", description: "Handloom City" },

    // Punjab
    { name: "Chandigarh", state: "Punjab", type: "Capital", description: "The City Beautiful" },
    { name: "Amritsar", state: "Punjab", type: "Religious", description: "Golden Temple City" },
    { name: "Ludhiana", state: "Punjab", type: "Industrial", description: "Manchester of India" },
    { name: "Jalandhar", state: "Punjab", type: "Sports", description: "Sports City" },
    { name: "Patiala", state: "Punjab", type: "Royal", description: "Royal City" },

    // Rajasthan
    { name: "Jaipur", state: "Rajasthan", type: "Capital", description: "Pink City" },
    { name: "Udaipur", state: "Rajasthan", type: "Lakes", description: "City of Lakes" },
    { name: "Jodhpur", state: "Rajasthan", type: "Historical", description: "Blue City" },
    { name: "Ajmer", state: "Rajasthan", type: "Religious", description: "Pilgrimage City" },
    { name: "Bikaner", state: "Rajasthan", type: "Desert", description: "Camel Country" },
    { name: "Jaisalmer", state: "Rajasthan", type: "Desert", description: "Golden City" },
    { name: "Mount Abu", state: "Rajasthan", type: "Hill Station", description: "Oasis in Desert" },

    // Sikkim
    { name: "Gangtok", state: "Sikkim", type: "Capital", description: "Mountain Paradise" },
    { name: "Namchi", state: "Sikkim", type: "Religious", description: "Cultural Town" },
    { name: "Pelling", state: "Sikkim", type: "Tourism", description: "Mountain View" },

    // Tamil Nadu
    { name: "Chennai", state: "Tamil Nadu", type: "Capital", description: "Detroit of India" },
    { name: "Coimbatore", state: "Tamil Nadu", type: "Industrial", description: "Manchester of South India" },
    { name: "Madurai", state: "Tamil Nadu", type: "Temple", description: "Temple City" },
    { name: "Salem", state: "Tamil Nadu", type: "Industrial", description: "Steel City" },
    { name: "Tiruchirapalli", state: "Tamil Nadu", type: "Religious", description: "Rock Fort City" },
    { name: "Vellore", state: "Tamil Nadu", type: "Medical", description: "Fort City" },
    { name: "Thanjavur", state: "Tamil Nadu", type: "Cultural", description: "Rice Bowl" },
    { name: "Ooty", state: "Tamil Nadu", type: "Hill Station", description: "Queen of Hill Stations" },
    { name: "Kodaikanal", state: "Tamil Nadu", type: "Hill Station", description: "Princess of Hill Stations" },

    // Telangana
    { name: "Hyderabad", state: "Telangana", type: "Capital", description: "City of Pearls" },
    { name: "Warangal", state: "Telangana", type: "Historical", description: "Temple Town" },
    { name: "Nizamabad", state: "Telangana", type: "Agricultural", description: "Turmeric City" },
    { name: "Karimnagar", state: "Telangana", type: "Granite", description: "Granite City" },

    // Tripura
    { name: "Agartala", state: "Tripura", type: "Capital", description: "Green City" },
    { name: "Udaipur", state: "Tripura", type: "Historical", description: "Lake City" },

    // Uttar Pradesh
    { name: "Lucknow", state: "Uttar Pradesh", type: "Capital", description: "City of Nawabs" },
    { name: "Kanpur", state: "Uttar Pradesh", type: "Industrial", description: "Leather City" },
    { name: "Varanasi", state: "Uttar Pradesh", type: "Religious", description: "Spiritual Capital" },
    { name: "Agra", state: "Uttar Pradesh", type: "Historical", description: "Taj City" },
    { name: "Prayagraj", state: "Uttar Pradesh", type: "Religious", description: "Sangam City" },
    { name: "Mathura", state: "Uttar Pradesh", type: "Religious", description: "Krishna's Birthplace" },
    { name: "Meerut", state: "Uttar Pradesh", type: "Historical", description: "Sports City" },
    { name: "Aligarh", state: "Uttar Pradesh", type: "Educational", description: "Lock City" },

    // Uttarakhand
    { name: "Dehradun", state: "Uttarakhand", type: "Capital", description: "School City" },
    { name: "Haridwar", state: "Uttarakhand", type: "Religious", description: "Gateway to God" },
    { name: "Rishikesh", state: "Uttarakhand", type: "Spiritual", description: "Yoga Capital" },
    { name: "Nainital", state: "Uttarakhand", type: "Hill Station", description: "Lake District" },
    { name: "Mussoorie", state: "Uttarakhand", type: "Hill Station", description: "Queen of Hills" },

    // West Bengal
    { name: "Kolkata", state: "West Bengal", type: "Capital", description: "City of Joy" },
    { name: "Darjeeling", state: "West Bengal", type: "Hill Station", description: "Queen of Hills" },
    { name: "Siliguri", state: "West Bengal", type: "Commercial", description: "Gateway of Northeast" },
    { name: "Durgapur", state: "West Bengal", type: "Industrial", description: "Steel City" },
    { name: "Asansol", state: "West Bengal", type: "Industrial", description: "Land of Black Diamond" },
    { name: "Howrah", state: "West Bengal", type: "Industrial", description: "Sheffield of India" },

    // Union Territories
    { name: "Port Blair", state: "Andaman & Nicobar", type: "Capital", description: "Paradise Islands" },
    { name: "Daman", state: "Daman & Diu", type: "Tourism", description: "Portuguese Heritage" },
    { name: "Silvassa", state: "Dadra & Nagar Haveli", type: "Capital", description: "Industrial Hub" },
    { name: "Kavaratti", state: "Lakshadweep", type: "Capital", description: "Coral Paradise" },
    { name: "Puducherry", state: "Puducherry", type: "Capital", description: "French Riviera of the East" }
  ];
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const generateItinerary = (city: any) => {
    const cityData = indianCities.find(c => c.name === city.name) || city;
    const type = cityData.type;
    
    // Base activities based on city type
    const activities = {
      Historical: [
        { time: "09:00", title: "Visit Historical Monuments", location: `${city.name} Fort`, type: "activity", icon: Camera, duration: "3 hours" },
        { time: "13:00", title: "Local Cuisine", location: "Heritage Restaurant", type: "dining", icon: Utensils, duration: "1 hour" },
        { time: "15:00", title: "Museum Visit", location: `${city.name} Museum`, type: "activity", icon: Camera, duration: "2 hours" }
      ],
      Religious: [
        { time: "07:00", title: "Morning Temple Visit", location: "Main Temple", type: "activity", icon: Camera, duration: "2 hours" },
        { time: "10:00", title: "Sacred Walks", location: "Temple Complex", type: "activity", icon: Camera, duration: "2 hours" },
        { time: "13:00", title: "Prasad Lunch", location: "Temple Kitchen", type: "dining", icon: Utensils, duration: "1 hour" }
      ],
      "Hill Station": [
        { time: "08:00", title: "Sunrise Point", location: "Viewpoint", type: "activity", icon: Camera, duration: "2 hours" },
        { time: "11:00", title: "Nature Walk", location: "Valley Trail", type: "activity", icon: Camera, duration: "3 hours" },
        { time: "15:00", title: "Local Tea Experience", location: "Tea Garden", type: "activity", icon: Utensils, duration: "2 hours" }
      ],
      Beach: [
        { time: "08:00", title: "Beach Sunrise", location: "Main Beach", type: "activity", icon: Camera, duration: "2 hours" },
        { time: "11:00", title: "Water Sports", location: "Beach Activities", type: "activity", icon: Camera, duration: "3 hours" },
        { time: "15:00", title: "Seafood Dining", location: "Beach Restaurant", type: "dining", icon: Utensils, duration: "2 hours" }
      ],
      Capital: [
        { time: "09:00", title: "City Tour", location: "City Center", type: "activity", icon: Bus, duration: "3 hours" },
        { time: "13:00", title: "Local Markets", location: "Shopping District", type: "activity", icon: User, duration: "2 hours" },
        { time: "16:00", title: "Cultural Show", location: "Cultural Center", type: "activity", icon: Camera, duration: "2 hours" }
      ]
    };

    // Default activities for other city types
    const defaultActivities = [
      { time: "09:00", title: "City Exploration", location: "City Center", type: "activity", icon: Camera, duration: "3 hours" },
      { time: "13:00", title: "Local Food", location: "Popular Restaurant", type: "dining", icon: Utensils, duration: "1 hour" },
      { time: "15:00", title: "Cultural Visit", location: "Local Attraction", type: "activity", icon: Camera, duration: "2 hours" }
    ];

    return {
      1: [
        { time: "08:00", title: "Hotel Check-in", location: `${city.name} Hotel`, type: "hotel", icon: Hotel, duration: "1 hour" },
        ...(activities[type] || defaultActivities),
        { time: "19:00", title: "Dinner", location: "Local Restaurant", type: "dining", icon: Utensils, duration: "2 hours" }
      ],
      2: [
        { time: "09:00", title: "Local Sightseeing", location: city.name, type: "activity", icon: Camera, duration: "3 hours" },
        { time: "13:00", title: "Local Cuisine", location: "Restaurant", type: "dining", icon: Utensils, duration: "1 hour" },
        { time: "15:00", title: "Shopping", location: "Local Market", type: "activity", icon: User, duration: "3 hours" },
        { time: "19:00", title: "Cultural Evening", location: "City Center", type: "activity", icon: Camera, duration: "2 hours" }
      ],
      3: [
        { time: "08:00", title: "Day Trip", location: `Near ${city.name}`, type: "activity", icon: Bus, duration: "6 hours" },
        { time: "15:00", title: "Local Experience", location: city.name, type: "activity", icon: Camera, duration: "3 hours" },
        { time: "19:00", title: "Farewell Dinner", location: "Premium Restaurant", type: "dining", icon: Utensils, duration: "2 hours" }
      ]
    };
  };

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

    // Find the city in our database
    const city = indianCities.find(c => 
      c.name.toLowerCase() === searchTerm.toLowerCase() ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (city) {
      setSelectedCity(city);
    }
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

  const popularCities = [
    { name: "Paris", country: "France", type: "Cultural" },
    { name: "Tokyo", country: "Japan", type: "Metropolitan" },
    { name: "New York", country: "USA", type: "Metropolitan" },
    { name: "Dubai", country: "UAE", type: "Luxury" },
    { name: "Rome", country: "Italy", type: "Historical" },
    { name: "Bangkok", country: "Thailand", type: "Cultural" },
    { name: "London", country: "UK", type: "Metropolitan" },
    { name: "Barcelona", country: "Spain", type: "Coastal" },
    { name: "Sydney", country: "Australia", type: "Coastal" },
    { name: "Singapore", country: "Singapore", type: "Modern" },
    { name: "Istanbul", country: "Turkey", type: "Historical" },
    { name: "Mumbai", country: "India", type: "Cultural" }
  ];

  const handleCityClick = (cityName: string) => {
    setSearchTerm(cityName);
    handleSearch();
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
  const getItinerary = (city: any) => {
    if (!city) return [];

    const activityMap = {
      Historical: [
        { time: "09:00", title: `Visit ${city.name} Historical Sites`, location: `${city.name} Heritage Area`, type: "activity", icon: Camera, duration: "3 hours" },
        { time: "13:00", title: "Heritage Lunch", location: "Local Restaurant", type: "dining", icon: Utensils, duration: "1.5 hours" },
        { time: "15:00", title: "Museum Tour", location: `${city.name} Museum`, type: "activity", icon: Camera, duration: "2.5 hours" },
      ],
      Religious: [
        { time: "07:00", title: "Morning Temple Visit", location: "Main Temple", type: "activity", icon: Camera, duration: "2 hours" },
        { time: "10:00", title: "Sacred Walk Tour", location: "Temple Complex", type: "activity", icon: Camera, duration: "3 hours" },
        { time: "14:00", title: "Traditional Lunch", location: "Local Eatery", type: "dining", icon: Utensils, duration: "1.5 hours" },
      ],
      "Hill Station": [
        { time: "06:00", title: "Sunrise View", location: "Viewpoint", type: "activity", icon: Camera, duration: "2 hours" },
        { time: "09:00", title: "Nature Trek", location: "Mountain Trail", type: "activity", icon: Camera, duration: "4 hours" },
        { time: "14:00", title: "Local Experience", location: "Village Visit", type: "activity", icon: Camera, duration: "3 hours" },
      ],
      Capital: [
        { time: "09:00", title: "City Tour", location: "City Center", type: "activity", icon: Bus, duration: "3 hours" },
        { time: "13:00", title: "Local Food", location: "Famous Restaurant", type: "dining", icon: Utensils, duration: "1.5 hours" },
        { time: "15:00", title: "Cultural Visit", location: "Heritage Site", type: "activity", icon: Camera, duration: "2.5 hours" },
      ],
      Beach: [
        { time: "07:00", title: "Beach Sunrise", location: "Main Beach", type: "activity", icon: Camera, duration: "2 hours" },
        { time: "10:00", title: "Water Activities", location: "Beach Area", type: "activity", icon: Camera, duration: "3 hours" },
        { time: "14:00", title: "Seafood Lunch", location: "Beach Restaurant", type: "dining", icon: Utensils, duration: "2 hours" },
      ]
    };

    const defaultActivities = [
      { time: "09:00", title: `Explore ${city.name}`, location: "City Center", type: "activity", icon: Camera, duration: "3 hours" },
      { time: "13:00", title: "Local Cuisine", location: "Popular Restaurant", type: "dining", icon: Utensils, duration: "1.5 hours" },
      { time: "15:00", title: "Cultural Tour", location: `${city.name} Landmarks`, type: "activity", icon: Camera, duration: "2.5 hours" },
    ];

    const baseItinerary = {
      1: [
        { time: "08:00", title: "Arrival & Check-in", location: `${city.name} Hotel`, type: "hotel", icon: Hotel, duration: "1 hour" },
        ...(activityMap[city.type] || defaultActivities),
        { time: "19:00", title: "Welcome Dinner", location: "Local Restaurant", type: "dining", icon: Utensils, duration: "2 hours" }
      ],
      2: [
        { time: "09:00", title: `${city.name} Sightseeing`, location: city.name, type: "activity", icon: Camera, duration: "3 hours" },
        { time: "13:00", title: "Local Food Experience", location: "Food Street", type: "dining", icon: Utensils, duration: "1.5 hours" },
        { time: "15:00", title: "Shopping Tour", location: "Local Market", type: "activity", icon: User, duration: "3 hours" },
        { time: "19:00", title: "Cultural Show", location: `${city.name} Theater`, type: "activity", icon: Camera, duration: "2 hours" }
      ],
      3: [
        { time: "08:00", title: "Day Excursion", location: `Near ${city.name}`, type: "activity", icon: Bus, duration: "6 hours" },
        { time: "15:00", title: "Local Workshop", location: city.name, type: "activity", icon: Camera, duration: "2 hours" },
        { time: "18:00", title: "Farewell Dinner", location: "Premium Restaurant", type: "dining", icon: Utensils, duration: "2 hours" }
      ]
    };

    return baseItinerary;
  };

  const currentItinerary = selectedCity ? 
    (getItinerary(selectedCity)[selectedDays as keyof ReturnType<typeof getItinerary>] || getItinerary(selectedCity)[1]) : 
    [];

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
          <Card id="search" className="shadow-card-hover scroll-mt-20">
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

              {/* Indian Cities */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Popular Indian Cities</h4>
                <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
                  {indianCities.map((city) => (
                    <div
                      key={city.name}
                      onClick={() => {
                        setSearchTerm(city.name);
                        setSelectedCity(city);
                        handleSearch();
                      }}
                      className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-xs text-muted-foreground">{city.state}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {city.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {city.description}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
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
          <a href="https://www.skyscanner.co.in" target="_blank" rel="noopener noreferrer">
            <Card className="text-center p-6 hover:shadow-travel transition-shadow cursor-pointer">
              <Plane className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Book Flights</h3>
              <p className="text-sm text-muted-foreground">Search on Skyscanner</p>
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

          <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer">
            <Card className="text-center p-6 hover:shadow-travel transition-shadow cursor-pointer">
              <Hotel className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Book Hotels</h3>
              <p className="text-sm text-muted-foreground">Search on Booking.com</p>
            </Card>
          </a>

          <a href="https://www.getyourguide.com/" target="_blank" rel="noopener noreferrer">
            <Card className="text-center p-6 hover:shadow-travel transition-shadow cursor-pointer">
              <User className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Hire Guide</h3>
              <p className="text-sm text-muted-foreground">Book local guides</p>
            </Card>
          </a>
        </div>

        {/* Top Destinations Section */}
        <section id="destinations" className="mt-12">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-foreground">Top Destinations in India</h3>
            <p className="text-muted-foreground">Explore India's most iconic places</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                name: "Taj Mahal, Agra",
                description: "One of the seven wonders of the world, this ivory-white marble mausoleum is a testament to eternal love",
                image: destinationImages.tajMahal,
                type: "Historical"
              },
              {
                id: 2,
                name: "Varanasi Ghats",
                description: "The spiritual capital of India, known for its ancient temples and cultural heritage along the Ganges",
                image: destinationImages.varanasi,
                type: "Spiritual"
              },
              {
                id: 3,
                name: "Jaipur City Palace",
                description: "The pink city's magnificent palace complex showcasing Rajasthani and Mughal architecture",
                image: destinationImages.jaipur,
                type: "Heritage"
              },
              {
                id: 4,
                name: "Kerala Backwaters",
                description: "Serene network of lagoons, lakes, and canals parallel to the Arabian Sea coast",
                image: destinationImages.kerala,
                type: "Nature"
              },
              {
                id: 5,
                name: "Goa Beaches",
                description: "Famous for its pristine beaches, vibrant nightlife, and Portuguese heritage",
                image: destinationImages.goa,
                type: "Beach"
              },
              {
                id: 6,
                name: "Ladakh",
                description: "High-altitude desert with stunning landscapes, Buddhist monasteries, and adventure activities",
                image: destinationImages.ladakh,
                type: "Adventure"
              }
            ].map((destination) => (
              <Card key={destination.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={`${destination.name}`}
                    className="w-full h-40 object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{destination.name}</h4>
                    <Badge variant="outline">{destination.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{destination.description}</p>
                  <div className="flex items-center justify-end pt-2">
                    <Button size="sm" onClick={() => {
                      setSearchTerm(destination.name.split(',')[0]);
                      handleSearch();
                    }}>Explore</Button>
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
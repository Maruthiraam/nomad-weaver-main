-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create Indian cities table
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  popular_attractions TEXT[],
  best_time_to_visit TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cities (public read access)
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cities" ON public.cities
FOR SELECT USING (true);

-- Create hotels table
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  amenities TEXT[],
  price_per_night INTEGER NOT NULL, -- in INR
  available_rooms INTEGER DEFAULT 0,
  hotel_type TEXT CHECK (hotel_type IN ('budget', 'mid-range', 'luxury', 'boutique')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on hotels (public read access)
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hotels" ON public.hotels
FOR SELECT USING (true);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_amount INTEGER NOT NULL, -- in INR
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
FOR UPDATE USING (auth.uid() = user_id);

-- Create currency rates table
CREATE TABLE public.currency_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate DECIMAL(10, 6) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Enable RLS on currency rates (public read access)
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view currency rates" ON public.currency_rates
FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at
BEFORE UPDATE ON public.hotels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample Indian cities
INSERT INTO public.cities (name, state, description, image_url, latitude, longitude, popular_attractions, best_time_to_visit) VALUES
('Mumbai', 'Maharashtra', 'The financial capital of India, known for Bollywood and vibrant street life.', '/api/placeholder/400/300', 19.0760, 72.8777, ARRAY['Gateway of India', 'Marine Drive', 'Bollywood Studios', 'Elephanta Caves'], 'October to February'),
('Delhi', 'Delhi', 'The capital city with rich history, from Red Fort to India Gate.', '/api/placeholder/400/300', 28.6139, 77.2090, ARRAY['Red Fort', 'India Gate', 'Qutub Minar', 'Lotus Temple'], 'October to March'),
('Bangalore', 'Karnataka', 'Silicon Valley of India with pleasant weather and gardens.', '/api/placeholder/400/300', 12.9716, 77.5946, ARRAY['Lalbagh Gardens', 'Bangalore Palace', 'Cubbon Park', 'ISKON Temple'], 'September to February'),
('Goa', 'Goa', 'Beach paradise with Portuguese heritage and vibrant nightlife.', '/api/placeholder/400/300', 15.2993, 74.1240, ARRAY['Baga Beach', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Old Goa Churches'], 'November to February'),
('Jaipur', 'Rajasthan', 'The Pink City with magnificent palaces and forts.', '/api/placeholder/400/300', 26.9124, 75.7873, ARRAY['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar'], 'October to March'),
('Kerala', 'Kerala', 'Gods Own Country with backwaters, spices, and Ayurveda.', '/api/placeholder/400/300', 10.8505, 76.2711, ARRAY['Backwaters', 'Munnar Hills', 'Periyar Wildlife', 'Fort Kochi'], 'September to March'),
('Udaipur', 'Rajasthan', 'City of Lakes with romantic palaces and heritage.', '/api/placeholder/400/300', 24.5854, 73.7125, ARRAY['City Palace', 'Lake Pichola', 'Jagdish Temple', 'Saheliyon ki Bari'], 'September to March'),
('Agra', 'Uttar Pradesh', 'Home to the iconic Taj Mahal and Mughal architecture.', '/api/placeholder/400/300', 27.1767, 78.0081, ARRAY['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh'], 'October to March');

-- Insert sample hotels for Mumbai
INSERT INTO public.hotels (city_id, name, description, address, image_url, rating, amenities, price_per_night, available_rooms, hotel_type) 
SELECT c.id, 'The Taj Mahal Palace', 'Iconic luxury hotel overlooking Gateway of India', 'Apollo Bunder, Colaba, Mumbai', '/api/placeholder/400/300', 4.8, 
ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge'], 25000, 50, 'luxury'
FROM public.cities c WHERE c.name = 'Mumbai';

INSERT INTO public.hotels (city_id, name, description, address, image_url, rating, amenities, price_per_night, available_rooms, hotel_type) 
SELECT c.id, 'Hotel Marine Plaza', 'Comfortable mid-range hotel near Marine Drive', 'Marine Drive, Mumbai', '/api/placeholder/400/300', 4.2, 
ARRAY['WiFi', 'Restaurant', 'Room Service', 'AC'], 8000, 30, 'mid-range'
FROM public.cities c WHERE c.name = 'Mumbai';

-- Insert sample hotels for Delhi
INSERT INTO public.hotels (city_id, name, description, address, image_url, rating, amenities, price_per_night, available_rooms, hotel_type) 
SELECT c.id, 'The Imperial', 'Heritage luxury hotel in the heart of Delhi', 'Janpath, New Delhi', '/api/placeholder/400/300', 4.7, 
ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Butler Service'], 20000, 40, 'luxury'
FROM public.cities c WHERE c.name = 'Delhi';

INSERT INTO public.hotels (city_id, name, description, address, image_url, rating, amenities, price_per_night, available_rooms, hotel_type) 
SELECT c.id, 'Hotel Clark Shiraz', 'Budget-friendly hotel near Connaught Place', 'Connaught Place, New Delhi', '/api/placeholder/400/300', 3.8, 
ARRAY['WiFi', 'Restaurant', 'AC'], 4000, 25, 'budget'
FROM public.cities c WHERE c.name = 'Delhi';

-- Insert sample hotels for other cities
INSERT INTO public.hotels (city_id, name, description, address, image_url, rating, amenities, price_per_night, available_rooms, hotel_type) 
SELECT c.id, 'The Leela Palace', 'Ultra-luxury hotel with royal treatment', 'Old Airport Road, Bangalore', '/api/placeholder/400/300', 4.9, 
ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Golf Course'], 18000, 35, 'luxury'
FROM public.cities c WHERE c.name = 'Bangalore';

INSERT INTO public.hotels (city_id, name, description, address, image_url, rating, amenities, price_per_night, available_rooms, hotel_type) 
SELECT c.id, 'Taj Exotica', 'Beachfront resort with water sports', 'Benaulim, South Goa', '/api/placeholder/400/300', 4.6, 
ARRAY['WiFi', 'Pool', 'Beach Access', 'Water Sports', 'Spa', 'Restaurant'], 15000, 60, 'luxury'
FROM public.cities c WHERE c.name = 'Goa';

INSERT INTO public.hotels (city_id, name, description, address, image_url, rating, amenities, price_per_night, available_rooms, hotel_type) 
SELECT c.id, 'Rambagh Palace', 'Former palace turned luxury hotel', 'Bhawani Singh Road, Jaipur', '/api/placeholder/400/300', 4.8, 
ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Heritage Tours', 'Royal Treatment'], 22000, 25, 'luxury'
FROM public.cities c WHERE c.name = 'Jaipur';

-- Insert currency rates
INSERT INTO public.currency_rates (from_currency, to_currency, rate) VALUES
('INR', 'USD', 0.012),
('USD', 'INR', 83.0),
('INR', 'EUR', 0.011),
('EUR', 'INR', 90.5),
('INR', 'GBP', 0.0095),
('GBP', 'INR', 105.2),
('INR', 'AED', 0.044),
('AED', 'INR', 22.6),
('INR', 'SGD', 0.016),
('SGD', 'INR', 62.1);
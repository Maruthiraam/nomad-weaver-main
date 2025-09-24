import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Hotel {
  id: string;
  name: string;
  description: string;
  city_id: string;
  price_per_night: number;
  rating: number;
  image_url: string;
  amenities: string[];
  hotel_type: string;
  address: string;
  available_rooms: number;
}

interface City {
  id: string;
  name: string;
  state: string;
  description: string;
  image_url: string;
  popular_attractions: string[];
}

export const useHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');

      if (error) throw error;
      setCities(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch cities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async (cityId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('hotels')
        .select('*')
        .order('rating', { ascending: false });

      if (cityId) {
        query = query.eq('city_id', cityId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHotels(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch hotels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchDestinations = async (searchTerm: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to search destinations",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchHotels();
  }, []);

  return {
    hotels,
    cities,
    loading,
    fetchHotels,
    fetchCities,
    searchDestinations,
  };
};
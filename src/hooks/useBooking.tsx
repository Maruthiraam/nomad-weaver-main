import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BookingData {
  hotel_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_amount: number;
  currency: string;
}

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createBooking = async (bookingData: BookingData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a booking",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Created",
        description: "Your booking has been created successfully!",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Booking Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const getUserBookings = async () => {
    if (!user) return { data: [], error: 'Not authenticated' };

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels (
            name,
            image_url,
            address
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
      return { data: [], error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createBooking,
    getUserBookings,
  };
};
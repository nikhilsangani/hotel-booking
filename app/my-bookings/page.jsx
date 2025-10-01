// app/my-bookings/page.js - UPDATED
'use client';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user, getToken } = useAuth(); // Add useAuth


    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        fetchBookings();
    }, [isAuthenticated]);

     const fetchBookings = async () => {
    try {
      const token = getToken();
      
      const response = await fetch(`/api/bookings?user_id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-600 mt-2">Manage your upcoming and past reservations</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-6">Start planning your next trip!</p>
                        <a href="/hotels" className="btn-primary">
                            Browse Hotels
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map(booking => (
                            <div key={booking.id} className="card p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">{booking.hotel_name}</h3>
                                        <div className="flex items-center text-gray-600 mt-1">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span>{booking.hotel_city}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {booking.room_type} • {formatCurrency(booking.room_price)}/night
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed'
                                                ? 'bg-green-100 text-green-800'
                                                : booking.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                        <div className="text-2xl font-bold text-primary-600 mt-2">
                                            {formatCurrency(booking.total_amount)}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <div>
                                            <div className="font-medium">Check-in</div>
                                            <div>{new Date(booking.check_in).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <div>
                                            <div className="font-medium">Check-out</div>
                                            <div>{new Date(booking.check_out).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="w-4 h-4 mr-2" />
                                        <div>
                                            <div className="font-medium">Guests</div>
                                            <div>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="text-sm text-gray-600">
                                        Booking Reference: <span className="font-mono font-semibold">HB{booking.id.toString().padStart(6, '0')}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Booked on {new Date(booking.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
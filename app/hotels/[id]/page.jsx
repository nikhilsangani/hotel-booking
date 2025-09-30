// app/hotels/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Add useRouter import
import { Star, MapPin, Wifi, Car, Utensils, Tv, Snowflake, Dumbbell, Waves, Coffee } from 'lucide-react';

// Add these to your amenityIcons object
const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  restaurant: Utensils,
  tv: Tv,
  ac: Snowflake,
  gym: Dumbbell,
  pool: Waves,
  breakfast: Coffee,
  spa: Waves,
  beach: Waves,
  fireplace: Coffee,
  hiking: Dumbbell,
  minibar: Coffee,
  balcony: Coffee,
  jacuzzi: Waves,
};

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter(); // Initialize useRouter
  const hotelId = params.id;
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  useEffect(() => {
    fetchHotelDetails();
  }, [hotelId]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/hotels/${hotelId}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch hotel details');
      }
      
      const data = await res.json();
      setHotel(data.hotel);
      setRooms(data.rooms);
      
      // Select first available room by default
      if (data.rooms.length > 0) {
        setSelectedRoom(data.rooms[0]);
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedRoom || !bookingDates.checkIn || !bookingDates.checkOut) {
      alert('Please select a room and provide check-in/check-out dates');
      return;
    }

    // Validate dates
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      alert('Check-in date cannot be in the past');
      return;
    }

    if (checkOut <= checkIn) {
      alert('Check-out date must be after check-in date');
      return;
    }

    // Use Next.js router for navigation
    const bookingParams = new URLSearchParams({
      hotelId: hotelId,
      roomId: selectedRoom.id,
      checkIn: bookingDates.checkIn,
      checkOut: bookingDates.checkOut,
      guests: bookingDates.guests
    });
    
    // Use router.push instead of window.location.href
    router.push(`/bookings?${bookingParams.toString()}`);
  };

  const calculateNights = () => {
    if (!bookingDates.checkIn || !bookingDates.checkOut) return 0;
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Add date validation
  const handleDateChange = (field, value) => {
    setBookingDates(prev => {
      const newDates = { ...prev, [field]: value };
      
      // If check-out is before check-in, reset check-out
      if (field === 'checkIn' && newDates.checkOut && value > newDates.checkOut) {
        newDates.checkOut = '';
      }
      
      return newDates;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h1>
          <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/hotels')}
            className="btn-primary mt-4"
          >
            Browse Hotels
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      <div className="relative h-96 bg-gray-300">
        <img
          src={hotel.image_url || '/hotel-placeholder.jpg'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-5 h-5" />
              <span>{hotel.city}, {hotel.country}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{hotel.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Hotel Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">About This Hotel</h2>
              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities && JSON.parse(hotel.amenities).map(amenity => {
                  const Icon = amenityIcons[amenity];
                  return Icon ? (
                    <div key={amenity} className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-primary-600" />
                      <span className="text-gray-700 capitalize">{amenity}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Available Rooms */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {rooms.map(room => (
                  <div
                    key={room.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRoom?.id === room.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-400'
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{room.room_type}</h3>
                        <p className="text-gray-600 mt-1">Capacity: {room.capacity} guests</p>
                        <p className="text-gray-600">Available: {room.available_rooms} rooms</p>
                        
                        {/* Room Amenities */}
                        {room.amenities && (
                          <div className="flex items-center space-x-2 mt-2">
                            {JSON.parse(room.amenities).slice(0, 4).map(amenity => {
                              const Icon = amenityIcons[amenity];
                              return Icon ? (
                                <Icon key={amenity} className="w-4 h-4 text-gray-500" />
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          ${room.price}
                        </div>
                        <div className="text-gray-600 text-sm">per night</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {rooms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No rooms available at the moment
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Book Your Stay</h3>
              
              {/* Selected Room */}
              {selectedRoom && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">{selectedRoom.room_type}</h4>
                  <p className="text-2xl font-bold text-primary-600 mt-1">
                    ${selectedRoom.price}
                    <span className="text-sm font-normal text-gray-600"> / night</span>
                  </p>
                </div>
              )}

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={bookingDates.checkIn}
                    onChange={(e) => handleDateChange('checkIn', e.target.value)}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={bookingDates.checkOut}
                    onChange={(e) => handleDateChange('checkOut', e.target.value)}
                    className="input-field"
                    min={bookingDates.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <select
                    value={bookingDates.guests}
                    onChange={(e) => setBookingDates(prev => ({
                      ...prev,
                      guests: parseInt(e.target.value)
                    }))}
                    className="input-field"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Summary */}
                {nights > 0 && selectedRoom && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>${selectedRoom.price} x {nights} nights</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service fee</span>
                      <span>${(totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(totalPrice * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBookNow}
                  disabled={!selectedRoom || nights === 0}
                  className="btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Book Now
                </button>

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
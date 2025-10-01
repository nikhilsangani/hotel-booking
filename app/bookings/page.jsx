// app/booking/page.js - UPDATED
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, MapPin, Calendar, User, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user, getToken } = useAuth();

  const [bookingData, setBookingData] = useState({
    hotelId: searchParams.get('hotelId'),
    roomId: searchParams.get('roomId'),
    checkIn: searchParams.get('checkIn'),
    checkOut: searchParams.get('checkOut'),
    guests: parseInt(searchParams.get('guests')) || 1
  });

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Guest information
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  // Payment information
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  useEffect(() => {
    if (bookingData.hotelId && bookingData.roomId) {
      fetchBookingDetails();
    } else {
      router.push('/hotels');
    }
  }, [bookingData.hotelId, bookingData.roomId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);

      const hotelRes = await fetch(`/api/hotels/${bookingData.hotelId}`);
      if (!hotelRes.ok) throw new Error('Failed to fetch hotel details');
      const hotelData = await hotelRes.json();

      setHotel(hotelData.hotel);

      const selectedRoom = hotelData.rooms.find(r => r.id === parseInt(bookingData.roomId));
      setRoom(selectedRoom);

    } catch (error) {
      console.error('Error fetching booking details:', error);
      alert('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateTotal = () => {
    if (!room) return 0;
    const nights = calculateNights();
    const roomTotal = room.price * nights;
    const serviceFee = roomTotal * 0.1;
    const tax = roomTotal * 0.08;
    return roomTotal + serviceFee + tax;
  };

  const handleInputChange = (setter) => (e) => {
    setter(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    if (bookingData.hotelId && bookingData.roomId) {
      fetchBookingDetails();
    } else {
      router.push('/hotels');
    }
  }, [bookingData.hotelId, bookingData.roomId, isAuthenticated]);
  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      alert('Please fill in all required guest information');
      return;
    }

    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.nameOnCard) {
      alert('Please fill in all payment information');
      return;
    }

    setProcessing(true);

    try {
      const totalAmount = calculateTotal();
      const token = getToken();

      const bookingPayload = {
        user_id: user.id, // Use authenticated user's ID
        hotel_id: bookingData.hotelId,
        room_id: bookingData.roomId,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guests: bookingData.guests,
        total_amount: totalAmount,
        status: 'confirmed'
      };

      // Save booking to database with authentication
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

      // Redirect to success page with booking ID
      router.push(`/booking-success?bookingId=${result.booking.id}`);

    } catch (error) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!hotel || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600">The booking details are invalid or expired.</p>
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
  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Review your stay details and enter your information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Guest Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={guestInfo.firstName}
                    onChange={handleInputChange(setGuestInfo)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={guestInfo.lastName}
                    onChange={handleInputChange(setGuestInfo)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={guestInfo.email}
                    onChange={handleInputChange(setGuestInfo)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={guestInfo.phone}
                    onChange={handleInputChange(setGuestInfo)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={guestInfo.specialRequests}
                  onChange={handleInputChange(setGuestInfo)}
                  rows="3"
                  className="input-field"
                  placeholder="Any special requirements or requests..."
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={paymentInfo.nameOnCard}
                    onChange={handleInputChange(setPaymentInfo)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setPaymentInfo(prev => ({ ...prev, cardNumber: formatted }));
                    }}
                    className="input-field"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value);
                        setPaymentInfo(prev => ({ ...prev, expiryDate: formatted }));
                      }}
                      className="input-field"
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handleInputChange(setPaymentInfo)}
                      className="input-field"
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

              {/* Hotel Info */}
              <div className="flex space-x-4 mb-4">
                <img
                  src={hotel.image_url}
                  alt={hotel.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold">{hotel.name}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{hotel.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div className="border-t pt-4">
                <h5 className="font-semibold">{room.room_type}</h5>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'}</span>
                  <span>${room.price} / night</span>
                </div>
              </div>

              {/* Dates */}
              <div className="border-t pt-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Dates</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Check-in</span>
                  <span className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Check-out</span>
                  <span className="font-medium">{new Date(bookingData.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Duration</span>
                  <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Room charge ({nights} nights)</span>
                  <span>${(room.price * nights).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>${(room.price * nights * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(room.price * nights * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleSubmitBooking}
                disabled={processing}
                className="btn-primary w-full mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Confirm Booking - $${totalAmount.toFixed(2)}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                You won't be charged until you check in
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
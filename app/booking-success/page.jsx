// app/booking-success/page.js - UPDATED
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, User } from 'lucide-react';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [bookingReference, setBookingReference] = useState('');

  useEffect(() => {
    if (bookingId) {
      setBookingReference('HB' + bookingId.toString().padStart(6, '0'));
    } else {
      // Generate a random booking reference if no booking ID
      setBookingReference('HB' + Math.random().toString(36).substr(2, 8).toUpperCase());
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Your hotel reservation has been successfully confirmed. We've sent a confirmation email with all the details.
          </p>

          {/* Booking Reference */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="text-xl font-bold text-gray-900">{bookingReference}</p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-start text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Check your email for booking confirmation</span>
            </div>
            <div className="flex items-center justify-start text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Present your ID at check-in</span>
            </div>
            <div className="flex items-center justify-start text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span>Contact the hotel for special requests</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/my-bookings"
              className="btn-primary w-full block"
            >
              View My Bookings
            </Link>
            <Link
              href="/hotels"
              className="btn-secondary w-full block"
            >
              Book Another Stay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/page.js
import Link from 'next/link';
import { Search, Shield, Star, Award } from 'lucide-react';
import HotelCard from '../components/HotelCard';

async function getFeaturedHotels() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotels?limit=3`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch hotels');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

export default async function Home() {
  const featuredHotels = await getFeaturedHotels();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Discover amazing hotels worldwide with the best prices and amenities for your next adventure.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 max-w-2xl mx-auto shadow-lg">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="input-field text-gray-900 flex-1"
                />
                <input
                  type="date"
                  className="input-field text-gray-900"
                />
                <input
                  type="date"
                  className="input-field text-gray-900"
                />
                <button className="btn-primary flex items-center justify-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose HotelBooking?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Your information and payments are protected with bank-level security.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">We guarantee the best prices for all our hotel partners worldwide.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer support team is available around the clock to help you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Hotels</h2>
            <Link href="/hotels" className="text-primary-600 hover:text-primary-700 font-semibold">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotels.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
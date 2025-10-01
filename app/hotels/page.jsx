// app/hotels/page.jsx
'use client';
import { useState, useEffect } from 'react';
import HotelCard from '../../components/HotelCard';
import SearchFilters from '../../components/SearchFilters';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    rating: ''
  });

  useEffect(() => {
    fetchHotels();
  }, []);
  const clearFilters = () => {
  const clearedFilters = {
    city: '',
    minPrice: '',
    maxPrice: '',
    rating: ''
  };
  setFilters(clearedFilters);
  fetchHotels(clearedFilters);
};

  const fetchHotels = async (searchFilters = {}) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const queryString = params.toString();
      const url = queryString ? `/api/hotels?${queryString}` : '/api/hotels';
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('Failed to fetch hotels');
      }
      
      const data = await res.json();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    fetchHotels(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen max-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
       <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Hotel</h1>
          <p className="text-gray-600">Discover amazing places to stay around the world</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 max-h-[70vh]">
            <SearchFilters onSearch={handleSearch} />
          </div>

          {/* Hotels Grid - Scrollable Container */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} found
                {filters.city && ` in ${filters.city}`}
              </p>
            </div>

            {/* Scrollable Hotel Cards Container */}
            <div className="max-h-[70vh] overflow-y-auto  pr-4 thin-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </div>

            {hotels.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search filters or search in a different location</p>
                <button
                  onClick={() => {
                    const clearedFilters = { city: '', minPrice: '', maxPrice: '', rating: '' };
                    setFilters(clearedFilters);
                    fetchHotels(clearedFilters);
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
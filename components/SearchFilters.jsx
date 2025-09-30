// components/SearchFilters.jsx
'use client';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    rating: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      city: '',
      minPrice: '',
      maxPrice: '',
      rating: ''
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Filter className="w-5 h-5 text-gray-500" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* City Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <input
            type="text"
            placeholder="Enter city or hotel name"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (per night)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
            className="input-field"
          >
            <option value="">Any rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
            <option value="3.0">3.0+ Stars</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 pt-4">
          <button
            type="submit"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Hotels</span>
          </button>
          
          <button
            type="button"
            onClick={clearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </form>

      {/* Popular Destinations */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Popular Destinations
        </h4>
        <div className="space-y-2">
          {['New York', 'Miami', 'Los Angeles', 'Chicago', 'Las Vegas'].map((city) => (
            <button
              key={city}
              onClick={() => {
                handleChange('city', city);
                onSearch({ ...filters, city });
              }}
              className="block w-full text-left text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
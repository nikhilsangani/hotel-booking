// components/HotelCard.jsx
import Link from 'next/link';
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
  spa: Waves, // You might want a different icon for spa
  beach: Waves,
  fireplace: Coffee, // Placeholder - get a fireplace icon
  hiking: Dumbbell, // Placeholder
  minibar: Coffee, // Placeholder
  balcony: Coffee, // Placeholder
  jacuzzi: Waves, // Placeholder
};

export default function HotelCard({ hotel }) {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={hotel.image_url || '/hotel-placeholder.jpg'}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{hotel.rating}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{hotel.name}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{hotel.city}, {hotel.country}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {hotel.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {hotel.amenities && JSON.parse(hotel.amenities).slice(0, 3).map(amenity => {
              const Icon = amenityIcons[amenity];
              return Icon ? <Icon key={amenity} className="w-4 h-4 text-gray-500" /> : null;
            })}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary-600">
              ${hotel.price_per_night}
            </span>
            <span className="text-gray-600 text-sm block">per night</span>
          </div>
        </div>

        <Link
          href={`/hotels/${hotel.id}`}
          className="btn-primary w-full text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
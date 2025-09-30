// components/Header.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, User, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">HotelBooking</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/hotels" className="text-gray-700 hover:text-primary-600 transition-colors">
              Hotels
            </Link>
            <Link href="/my-bookings" className="text-gray-700 hover:text-primary-600 transition-colors">
              My Bookings
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/hotels" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link href="/hotels" className="text-gray-700 hover:text-primary-600">
                Hotels
              </Link>
              <Link href="/my-bookings" className="text-gray-700 hover:text-primary-600">
                My Bookings
              </Link>
              <div className="pt-4 border-t">
                <button className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-primary-600">
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
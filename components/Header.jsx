// components/Header.jsx - UPDATED
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Search, User, Menu, X, LogOut } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky  top-0 right-0 left-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#006D77]-600 rounded-lg"></div>
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
            {isAuthenticated && (
              <Link href="/my-bookings" className="text-gray-700 hover:text-primary-600 transition-colors">
                My Bookings
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/hotels" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user.first_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
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
              {isAuthenticated && (
                <Link href="/my-bookings" className="text-gray-700 hover:text-primary-600">
                  My Bookings
                </Link>
              )}

              <div className="pt-4 border-t">
                {/* {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="text-gray-700">
                      Welcome, {user.first_name}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-primary-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      href="/auth/signin" 
                      className="block w-full text-center text-gray-700 hover:text-primary-600"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="block w-full text-center btn-primary"
                    >
                      Sign Up
                    </Link>
                  </div>
                )} */}
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">
                      Welcome, {user.first_name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600">
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="btn-primary">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
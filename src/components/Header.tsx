"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLocationStore } from '../store/locationStore';
import { useSession, signOut } from 'next-auth/react';


export const Header = () => {
  const { data: session } = useSession();
  const { isAuthenticated, setIsAuthenticated, login, logout } = useAuthStore();
  const { city } = useLocationStore();

  // Update authentication state based on session
  useEffect(() => {
    if (session) {
      setIsAuthenticated(true);
      login(session); // Store the session in Zustand
    } else {
      setIsAuthenticated(false);
    }
  }, [session, setIsAuthenticated, login]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/home' }); // Sign out and redirect to sign-in page
    logout(); // Clear Zustand state
  };

  return (
    <header className="bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/home" className="flex items-center">
            <span className="text-[26px] font-semibold font-Proxima text-[#EF4443]">StreetByte</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile">
                  <User className="w-6 h-6 text-gray-600 hover:text-red-500" />
                </Link>
                <button onClick={handleLogout}>
                  <LogOut className="w-6 h-6 text-gray-600 hover:text-red-500" />
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="text-red-500 text-lg hover:text-red-600">
                Login
              </Link>
            )}
            <Menu className="w-6 h-6 text-gray-600 hover:text-red-500 md:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
};
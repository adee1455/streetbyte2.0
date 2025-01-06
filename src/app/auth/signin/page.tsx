'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Utensils, Star, Sparkles } from 'lucide-react';

const AuthPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { callbackUrl: "/home" });
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 ">
        <div className="space-y-4 mb-6">
          <h2 className="text-3xl font-bold text-[#EF4443] text-center">
            Discover Local Food
          </h2>
          <p className="text-gray-600 text-center text-md">
            Join our community of food enthusiasts
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center px-4 py-3 mb-6 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" fill="currentColor">
            <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Continue with Google
        </button>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Login Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Utensils className="w-5 h-5 mr-3 text-[#EF4443]" />
              <span>Add new food places</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Star className="w-5 h-5 mr-3 text-[#EF4443]" />
              <span>Share your food reviews</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Sparkles className="w-5 h-5 mr-3 text-[#EF4443]" />
              <span>Access upcoming features first</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-center text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
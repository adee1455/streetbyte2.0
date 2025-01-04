'use client';

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type FormData = {
  fullName?: string;
  email: string;
  password: string;
};

const AuthPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { callbackUrl: "/home" });
    
    if (result?.error) {
      setError(result.error);
    } else {
      // Redirect to dashboard after successful login
      
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600">
          Sign in to access your dashboard and manage your account.
        </p>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-500 transition duration-200 ease-in-out flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill="currentColor"
          >
            <path d="M23.49 12.27c-.01-.01-.01-.01-.02-.02-1.1-.01-2.16.1-3.19.3-1.03.2-2.01.5-2.93.9-.92.4-1.76.9-2.54 1.5-.78.6-1.45 1.3-2.01 2.1-.56.8-.97 1.7-1.25 2.7-.28 1-.42 2.1-.42 3.2 0 1.1.14 2.2.42 3.2.28 1 .69 1.9 1.25 2.7.56.8 1.23 1.5 2.01 2.1.78.6 1.62 1.1 2.54 1.5.92.4 1.9.7 2.93.9 1.03.2 2.09.3 3.19.3.01 0 .01 0 .02-.01 1.1 0 2.16-.1 3.19-.3 1.03-.2 2.01-.5 2.93-.9.92-.4 1.76-.9 2.54-1.5.78-.6 1.45-1.3 2.01-2.1.56-.8.97-1.7 1.25-2.7.28-1 .42-2.1.42-3.2 0-1.1-.14-2.2-.42-3.2-.28-1-.69-1.9-1.25-2.7-.56-.8-1.23-1.5-2.01-2.1-.78-.6-1.62-1.1-2.54-1.5-.92-.4-1.9-.7-2.93-.9-1.03-.2-2.09-.3-3.19-.3z" />
          </svg>
          Continue with Google
        </button>
        <p className="text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

'use client';

import { useState } from 'react';
import { useSupabase } from '@/app/supabase-provider';

export default function AuthForm() {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      // For v1, we'll just log the user in directly after signup.
      // In a real app, you'd want to redirect to a "check your email" page.
      setError(null);
      window.location.href = '/home';
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      window.location.href = '/home';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Ponte.ai</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-between">
          <button onClick={handleLogin} className="w-full p-2 mr-2 text-white bg-blue-500 rounded">
            Login
          </button>
          <button onClick={handleSignUp} className="w-full p-2 ml-2 text-white bg-green-500 rounded">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

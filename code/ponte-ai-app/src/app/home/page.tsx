'use client';

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Hello World, you've logged in</h1>
        <button onClick={handleLogout} className="w-full p-2 text-white bg-red-500 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-4 p-4 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-bold transition-all mt-auto"
    >
      <LogOut size={20} />
      Sair
    </button>
  );
}

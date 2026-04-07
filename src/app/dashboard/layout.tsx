import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import LogoutButton from '@/components/LogoutButton';
import DashboardNav from '@/components/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('DashboardLayout: Initializing Supabase client...');
  const supabase = await createClient();
  console.log('DashboardLayout: Fetching user...');
  const { data, error: authError } = await supabase.auth.getUser();
  const user = data?.user;
  console.log('DashboardLayout: User fetched.', { user: user?.email, error: authError });

  if (authError || !user) {
    console.log('DashboardLayout: Redirecting to /login');
    redirect('/login');
  }

  // For now, let's assume all logged in users can see the admin link for testing convenience
  // or we can restrict it to a specific email if you want.
  const isAdmin = user.email === 'contato@felipelacerda.com' || user.email?.includes('admin');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8 fixed h-full z-40">
        <div className="flex items-center gap-2 mb-12">
           <span className="text-2xl">✨</span>
           <span className="font-bold text-xl">Delicatta</span>
        </div>

        <DashboardNav />

        <LogoutButton />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-80">
        {children}
      </main>
    </div>
  );
}

import { Plus, Settings, LogOut, ExternalLink, Calendar, MapPin, MoreVertical, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/utils/supabase/server';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // For now, since Prisma is still used, we need to map Supabase user to Prisma user
  // But since we switched auth, perhaps we need to adjust
  // For simplicity, assume user.id is the same, but actually, Supabase user.id is UUID

  const invitations = await prisma.invitation.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalVisits = invitations.reduce((acc: number, inv: any) => acc + 0, 0); // Need to implement visits tracking later
  const totalRsvps = await prisma.rSVP.count({
    where: {
      invitation: {
        userId: user.id,
      },
      confirmed: true,
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8 fixed h-full z-40">
        <div className="flex items-center gap-2 mb-12">
           <span className="text-2xl">✨</span>
           <span className="font-bold text-xl">Convite<span className="text-purple-600">Online</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-4 p-4 bg-purple-50 text-purple-600 rounded-2xl font-bold transition-all relative">
            <span className="bg-purple-600 w-1.5 h-6 rounded-full absolute left-0"></span>
            Dashboard
          </Link>
          <Link href="/dashboard/novo" className="flex items-center gap-4 p-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl font-semibold transition-all">
            <Plus size={20} />
            Criar Novo
          </Link>
          <Link href="/dashboard/config" className="flex items-center gap-4 p-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl font-semibold transition-all">
            <Settings size={20} />
            Configurações
          </Link>
        </nav>

        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 p-6 md:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-slate-800">Seus Convites</h1>
            <p className="text-slate-500">Olá, {user?.email || 'usuário'}. Gerencie seus eventos e acompanhe as visitas.</p>
          </div>
          <Link href="/dashboard/novo" className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <Plus size={20} /> Novo Convite
          </Link>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-1">Total de Convites</p>
            <h3 className="text-3xl font-bold text-slate-800">{invitations.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-1">Total de Visualizações</p>
            <h3 className="text-3xl font-bold text-slate-800">0</h3>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-1">RSVP Confirmados</p>
            <h3 className="text-3xl font-bold text-slate-800">{totalRsvps}</h3>
          </div>
        </div>

        {/* Filters/Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Buscar convite..." 
               className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none transition-all shadow-sm"
             />
           </div>
           <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
             <Filter size={18} /> Filtros
           </button>
        </div>

        {/* Invitation Grid */}
        {invitations.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {invitations.map((inv: any) => (
              <div key={inv.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 rounded-[2rem] overflow-hidden bg-slate-100 flex-shrink-0 relative">
                  {inv.imageUrl ? (
                    <img src={inv.imageUrl} alt={inv.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <span className="text-4xl text-purple-200">✨</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{inv.title}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Calendar size={14} /> {inv.date}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <MapPin size={14} /> {inv.location}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/convite/${inv.code}`} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl text-center text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      <ExternalLink size={16} /> Ver Online
                    </Link>
                    <Link href={`/dashboard/editar/${inv.id}`} className="flex-1 bg-purple-100 text-purple-600 font-bold py-3 px-4 rounded-xl text-center text-sm hover:bg-purple-600 hover:text-white transition-all">
                      Editar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-purple-50 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum convite criado</h3>
             <p className="text-slate-500 mb-8">Comece criando seu primeiro convite digital agora mesmo.</p>
             <Link href="/dashboard/novo" className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2">
                <Plus size={20} /> Criar Meu Primeiro Convite
             </Link>
          </div>
        )}
      </main>
    </div>
  );
}

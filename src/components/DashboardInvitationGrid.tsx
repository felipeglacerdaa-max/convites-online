'use client';

import { Plus, Calendar, MapPin, Search, Filter, ExternalLink, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Invitation {
  id: string;
  code: string;
  adminCode: string; // Adicionado aqui
  title: string;
  date: string;
  location: string;
  imageUrl?: string;
}

interface DashboardInvitationGridProps {
  invitations: Invitation[];
  totalRsvps: number;
  userEmail: string;
}

export function DashboardInvitationGrid({ invitations: initialInvitations, totalRsvps, userEmail }: DashboardInvitationGridProps) {
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvitations = invitations.filter(inv =>
    inv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-slate-800">Seus Convites</h1>
          <p className="text-slate-500">Olá, {userEmail || 'usuário'}. Gerencie seus eventos e acompanhe as visitas.</p>
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
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
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
          {filteredInvitations.map((inv) => (
            <div key={inv.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-6 relative">
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
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/convite/${inv.code}`} className="flex-1 min-w-[140px] bg-purple-600 text-white font-bold py-3 px-4 rounded-xl text-center text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30">
                    <ExternalLink size={16} /> Ver Online
                  </Link>
                  <Link href={`/gerenciar/${inv.adminCode}`} className="flex-1 min-w-[140px] bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl text-center text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                    <Settings size={16} /> Administrar
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
    </div>
  );
}

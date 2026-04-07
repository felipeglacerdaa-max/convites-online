import { Plus, Settings, LogOut, ExternalLink, Calendar, MapPin, MoreVertical, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  const invitations = [
    { id: '1', title: 'Casamento Lucas & Ana', date: '15/06/2026', location: 'Espaço das Flores', status: 'Ativo', visits: 142, code: 'lucas-ana-2026', img: '/assets/img/template_casamento.png' },
    { id: '2', title: 'Aniversário da Sofia', date: '22/07/2026', location: 'Buffet Kids', status: 'Ativo', visits: 56, code: 'sofia-10-anos', img: '/assets/img/template_aniversario.png' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8 fixed h-full z-40">
        <div className="flex items-center gap-2 mb-12">
           <span className="text-2xl">✨</span>
           <span className="font-bold text-xl">Convite<span className="text-purple-600">Online</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-4 p-4 bg-purple-50 text-purple-600 rounded-2xl font-bold transition-all">
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

        <button className="flex items-center gap-4 p-4 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-bold transition-all mt-auto">
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 p-6 md:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-slate-800">Seus Convites</h1>
            <p className="text-slate-500">Gerencie seus eventos e acompanhe as visitas.</p>
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
            <h3 className="text-3xl font-bold text-slate-800">198</h3>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-1">RSVP Confirmados</p>
            <h3 className="text-3xl font-bold text-slate-800">42</h3>
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {invitations.map((inv) => (
            <div key={inv.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 rounded-[2rem] overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={inv.img} alt={inv.title} className="w-full h-full object-cover" />
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
      </main>
    </div>
  );
}

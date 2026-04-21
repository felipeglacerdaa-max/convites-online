'use client';

import { useState, use, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Sparkles, 
  Lock, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  Trophy,
  Activity,
  Heart
} from 'lucide-react';
import Link from 'next/link';

export default function ClientAdminPage({ params }: { params: Promise<{ adminCode: string }> }) {
  const { adminCode } = use(params);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitation, setInvitation] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/invitation/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminCode, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erro ao entrar.');
        return;
      }

      setInvitation(data);
      setIsLoggedIn(true);
      // Save session in local storage for convenience
      localStorage.setItem(`admin_session_${adminCode}`, JSON.stringify({ email, password }));
    } catch (err) {
      setError('Algo deu errado.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-login if session exists
  useEffect(() => {
    const session = localStorage.getItem(`admin_session_${adminCode}`);
    if (session) {
      const { email, password } = JSON.parse(session);
      setEmail(email);
      setPassword(password);
      // We could trigger handleLogin here, but let's keep it simple for now
    }
  }, [adminCode]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse decoration-1000"></div>
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-600/20 mb-6 border border-white/10">
              <Lock size={32} />
            </div>
            <h1 className="text-4xl font-playfair font-bold tracking-tight">Portal do Cliente</h1>
            <p className="text-slate-400">Acesse as confirmações do seu convite</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-sm font-medium mb-6 text-center">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">E-mail</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    placeholder="email@exemplo.com"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium placeholder:text-slate-600" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Senha</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all font-medium placeholder:text-slate-600" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Acessar Painel <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-500 text-sm">
            Dificuldades para acessar? Contate o suporte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans selection:bg-purple-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-600 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles size={14} /> Bem-vindo ao seu painel
            </div>
            <h1 className="text-4xl font-playfair font-bold text-slate-900">{invitation.title}</h1>
            <p className="text-slate-500 flex items-center gap-2">
              <Calendar size={16} /> {invitation.date} às {invitation.time}
            </p>
          </div>
          
          <div className="flex gap-3">
             <Link 
               href={`/convite/${invitation.code}`}
               target="_blank"
               className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:shadow-md transition-all flex items-center gap-2"
             >
                Ver Convite Online
             </Link>
             <button 
                onClick={() => setIsLoggedIn(false)}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
             >
                Sair
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-purple-100 group-hover:text-purple-200 transition-colors">
                <Users size={64} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Confirmados</p>
              <h3 className="text-5xl font-bold text-slate-900">{invitation.rsvps.length}</h3>
              <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-sm">
                 <CheckCircle size={16} /> 100% de ocupação
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-indigo-100 group-hover:text-indigo-200 transition-colors">
                <Trophy size={64} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Visualizações</p>
              <h3 className="text-5xl font-bold text-slate-900">--</h3>
              <div className="mt-4 flex items-center gap-2 text-slate-400 font-bold text-sm">
                 <Activity size={16} /> Acompanhando ao vivo
              </div>
           </div>

           <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-purple-600/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:text-white/20 transition-colors">
                <Heart size={64} />
              </div>
              <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Link do Convite</p>
              <h3 className="text-xl font-bold break-all mb-4">/convite/{invitation.code}</h3>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/convite/${invitation.code}`);
                  alert('Link copiado!');
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold transition-all"
              >
                 Copiar Link de Compartilhamento
              </button>
           </div>
        </div>

        {/* Guest List */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
               <h2 className="text-2xl font-playfair font-bold text-slate-900">Lista de Convidados</h2>
               <p className="text-slate-500 text-sm">Pessoas que confirmaram presença até o momento</p>
             </div>
             <div className="bg-slate-50 px-4 py-2 rounded-xl text-slate-500 text-xs font-bold uppercase tracking-widest">
                {invitation.rsvps.length} nomes na lista
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50/50">
                      <th className="py-6 px-10 text-xs font-bold text-slate-400 uppercase tracking-widest">Nome Completo</th>
                      <th className="py-6 px-10 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="py-6 px-10 text-xs font-bold text-slate-400 uppercase tracking-widest">Data da Confirmação</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {invitation.rsvps.length === 0 ? (
                      <tr>
                         <td colSpan={3} className="py-20 text-center text-slate-400 italic">
                            Ainda não há confirmações para este convite.
                         </td>
                      </tr>
                   ) : (
                      invitation.rsvps.map((rsvp: any) => (
                         <tr key={rsvp.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="py-6 px-10 font-bold text-slate-700">
                               {rsvp.name}
                            </td>
                            <td className="py-6 px-10">
                               <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border border-emerald-100">
                                  Confirmado
                               </span>
                            </td>
                            <td className="py-6 px-10 text-slate-400 text-sm font-medium">
                               {new Date(rsvp.createdAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                               })}
                            </td>
                         </tr>
                      ))
                   )}
                </tbody>
             </table>
          </div>
        </div>

        <footer className="mt-20 text-center">
           <div className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300">Painel Delicatta Premium</div>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

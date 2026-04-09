'use client';

import { useState, useEffect } from 'react';
import { Music, MapPin, Calendar, Clock, Video, Heart, Share2, Check, Plus, Loader2, Sparkles } from 'lucide-react';

export default function PublicInvitationContent({ invitation }: { invitation: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleMusic = () => setIsPlaying(!isPlaying);

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: rsvpName, invitationId: invitation.id }),
      });
      if (res.ok) {
        setRsvpSent(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 font-sans selection:bg-rose-100 overflow-x-hidden pb-20">
      {/* Premium Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-paper.png')` }}>
      </div>

      <main className={`relative z-10 max-w-lg mx-auto px-4 py-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Floating Music Button (Refined) */}
        {invitation.musicUrl && (
          <button 
            onClick={toggleMusic}
            className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-700 z-50 ${isPlaying ? 'bg-rose-500 text-white scan-pulse' : 'bg-white/80 backdrop-blur-md text-slate-400 border border-slate-100'}`}
          >
            <Music size={20} className={isPlaying ? 'animate-spin-slow' : ''} />
          </button>
        )}

        {/* Invitation Card Container */}
        <div className="bg-white p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
          
          {/* Internal Decorative Border */}
          <div className="border border-rose-100 rounded-[2rem] p-6 md:p-10 relative">
            
            {/* Header / Hero */}
            <header className="text-center space-y-6 mb-12">
               <div className="flex justify-center mb-4">
                  <div className="w-16 h-1px bg-rose-200 self-center"></div>
                  <Sparkles className="mx-4 text-rose-300" size={24} />
                  <div className="w-16 h-1px bg-rose-200 self-center"></div>
               </div>
               
               <div className="space-y-2">
                 <p className="text-[10px] uppercase tracking-[0.4em] text-rose-400 font-bold">Você foi convidado</p>
                 <h1 className="text-4xl md:text-5xl font-playfair font-bold text-slate-800 leading-tight">
                    {invitation.title}
                 </h1>
               </div>

               {invitation.imageUrl && (
                 <div className="relative mt-8 group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-rose-100 to-indigo-100 rounded-3xl blur opacity-25"></div>
                   <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-4 border-white shadow-inner">
                      <img 
                        src={invitation.imageUrl} 
                        alt={invitation.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      />
                   </div>
                 </div>
               )}
            </header>

            {/* Message */}
            <div className="text-center mb-12 relative">
               <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl text-rose-50 font-serif">"</span>
               <p className="font-playfair italic text-xl text-slate-600 leading-relaxed px-4">
                  {invitation.message}
               </p>
               <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-5xl text-rose-50 font-serif transform rotate-180">"</span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-10 pt-10 border-t border-slate-50 mb-12">
               <div className="flex flex-col items-center text-center space-y-3">
                  <Calendar className="text-rose-400" size={28} strokeWidth={1.5} />
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Quando</h4>
                    <p className="font-playfair font-bold text-xl text-slate-700">{invitation.date}</p>
                    <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
                      <Clock size={14} /> <span>às {invitation.time}</span>
                    </div>
                  </div>
               </div>

               <div className="flex flex-col items-center text-center space-y-3">
                  <MapPin className="text-rose-400" size={28} strokeWidth={1.5} />
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Onde</h4>
                    <p className="font-playfair font-bold text-xl text-slate-700 max-w-[200px] leading-tight">
                      {invitation.location}
                    </p>
                  </div>
                  <button className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors underline decoration-rose-200 underline-offset-4">
                    Ver localização no mapa
                  </button>
               </div>
            </div>

            {/* Video Preview (If exists) */}
            {invitation.videoUrl && (
              <div className="mb-12">
                <div className="aspect-video rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center group cursor-pointer relative">
                   <Video size={40} className="text-rose-200 group-hover:scale-110 transition-transform" />
                   <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="absolute bottom-4 text-[10px] font-bold tracking-[0.2em] text-rose-400 opacity-60 uppercase">Assista nossa história</div>
                </div>
              </div>
            )}

            {/* RSVP Form */}
            <div id="rsvp" className="mt-12 pt-12 border-t border-slate-50 relative">
               {!rsvpSent ? (
                 <div className="space-y-8">
                    <div className="text-center">
                      <Heart className="mx-auto text-rose-200 mb-4" size={32} />
                      <h3 className="text-2xl font-playfair font-bold text-slate-800">Confirmar Presença</h3>
                      <p className="text-slate-400 text-sm mt-1">Gostaríamos muito de contar com você.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleRsvp}>
                      <div className="relative">
                        <input 
                          type="text" 
                          required 
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          placeholder="Seu Nome Completo" 
                          className="w-full bg-slate-50 border-0 rounded-2xl p-5 text-center outline-none focus:ring-2 focus:ring-rose-200 transition-all font-semibold text-slate-700 placeholder:text-slate-300" 
                        />
                      </div>
                      <button 
                        disabled={loading}
                        className="w-full bg-rose-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-rose-500/20 hover:bg-rose-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Confirmar Presença'}
                      </button>
                    </form>
                 </div>
               ) : (
                 <div className="py-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check size={40} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-slate-800">Presença Confirmada!</h3>
                    <p className="text-slate-500 mt-2">Estamos muito felizes que você virá.</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Action Buttons (Sticky at bottom, but refined) */}
        <div className="mt-12 flex items-center justify-center gap-6">
           <button 
             onClick={() => {
               if (navigator.share) {
                 navigator.share({ title: invitation.title, text: invitation.message, url: window.location.href })
               } else {
                 navigator.clipboard.writeText(window.location.href);
                 alert('Link copiado!');
               }
             }}
             className="flex items-center gap-2 font-bold text-slate-400 text-[10px] uppercase tracking-widest hover:text-rose-500 transition-colors"
           >
              <Share2 size={16} /> Compartilhar
           </button>
           <div className="w-[1px] h-4 bg-slate-200"></div>
           <button className="flex items-center gap-2 font-bold text-slate-400 text-[10px] uppercase tracking-widest hover:text-rose-500 transition-colors">
              <Plus size={16} /> Salvar Evento
           </button>
        </div>

        <footer className="mt-20 text-center opacity-30">
           <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">Delicatta Premium</div>
        </footer>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;700&display=swap');
        
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        @keyframes scan-pulse {
          0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(244, 63, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
        }
        .scan-pulse { animation: scan-pulse 2s infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}


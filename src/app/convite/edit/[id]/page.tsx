'use client';

import { useState, useEffect } from 'react';
import { Music, MapPin, Calendar, Clock, Video, Heart, Share2, Check, Plus } from 'lucide-react';

export default function PublicInvitation({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  
  // Mock Data (will be fetched from DB later)
  const invitation = {
    title: 'Casamento Lucas & Ana',
    date: '15 Junho 2026',
    time: '19:00',
    location: 'Espaço das Flores, Av. Paulista 1000, SP',
    message: 'Nossa história ganha um novo capítulo e adoraríamos que você fizesse parte desse momento inesquecível!',
    imageUrl: '/assets/img/template_casamento.png',
    videoUrl: 'https://youtube.com/watch?v=mock',
    musicUrl: 'https://youtube.com/watch?v=music-mock',
  };

  const toggleMusic = () => setIsPlaying(!isPlaying);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 space-y-12 pb-32">
        {/* Floating Music Toggle */}
        <button 
          onClick={toggleMusic}
          className={`fixed top-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-500 z-50 ${isPlaying ? 'bg-purple-600 text-white animate-spin-slow' : 'bg-white text-slate-400'}`}
        >
          <Music size={24} />
        </button>

        {/* Hero Section */}
        <section className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-purple-600/10 aspect-[3/4] group">
          <img src={invitation.imageUrl} alt={invitation.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-10 right-10 text-white space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-80">
              Você está convidado para
            </span>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold">{invitation.title}</h1>
          </div>
        </section>

        {/* Information Section */}
        <section className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-10 text-center">
          <div className="space-y-4">
             <Heart className="mx-auto text-rose-500" size={32} />
             <p className="font-playfair italic text-xl text-slate-600 leading-relaxed max-w-md mx-auto">
                "{invitation.message}"
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
             <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Calendar size={24} />
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-1">Data & Hora</h4>
                   <p className="font-semibold text-slate-500">{invitation.date}</p>
                   <p className="font-semibold text-slate-500">{invitation.time}</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                    <MapPin size={24} />
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-1">Localização</h4>
                   <p className="font-semibold text-slate-500 leading-tight">{invitation.location}</p>
                </div>
             </div>
          </div>

          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 mx-auto hover:bg-purple-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
             <MapPin size={18} /> Ver no Mapa
          </button>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="bg-purple-600 p-12 rounded-[3.5rem] shadow-2xl shadow-purple-600/30 text-white text-center">
            <h2 className="text-3xl font-playfair font-bold mb-4">Confirmar Presença</h2>
            <p className="opacity-80 mb-10 text-sm max-w-xs mx-auto">Sua presença é fundamental para tornar este dia ainda mais especial.</p>
            
            {!rsvpSent ? (
               <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setRsvpSent(true); }}>
                  <input type="text" placeholder="Seu Nome Completo" required className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 outline-none focus:bg-white/20 transition-all placeholder:text-white/50 font-semibold" />
                  <button className="w-full bg-white text-purple-600 font-bold py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Confirmar Agora
                  </button>
               </form>
            ) : (
               <div className="bg-white/10 p-10 rounded-3xl flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-bold">Confirmado!</h3>
                  <p className="text-sm opacity-80">Obrigado por confirmar sua presença.</p>
               </div>
            )}
        </section>

        {/* Share Button (Sticky Bottom) */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40 bg-white/80 backdrop-blur-xl border border-slate-100 px-8 py-4 rounded-3xl shadow-2xl">
           <button className="flex items-center gap-2 font-bold text-slate-800 text-sm hover:text-purple-600 transition-colors">
              <Share2 size={18} className="text-purple-600" /> Compartilhar
           </button>
           <div className="w-[1px] h-6 bg-slate-200"></div>
           <button className="flex items-center gap-2 font-bold text-slate-800 text-sm hover:text-purple-600 transition-colors">
              <Plus size={18} className="text-indigo-600" /> Salvar Evento
           </button>
        </div>
      </main>
    </div>
  );
}
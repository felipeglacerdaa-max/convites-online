'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, MapPin, Calendar, Clock, Video, Heart, Share2, Check, Plus, Loader2, Sparkles, MailOpen } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function PublicInvitationContent({ invitation }: { invitation: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Set volume once audio element is rendered with a smooth fade-in
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.volume = 0;
      let vol = 0;
      const targetVol = 0.1; // Lowered to 10%
      const fadeInterval = setInterval(() => {
        vol += 0.01;
        if (vol >= targetVol) {
          audioRef.current!.volume = targetVol;
          clearInterval(fadeInterval);
        } else {
          audioRef.current!.volume = vol;
        }
      }, 150);
      return () => clearInterval(fadeInterval);
    }
  }, [isPlaying]);

  // Handle YouTube Volume via API
  useEffect(() => {
    if (isPlaying && (invitation.musicUrl.includes('youtube.com') || invitation.musicUrl.includes('youtu.be'))) {
      const checkAndSetVolume = () => {
        if (window.YT && window.YT.Player) {
          const iframe = document.getElementById('youtube-bg-music') as HTMLIFrameElement;
          if (iframe && !ytPlayerRef.current) {
            ytPlayerRef.current = new window.YT.Player('youtube-bg-music', {
              events: {
                'onReady': (event: any) => {
                  event.target.setVolume(15); // 15% for YouTube
                  event.target.playVideo();
                }
              }
            });
          } else if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
            ytPlayerRef.current.setVolume(15);
          }
        } else {
          setTimeout(checkAndSetVolume, 500);
        }
      };
      checkAndSetVolume();
    }
  }, [isPlaying, invitation.musicUrl]);

  const handleEnter = () => {
    setHasEntered(true);
    setIsPlaying(true);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1` : url;
  };

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
    <>
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 transition-opacity duration-1000 ${hasEntered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
         <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm" style={{ backgroundImage: invitation.imageUrl ? `url(${invitation.imageUrl})` : 'none' }}></div>
         <div className="absolute inset-0 bg-black/40"></div>
         <div className={`relative z-10 flex flex-col items-center transition-all duration-700 delay-300 transform ${isVisible && !hasEntered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <MailOpen className="text-white/90 w-16 h-16 mb-6 animate-bounce" strokeWidth={1} />
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4 text-center px-4 leading-tight">{invitation.title}</h2>
            <p className="text-white/70 text-sm uppercase tracking-[0.3em] mb-12 text-center px-4 font-medium hover:text-white transition-colors">Você tem um convite especial</p>
            <button 
              onClick={handleEnter}
              className="bg-white/10 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md px-12 py-5 rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center gap-3"
            >
              Abrir Convite
            </button>
         </div>
      </div>

      <div className={`min-h-screen text-slate-800 font-sans selection:bg-rose-100 overflow-x-hidden pb-20 relative transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        {invitation.backgroundType === 'video' && (invitation.backgroundLocal || invitation.backgroundUrl) ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
             {/* If it's a youtube link, we need an iframe. If it's a direct link or base64, we use <video> */}
             {(invitation.backgroundLocal || invitation.backgroundUrl).includes('youtube.com') || (invitation.backgroundLocal || invitation.backgroundUrl).includes('youtu.be') ? (
               <iframe
                 className="absolute top-1/2 left-1/2 w-[110vw] h-[110vh] -translate-x-1/2 -translate-y-1/2 object-cover"
                 src={`${(invitation.backgroundLocal || invitation.backgroundUrl).replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&playlist=${(invitation.backgroundLocal || invitation.backgroundUrl).split('v=')[1]}&controls=0&showinfo=0&rel=0`}
                 allow="autoplay; encrypted-media"
               />
             ) : (
               <video
                 autoPlay
                 muted
                 loop
                 playsInline
                 className="absolute min-w-full min-h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
               >
                 <source src={invitation.backgroundLocal || invitation.backgroundUrl} />
               </video>
             )}
             <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
          </div>
        ) : invitation.backgroundUrl || invitation.backgroundLocal ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom"
            style={{ backgroundImage: `url(${invitation.backgroundLocal || invitation.backgroundUrl})` }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#faf9f6]">
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-paper.png')` }}>
            </div>
          </div>
        )}
      </div>

      <main className={`relative z-10 max-w-[360px] md:max-w-lg mx-auto px-4 py-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Floating Music Button (Refined & Premium) */}
        {invitation.musicUrl && (
          <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end gap-3 group">
            <button 
              onClick={toggleMusic}
              className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-500 backdrop-blur-xl border border-white/40 ${isPlaying ? 'bg-rose-500/90 text-white ring-4 ring-rose-500/20' : 'bg-white/80 text-slate-500'}`}
            >
              <div className="flex gap-1 items-end h-3 w-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`w-0.5 bg-current rounded-full transition-all duration-300 ${isPlaying ? `animate-music-bar-${i}` : 'h-1 opacity-30'}`}
                  />
                ))}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] leading-none opacity-80">
                {isPlaying ? 'Música Tocando' : 'Música Pausada'}
              </span>
              <div className={`p-1.5 rounded-full transition-colors ${isPlaying ? 'bg-white/20' : 'bg-slate-100'}`}>
                <Music size={14} className={isPlaying ? 'animate-spin-slow' : ''} />
              </div>
            </button>
            
            {/* Audio Element or YouTube Hidden Iframe */}
            {isPlaying && (
              <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none opacity-0">
                 {invitation.musicUrl.includes('youtube.com') || invitation.musicUrl.includes('youtu.be') ? (
                   <iframe
                     id="youtube-bg-music"
                     width="10"
                     height="10"
                     src={getYouTubeEmbedUrl(invitation.musicUrl)}
                     allow="autoplay; encrypted-media"
                   />
                 ) : (
                   <audio ref={audioRef} autoPlay loop>
                     <source src={invitation.musicUrl} />
                   </audio>
                 )}
              </div>
            )}
          </div>
        )}

        {/* Invitation Card Container (Ultra-Minimalist Glass) */}
        <div className="bg-white/15 backdrop-blur-3xl p-0.5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white/20 relative overflow-hidden">
          
          {/* Main Content Area */}
          <div className="rounded-[2.3rem] p-6 md:p-10 relative">
            
            {/* Header / Hero */}
            <header className="text-center space-y-6 mb-12">
               <div className="flex justify-center mb-4">
                  <div className="w-16 h-1px bg-rose-200 self-center"></div>
                  <Sparkles className="mx-4 text-rose-300" size={24} />
                  <div className="w-16 h-1px bg-rose-200 self-center"></div>
               </div>
               
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.6em] text-rose-500/80 font-bold">Convite Especial</p>
                  <h1 className="text-3xl md:text-5xl font-playfair font-bold text-slate-900 leading-tight">
                     {invitation.title}
                  </h1>
                </div>

               {invitation.imageUrl && (
                 <div className="relative mt-8 group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-rose-200 to-indigo-200 rounded-3xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/30">
                       <img 
                         src={invitation.imageUrl} 
                         alt={invitation.title} 
                         className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                       />
                    </div>
                 </div>
               )}
            </header>

            {/* Message */}
            <div className="text-center mb-12 relative">
               <p className="font-playfair italic text-lg text-slate-700/90 leading-relaxed px-2 max-w-[260px] mx-auto">
                  {invitation.message}
               </p>
            </div>

            {/* Details Grid *            <div className="grid grid-cols-1 gap-10 pt-10 border-t border-white/20 mb-10">
               <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center shadow-sm border border-white/30">
                    <Calendar className="text-rose-500/80" size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[9px] uppercase tracking-widest font-bold text-slate-500/70 mb-1">Quando</h4>
                    <p className="font-playfair font-bold text-xl text-slate-800">{invitation.date}</p>
                    <div className="flex items-center justify-center gap-2 text-slate-500/80 font-medium text-xs mt-0.5">
                      <Clock size={12} /> <span>às {invitation.time}</span>
                    </div>
                  </div>
               </div>
 
               <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center shadow-sm border border-white/30">
                    <MapPin className="text-rose-500/80" size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[9px] uppercase tracking-widest font-bold text-slate-500/70 mb-1">Onde</h4>
                    <p className="font-playfair font-bold text-xl text-slate-800 max-w-[220px] leading-tight">
                      {invitation.location}
                    </p>
                  </div>
                  <button className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest mt-2 border-b border-rose-200/50 pb-0.5">
                    Ver no Mapa
                  </button>
               </div>
            </div>
/div>

            {/* Video Preview (If exists) */}
            {invitation.videoUrl && (
              <div className="mb-10">
                <div className="aspect-video rounded-[2rem] overflow-hidden bg-white/10 border border-white/20 shadow-xl">
                   {invitation.videoUrl.includes('youtube.com') || invitation.videoUrl.includes('youtu.be') ? (
                     <iframe
                       className="w-full h-full"
                       src={invitation.videoUrl.replace('watch?v=', 'embed/')}
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                     />
                   ) : (
                     <video controls className="w-full h-full object-cover">
                       <source src={invitation.videoUrl} />
                     </video>
                   )}
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
                          className="w-full bg-white/40 border border-white/50 rounded-2xl p-5 text-center outline-none focus:ring-2 focus:ring-rose-300 transition-all font-semibold text-slate-800 placeholder:text-slate-400 backdrop-blur-sm" 
                        />
                      </div>
                      <button 
                        disabled={loading}
                        className="w-full bg-rose-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-rose-500/20 hover:bg-rose-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px]"
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
               const url = window.location.href;
               if (navigator.share) {
                 navigator.share({ title: invitation.title, text: invitation.message, url }).catch(console.error);
               } else {
                 navigator.clipboard.writeText(url);
                 alert('Link copiado!');
               }
             }}
             className="flex items-center gap-2 font-bold text-slate-500 text-[10px] uppercase tracking-widest hover:text-rose-500 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50"
           >
              <Share2 size={16} /> Compartilhar
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
        
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite ease-in-out;
        }

        /* Music Bars Animation */
        @keyframes music-bar-1 { 0%, 100% { height: 4px; } 50% { height: 12px; } }
        @keyframes music-bar-2 { 0%, 100% { height: 8px; } 50% { height: 4px; } }
        @keyframes music-bar-3 { 0%, 100% { height: 12px; } 50% { height: 6px; } }
        @keyframes music-bar-4 { 0%, 100% { height: 6px; } 50% { height: 10px; } }
        
        .animate-music-bar-1 { animation: music-bar-1 0.8s ease-in-out infinite; }
        .animate-music-bar-2 { animation: music-bar-2 1.0s ease-in-out infinite; }
        .animate-music-bar-3 { animation: music-bar-3 0.6s ease-in-out infinite; }
        .animate-music-bar-4 { animation: music-bar-4 0.9s ease-in-out infinite; }

        /* Hide scrollbar but keep functionality */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
    </>
  );
}


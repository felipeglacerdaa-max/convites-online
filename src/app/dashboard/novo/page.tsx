'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Plus, Music, Film, MapPin, Calendar, Clock, Image as ImageIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NewInvitation() {
  const [formData, setFormData] = useState({
    title: 'Meu Evento Especial',
    date: '2026-06-15',
    time: '19:00',
    location: 'Endereço do Evento',
    message: 'Esperamos você para comemorar conosco esse momento inesquecível!',
    imageUrl: '/assets/img/template_casamento.png',
    videoUrl: '',
    musicUrl: '',
    template: '1'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Form Side */}
      <div className="w-full md:w-[600px] bg-white h-full overflow-y-auto p-8 border-r border-slate-100 custom-scrollbar">
        <div className="max-w-xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors mb-8 font-semibold">
            <ArrowLeft size={18} /> Voltar ao Painel
          </Link>

          <header className="mb-10">
            <div className="flex items-center justify-between">
               <h1 className="text-3xl font-playfair font-bold text-slate-800">Novo Convite</h1>
               <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
                 <Plus size={24} />
               </div>
            </div>
            <p className="text-slate-500 mt-2">Preencha os dados abaixo e veja a mágica acontecer.</p>
          </header>

          <div className="space-y-8">
            {/* Info Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Informações Básicas</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Título do Evento</label>
                  <input name="title" value={formData.title} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Data</label>
                    <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all font-sans" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Hora</label>
                    <input name="time" type="time" value={formData.time} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all font-sans" />
                  </div>
                </div>
                 <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 text-slate-700">Localização</label>
                  <input name="location" value={formData.location} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Mensagem de Boas-vindas</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* Multimedia Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Multimídia & Design</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Music size={16} className="text-purple-600" /> Link da Música (YouTube)
                  </label>
                  <input name="musicUrl" placeholder="https://youtube.com/..." value={formData.musicUrl} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Film size={16} className="text-indigo-600" /> Link do Vídeo (YouTube)
                  </label>
                  <input name="videoUrl" placeholder="https://youtube.com/..." value={formData.videoUrl} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <ImageIcon size={16} className="text-rose-600" /> Imagem de Capa (URL por enquanto)
                  </label>
                  <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all" />
                </div>
              </div>
            </div>

            <button className="w-full bg-purple-600 text-white font-bold py-5 rounded-[2rem] shadow-2xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <Save size={20} /> Salvar e Gerar Link
            </button>
          </div>
        </div>
      </div>

      {/* Preview Side */}
      <div className="flex-1 bg-slate-100 hidden md:flex flex-col items-center justify-center p-12 overflow-hidden relative">
        <div className="absolute top-10 left-10 flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
          <Sparkles size={14} className="text-purple-600" /> Prévia em Tempo Real
        </div>

        {/* Smartphone Mockup */}
        <div className="w-[340px] h-[700px] bg-slate-800 rounded-[3.5rem] p-3 border-[10px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative z-10 transition-all duration-500 scale-90 lg:scale-100">
          <div className="w-full h-full bg-white rounded-[2.8rem] overflow-y-auto no-scrollbar relative">
             {/* Content of the Invitation Preview */}
             <div className="relative h-64 w-full">
                <img src={formData.imageUrl || '/assets/img/template_casamento.png'} alt="Capa" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-2xl font-playfair font-bold">{formData.title}</h4>
                </div>
             </div>

             <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} />
                    </div>
                    <span className="font-bold text-sm tracking-tight">{formData.date} às {formData.time}</span>
                  </div>
                   <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <span className="font-bold text-sm tracking-tight">{formData.location}</span>
                  </div>
                </div>

                <div className="py-6 border-y border-slate-100">
                  <p className="text-center font-playfair italic text-slate-500 leading-relaxed">
                    "{formData.message}"
                  </p>
                </div>

                {formData.videoUrl && (
                  <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                     <span className="text-xs text-slate-400 font-bold">VÍDEO CARREGADO</span>
                  </div>
                )}

                <div className="pt-6">
                   <button className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl text-center text-xs tracking-widest uppercase">Confirmar Presença</button>
                </div>
             </div>

             {/* Music Player Mockup Mini */}
             {formData.musicUrl && (
               <div className="sticky bottom-4 mx-4 bg-white/90 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
                 <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center animate-spin-slow">
                   <Music size={18} className="text-white" />
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Tocando Agora</div>
                   <div className="text-xs font-bold text-slate-800 truncate">Música do Evento</div>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-[-50px] w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 left-[-50px] w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}

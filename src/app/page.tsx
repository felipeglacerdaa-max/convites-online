import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Music, Camera, Heart, ChevronRight } from 'lucide-react';

export default function Home() {
  const templates = [
    { id: '1', name: 'Elegance Wedding', category: 'Casamento', img: '/assets/img/template_casamento.png', desc: 'Minimalista e sofisticado.' },
    { id: '2', name: 'Celebration Party', category: 'Aniversário', img: '/assets/img/template_aniversario.png', desc: 'Vibrante e moderno.' },
    { id: '3', name: 'Angelic Baptism', category: 'Batizado', img: '/assets/img/template_batizado.png', desc: 'Suave e celestial.' },
    { id: '4', name: 'Victory Graduation', category: 'Formatura', img: '/assets/img/template_formatura.png', desc: 'Acadêmico e prestigioso.' },
    { id: '5', name: 'Princess Debut', category: '15 Anos', img: '/assets/img/template_15anos.png', desc: 'Luxuoso e rosa gold.' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="font-bold text-xl tracking-tight">Delicatta</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#templates" className="text-slate-600 hover:text-purple-600 transition-colors font-medium">Modelos</a>
            <a href="#funciona" className="text-slate-600 hover:text-purple-600 transition-colors font-medium">Como Funciona</a>
            <a href="/login" className="text-slate-900 font-semibold border-2 border-purple-600 px-6 py-2 rounded-full hover:bg-purple-600 hover:text-white transition-all">Entrar</a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 overflow-hidden bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.05),transparent_50%)]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-16">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h1 className="text-5xl md:text-7xl font-playfair font-bold leading-tight text-slate-800">
                Encante convidados com <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">convites premium.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                Adicione músicas, vídeos e fotos aos seus convites digitais. Compartilhe um link seguro em segundos e impressione a todos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#templates" className="bg-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-purple-600/20 hover:scale-105 transition-all">
                  Ver Modelos
                </Link>
                <Link href="/login" className="bg-slate-100 text-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition-all">
                  Começar Agora
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="w-[280px] h-[580px] bg-slate-900 rounded-[3rem] p-3 border-8 border-slate-800 shadow-2xl relative z-10 overflow-hidden">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                   <img src="/assets/img/template_casamento.png" alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
              
              {/* Floating Icons */}
              <div className="absolute top-10 -right-4 bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-[3s] z-20">
                <Music className="text-purple-600 w-6 h-6" />
              </div>
              <div className="absolute middle-0 -left-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-[4s] z-20">
                <Camera className="text-indigo-600 w-6 h-6" />
              </div>
              <div className="absolute bottom-20 -right-8 bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-[3.5s] z-20">
                <Heart className="text-rose-500 w-6 h-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section id="templates" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-playfair font-bold text-slate-800">Escolha o seu Modelo</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Designs exclusivos para cada momento especial da sua vida.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((tpl) => (
              <div key={tpl.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="relative h-96 overflow-hidden">
                  <img src={tpl.img} alt={tpl.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all">
                      Visualizar
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2 block">{tpl.category}</span>
                  <h3 className="text-xl font-bold mb-1">{tpl.name}</h3>
                  <p className="text-slate-500 text-sm mb-6">{tpl.desc}</p>
                  <Link href="/login" className="w-full bg-slate-50 group-hover:bg-purple-600 group-hover:text-white text-slate-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                    Entrar para criar <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-4 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold">Designs Únicos</h3>
              <p className="text-slate-500">Modelos modernos e 100% responsivos para qualquer dispositivo.</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-4 text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Music size={32} />
              </div>
              <h3 className="text-2xl font-bold">Multimídia</h3>
              <p className="text-slate-500">Integração com YouTube para vídeos e músicas de fundo.</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-4 text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ChevronRight size={32} />
              </div>
              <h3 className="text-2xl font-bold">Seguro & Privado</h3>
              <p className="text-slate-500">Links únicos encurtados com proteção opcional por senha.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-bold text-xl">Delicatta</div>
          <p className="text-slate-400 text-sm">© 2026 Delicatta. Criado com ❤️ para momentos especiais.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

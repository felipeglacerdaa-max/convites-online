'use client';
export const dynamic = 'force-dynamic';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function OrcamentoContent() {
  const whatsappMessage = `Olá! Gostaria de solicitar um orçamento para um convite digital personalizado.`;
  const whatsappLink = `https://wa.me/5531997364681?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-green-500/5 p-10 space-y-8 border border-white">
        <div className="text-center">
           <div className="flex items-center justify-center gap-2 mb-4">
             <span className="text-3xl">✨</span>
             <span className="font-bold text-2xl">Delicatta</span>
          </div>
          <h2 className="text-3xl font-playfair font-bold text-slate-800">Solicite seu Orçamento</h2>
          <p className="text-slate-500 mt-2">Converse conosco via WhatsApp e crie o convite dos seus sonhos.</p>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-semibold text-slate-800">Convites Personalizados</p>
              <p className="text-sm text-slate-600">Designs únicos com seus temas especiais</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎵</span>
            <div>
              <p className="font-semibold text-slate-800">Multimídia Integrada</p>
              <p className="text-sm text-slate-600">Música, vídeo e fotos em um só lugar</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔗</span>
            <div>
              <p className="font-semibold text-slate-800">Compartilhamento Seguro</p>
              <p className="text-sm text-slate-600">Links únicos com proteção opcional</p>
            </div>
          </div>
        </div>

        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          Orçamento via WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function Orcamento() {
  return (
    <Suspense fallback={null}>
      <OrcamentoContent />
    </Suspense>
  );
}

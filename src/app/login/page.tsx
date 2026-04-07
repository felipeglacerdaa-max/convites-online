import { Mail, Lock, Music } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-purple-600/5 p-10 space-y-8 border border-white">
        <div className="text-center">
           <div className="flex items-center justify-center gap-2 mb-4">
             <span className="text-3xl">✨</span>
             <span className="font-bold text-2xl">Convite<span className="text-purple-600">Online</span></span>
          </div>
          <h2 className="text-3xl font-playfair font-bold text-slate-800">Bem-vindo de volta</h2>
          <p className="text-slate-500 mt-2">Acesse seu painel para gerenciar seus convites.</p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                placeholder="seu@email.com" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-slate-700">Senha</label>
              <a href="#" className="text-xs text-purple-600 font-bold hover:underline">Esqueci a senha</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <button className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Entrar
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm">
          Ainda não tem conta? <Link href="/register" className="text-purple-600 font-bold hover:underline">Crie agora grátis</Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Music,
  Film,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

type FormState = {
  title: string;
  date: string;
  time: string;
  location: string;
  message: string;
  imageUrl: string;
  imageLocal: string;
  videoUrl: string;
  musicUrl: string;
  backgroundUrl: string;
  backgroundLocal: string;
  backgroundType: 'image' | 'video';
  adminEmail: string;
  adminPassword: string;
  template: string;
};

type CreateInvitationResponse = {
  message?: string;
  code?: string;
  adminCode?: string;
  adminEmail?: string;
};

export default function NewInvitation() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdCode, setCreatedCode] = useState('');
  const [createdAdminCode, setCreatedAdminCode] = useState('');
  const [createdAdminEmail, setCreatedAdminEmail] = useState('');
  const [formData, setFormData] = useState<FormState>({
    title: 'Meu Evento Especial',
    date: '2026-06-15',
    time: '19:00',
    location: 'Endereço do Evento',
    message: 'Esperamos você para comemorar conosco esse momento inesquecível!',
    imageUrl: '',
    imageLocal: '',
    videoUrl: '',
    musicUrl: '',
    backgroundUrl: '',
    backgroundLocal: '',
    backgroundType: 'image',
    adminEmail: '',
    adminPassword: '',
    template: '1',
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setLoadingAuth(false);
    };

    void checkUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'imageLocal' | 'backgroundLocal') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImage(file);
      setFormData((current) => ({ ...current, [type]: compressedBase64 }));
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setError('Erro ao processar imagem. Tente uma foto menor ou outro formato.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = (await res.json()) as CreateInvitationResponse;

      if (!res.ok) {
        setError(data.message || 'Erro ao criar convite.');
        return;
      }

      setCreatedCode(data.code ?? '');
      setCreatedAdminCode(data.adminCode ?? '');
      setCreatedAdminEmail(data.adminEmail ?? '');
      setSuccess(true);
    } catch {
      setError('Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row h-screen overflow-hidden relative">
      {success && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles size={40} />
            </div>
            <h2 className="text-3xl font-playfair font-bold text-slate-900">Convite Criado!</h2>
            <p className="text-slate-500">Seu convite já está online e pronto para ser compartilhado.</p>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Link Público (para compartilhar)</p>
                <code className="text-sm font-bold text-purple-600 break-all bg-white px-3 py-2 rounded-lg border border-slate-200 block w-full mt-1">
                  {typeof window !== 'undefined' ? `${window.location.origin}/convite/${createdCode}` : ''}
                </code>
              </div>

              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-left space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-400">Link Administrativo (para o cliente)</p>
                <code className="text-sm font-bold text-indigo-600 break-all bg-white px-3 py-2 rounded-lg border border-indigo-200 block w-full mt-1">
                  {typeof window !== 'undefined' ? `${window.location.origin}/gerenciar/${createdAdminCode}` : ''}
                </code>
                <div className="text-[10px] text-slate-500 mt-2 p-2 bg-white/50 rounded-lg">
                  <p><strong>E-mail:</strong> {createdAdminEmail}</p>
                  <p><strong>Senha:</strong> A que você definiu no formulário</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <Link href="/dashboard" className="py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all text-center text-sm">
                Voltar ao Painel
              </Link>
              <Link href={`/convite/${createdCode}`} className="py-4 bg-purple-100 text-purple-700 rounded-2xl font-bold hover:bg-purple-200 transition-all text-center text-sm">
                Ver Convite
              </Link>
              <Link href={`/gerenciar/${createdAdminCode}`} className="py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all text-center text-sm shadow-lg shadow-purple-600/30">
                Gerenciar Agora
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="w-full md:w-[600px] bg-white h-full overflow-y-auto p-8 border-r border-slate-100">
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
            <p className="text-slate-500 mt-2">Preencha os dados abaixo e veja a prévia em tempo real.</p>
          </header>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium border border-rose-100 mb-8">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Informações Básicas</h3>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Título do Evento</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Data</label>
                  <input name="date" type="date" value={formData.date} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all font-sans" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Hora</label>
                  <input name="time" type="time" value={formData.time} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all font-sans" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Localização</label>
                <input name="location" value={formData.location} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Mensagem</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all resize-none" />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <ImageIcon size={16} className="text-rose-600" /> Imagem de Capa
                </label>
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-3">
                    <input name="imageUrl" placeholder="Link da imagem (opcional)" value={formData.imageUrl} onChange={handleChange} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 transition-all text-sm" />
                    <span className="text-slate-300 font-bold uppercase text-[10px]">ou</span>
                    <label className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold">
                      <Plus size={14} /> Local
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'imageLocal')} className="hidden" />
                    </label>
                   </div>
                   {(formData.imageLocal || formData.imageUrl) && (
                     <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                        <img src={formData.imageLocal || formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                   )}
                </div>
              </div>

              {/* ... other fields ... */}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Music size={16} className="text-purple-600" /> Música de Fundo
                </label>
                <input name="musicUrl" placeholder="Link do YouTube ou arquivo de áudio" value={formData.musicUrl} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all text-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Film size={16} className="text-indigo-600" /> Vídeo Principal
                </label>
                <input name="videoUrl" placeholder="Link do YouTube" value={formData.videoUrl} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all text-sm" />
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-600" /> Fundo Animado
                  </label>
                  <p className="text-xs text-slate-500 mt-1">Deixe seu convite mais elegante com um fundo único</p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
                  <label className="relative">
                    <input type="radio" name="backgroundType" value="image" checked={formData.backgroundType === 'image'} onChange={handleChange} className="sr-only" />
                    <div className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${formData.backgroundType === 'image' ? 'border-purple-600 bg-purple-50 shadow-md' : 'border-slate-200 bg-white hover:border-purple-300'}`}>
                      <ImageIcon size={18} className="mx-auto mb-1 text-purple-600" />
                      <p className="text-xs font-semibold text-slate-700">Imagem</p>
                    </div>
                  </label>
                  <label className="relative">
                    <input type="radio" name="backgroundType" value="video" checked={formData.backgroundType === 'video'} onChange={handleChange} className="sr-only" />
                    <div className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${formData.backgroundType === 'video' ? 'border-purple-600 bg-purple-50 shadow-md' : 'border-slate-200 bg-white hover:border-purple-300'}`}>
                      <Film size={18} className="mx-auto mb-1 text-indigo-600" />
                      <p className="text-xs font-semibold text-slate-700">Vídeo</p>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      name="backgroundUrl"
                      placeholder={formData.backgroundType === 'image' ? 'Link da imagem' : 'Link do YouTube'}
                      value={formData.backgroundUrl}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 transition-all text-sm"
                    />
                    <span className="text-slate-300 font-bold uppercase text-[10px]">ou</span>
                    <label className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 text-xs font-bold">
                      <Plus size={14} /> Local
                      <input type="file" accept={formData.backgroundType === 'image' ? 'image/*' : 'video/*'} onChange={(e) => handleImageUpload(e, 'backgroundLocal')} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Acesso Administrativo</h3>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">E-mail administrativo</label>
                  <input name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Senha administrativa</label>
                  <input name="adminPassword" type="password" value={formData.adminPassword} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-bold py-5 rounded-[2rem] shadow-2xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Salvando...' : 'Salvar e Gerar Link'}
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 bg-slate-100 hidden md:flex flex-col items-center justify-center p-12 overflow-hidden relative">
        <div className="absolute top-10 left-10 flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
          <Sparkles size={14} className="text-purple-600" /> Prévia em Tempo Real
        </div>

        <div className="w-[340px] h-[700px] bg-slate-800 rounded-[3.5rem] p-3 border-[10px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden">
          <div
            className="w-full h-full bg-white rounded-[2.8rem] overflow-y-auto no-scrollbar relative"
            style={{
              backgroundImage: formData.backgroundLocal
                ? `url(${formData.backgroundLocal})`
                : formData.backgroundUrl
                  ? `url(${formData.backgroundUrl})`
                  : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {(formData.backgroundLocal || formData.backgroundUrl) && (
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/40" />
            )}

            <div className="relative h-64 w-full z-10">
              <img
                src={formData.imageLocal || formData.imageUrl || '/assets/img/template_casamento.png'}
                alt="Capa"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-2xl font-playfair font-bold">{formData.title}</h4>
              </div>
            </div>

            <div className="p-8 space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-600 bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{formData.date} às {formData.time}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{formData.location}</span>
                </div>
              </div>

              <div className="py-6 border-y border-slate-100/50 bg-white/80 backdrop-blur-sm rounded-xl px-4">
                <p className="text-center font-playfair italic text-slate-600 leading-relaxed">
                  &quot;{formData.message}&quot;
                </p>
              </div>

              <div className="pt-6">
                <button type="button" className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl text-center text-xs tracking-widest uppercase shadow-lg shadow-purple-600/50">
                  Confirmar Presença
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 right-[-50px] w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 left-[-50px] w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}

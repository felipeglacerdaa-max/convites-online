import { ArrowLeft, Users, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export default async function PresencaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;
    const isAdmin = user?.email === 'contato@felipelacerda.com' || user?.email?.includes('admin');

    if (error || !user || !isAdmin) {
      redirect('/dashboard');
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        rsvps: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        user: true,
      },
    });

    if (!invitation) {
      redirect('/dashboard/admin');
    }

    const confirmedCount = invitation.rsvps.filter((rsvp) => rsvp.confirmed).length;
    const totalCount = invitation.rsvps.length;

    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <Link href="/dashboard/admin" className="flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors mb-8 font-semibold">
          <ArrowLeft size={18} /> Voltar para Administração
        </Link>

        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-playfair font-bold text-slate-800 mb-2">{invitation.title}</h1>
            <p className="text-slate-500">Lista de presença e confirmações</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 text-sm font-medium">Total de confirmações</p>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{totalCount}</h3>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 text-sm font-medium">Confirmados</p>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{confirmedCount}</h3>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 text-sm font-medium">Taxa de confirmação</p>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">
                {totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0}%
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Confirmações</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome</th>
                    <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Data de confirmação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invitation.rsvps.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-400">
                        Nenhuma confirmação ainda.
                      </td>
                    </tr>
                  ) : (
                    invitation.rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-8">
                          <div className="font-bold text-slate-700">{rsvp.name}</div>
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-2">
                            {rsvp.confirmed ? (
                              <>
                                <CheckCircle size={18} className="text-green-500" />
                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                                  Confirmado
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle size={18} className="text-slate-300" />
                                <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold">
                                  Pendente
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-8 text-slate-400 text-sm">
                          {new Date(rsvp.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar lista de presença:', error);
    redirect('/dashboard/admin');
  }
}

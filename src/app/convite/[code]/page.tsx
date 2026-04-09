import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PublicInvitationContent from './PublicInvitationContent';

export default async function PublicInvitationPage({ params }: { params: { code: string } }) {
  const code = params.code;

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { code },
      include: {
        rsvps: true
      }
    });

    if (!invitation) {
      notFound();
    }

    return <PublicInvitationContent invitation={invitation} />;
  } catch (error: any) {
    console.error('Error fetching invitation:', error);
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Erro ao Carregar Convite</h2>
          <p className="text-slate-600 mb-6">Não conseguimos conectar ao banco de dados ou encontrar o convite solicitado.</p>
          <div className="bg-rose-50 p-4 rounded-xl text-xs text-rose-600 font-mono text-left overflow-auto mb-6 max-h-40">
            {error.message || 'Erro desconhecido'}
          </div>
          <a href="/" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-bold">
            Voltar para Home
          </a>
        </div>
      </div>
    );
  }
}

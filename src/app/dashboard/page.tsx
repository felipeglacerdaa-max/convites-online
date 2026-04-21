import { Plus, Calendar, MapPin, MoreVertical, Search, Filter, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { DashboardInvitationGrid } from '@/components/DashboardInvitationGrid';

export default async function Dashboard() {
  console.log('Dashboard: Initializing...');
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  console.log('Dashboard: User:', user?.email);

  let invitations: Array<any> = [];
  let totalRsvps = 0;
  let dashboardError: string | null = null;

  try {
    invitations = await prisma.invitation.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    totalRsvps = await prisma.rSVP.count({
      where: {
        invitation: {
          userId: user?.id,
        },
        confirmed: true,
      },
    });
  } catch (error: any) {
    console.error('Dashboard data fetch failed:', error);
    dashboardError = error?.message || 'Erro ao carregar os dados do painel.';
  }

  if (dashboardError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">Não foi possível carregar o painel</h1>
          <p className="text-slate-600 mb-6 text-center">
            Verifique se o banco de dados está configurado corretamente no Vercel.
          </p>
          <div className="bg-rose-50 p-6 rounded-2xl mb-8 border border-rose-100">
             <h4 className="text-rose-600 font-bold text-sm uppercase mb-2">Detalhes do Erro:</h4>
             <p className="text-xs text-rose-500 font-mono break-all">{dashboardError}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all">
              Voltar para a home
            </Link>
            <button onClick={() => window.location.reload()} className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all">
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userEmail = user?.email || '';

  return (
    <DashboardInvitationGrid 
      invitations={invitations}
      totalRsvps={totalRsvps}
      userEmail={userEmail}
    />
  );
}

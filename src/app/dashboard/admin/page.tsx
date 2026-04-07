import { Users, FileText, Settings, ExternalLink, Copy, Trash2, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
  let invitations: any[] = [];
  let stats = { totalUsers: 0, totalInvitations: 0, totalRsvps: 0, confirmationRate: 0 };

  try {
    console.log('AdminPage: Fetching invitations...');
    // Fetch all invitations
    invitations = await prisma.invitation.findMany({
      include: {
        user: true,
        rsvps: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log(`AdminPage: Fetched ${invitations.length} invitations.`);

    console.log('AdminPage: Fetching stats...');
    // Calculate stats
    const totalUsers = await prisma.user.count();
    const totalRsvps = await prisma.rSVP.count();
    const confirmedRsvps = await prisma.rSVP.count({
      where: { confirmed: true },
    });
    console.log('AdminPage: Stats fetched.');

    stats = {
      totalUsers,
      totalInvitations: invitations.length,
      totalRsvps,
      confirmationRate: totalRsvps > 0 ? Math.round((confirmedRsvps / totalRsvps) * 100) : 0,
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
  }

  return (
    <div className="p-6 md:p-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-slate-800">Administração</h1>
          <p className="text-slate-500">Visão geral de todos os usuários e convites da plataforma.</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-sm font-medium">Total de Usuários</p>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.totalUsers}</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-sm font-medium">Total de Convites</p>
            <FileText className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.totalInvitations}</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-sm font-medium">Total de RSVPs</p>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.totalRsvps}</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-sm font-medium">Taxa de Confirmação</p>
            <Settings className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.confirmationRate}%</h3>
        </div>
      </div>

      {/* Lists Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">Gerenciar Todos os Convites</h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar por título ou email..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              />
            </div>
            <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-100">
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Título</th>
                <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Template</th>
                <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">RSVPs</th>
                <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Nenhum convite encontrado.</td>
                </tr>
              ) : (
                invitations.map((invite: any) => (
                  <tr key={invite.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-8">
                      <div className="font-bold text-slate-700">{invite.title}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{invite.code}</div>
                    </td>
                    <td className="py-4 px-8 text-slate-500 text-sm">
                      {invite.user?.email || 'N/A'}
                    </td>
                    <td className="py-4 px-8">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                        Template {invite.template}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-slate-600 font-medium">
                      {invite.rsvps.length}
                    </td>
                    <td className="py-4 px-8 text-slate-400 text-sm">
                      {new Date(invite.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex gap-1">
                        <Link
                          href={`/convite/${invite.code}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

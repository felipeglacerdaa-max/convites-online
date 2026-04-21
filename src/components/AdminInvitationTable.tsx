'use client';

import { Users, FileText, Settings, ExternalLink, Copy, Trash2, Search, Filter, Edit, Users as UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { useState } from 'react';

type AdminInvitation = Prisma.InvitationGetPayload<{
  include: {
    user: true;
    rsvps: true;
  };
}>;

interface AdminInvitationTableProps {
  initialInvitations: AdminInvitation[];
  stats: {
    totalUsers: number;
    totalInvitations: number;
    totalRsvps: number;
    confirmationRate: number;
  };
}

export function AdminInvitationTable({ initialInvitations, stats }: AdminInvitationTableProps) {
  const [invitations, setInvitations] = useState<AdminInvitation[]>(initialInvitations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (invitationId: string, invitationTitle: string) => {
    if (!confirm(`Tem certeza que deseja deletar o convite "${invitationTitle}"?`)) {
      return;
    }

    setIsDeleting(invitationId);

    try {
      const response = await fetch(`/api/invitation?id=${invitationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Erro ao deletar: ${error.message}`);
        setIsDeleting(null);
        return;
      }

      // Remove from local state
      setInvitations(prevInvitations => 
        prevInvitations.filter(inv => inv.id !== invitationId)
      );
      
      // Update stats
      alert('Convite deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar convite:', error);
      alert('Erro ao deletar convite. Tente novamente.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Código copiado: ${code}`);
  };

  const filteredInvitations = invitations.filter(invite =>
    invite.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invite.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <p className="text-slate-500 text-sm font-medium">Total de CONFIRMAÇÃO</p>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">CONFIRMAÇÕES</th>
                <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                <th className="py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvitations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {invitations.length === 0 ? 'Nenhum convite encontrado.' : 'Nenhum convite corresponde à busca.'}
                  </td>
                </tr>
              ) : (
                filteredInvitations.map((invite) => (
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
                      <div className="flex gap-2 flex-wrap">
                        <Link
                          href={`/convite/${invite.code}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          title="Visualizar convite"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link
                          href={`/dashboard/editar/${invite.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Editar convite"
                        >
                          <Edit size={18} />
                        </Link>
                        <Link
                          href={`/gerenciar/${invite.adminCode}`}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Administrar (Acesso do Cliente)"
                        >
                          <ShieldCheck size={18} />
                        </Link>
                        <button
                          onClick={() => handleCopyCode(invite.code)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Copiar código do convite"
                        >
                          <Copy size={18} />
                        </button>
                        <Link
                          href={`/dashboard/admin/presenca/${invite.id}`}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Lista de presença"
                        >
                          <UserCheck size={18} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(invite.id, invite.title)}
                          disabled={isDeleting === invite.id}
                          className={`p-2 rounded-lg transition-all ${
                            isDeleting === invite.id
                              ? 'text-slate-300 cursor-wait'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                          }`}
                          title="Deletar convite"
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

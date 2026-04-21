import { redirect } from 'next/navigation';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { AdminInvitationTable } from '@/components/AdminInvitationTable';

export const dynamic = 'force-dynamic';

type AdminInvitation = Prisma.InvitationGetPayload<{
  include: {
    user: true;
    rsvps: true;
  };
}>;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  if (error || !user) {
    redirect('/dashboard');
  }

  const invitations: AdminInvitation[] = await prisma.invitation.findMany({
    include: {
      user: true,
      rsvps: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalUsers = await prisma.user.count();
  const totalRsvps = await prisma.rSVP.count();
  const confirmedRsvps = await prisma.rSVP.count({
    where: { confirmed: true },
  });

  const stats = {
    totalUsers,
    totalInvitations: invitations.length,
    totalRsvps,
    confirmationRate: totalRsvps > 0 ? Math.round((confirmedRsvps / totalRsvps) * 100) : 0,
  };

  return <AdminInvitationTable initialInvitations={invitations} stats={stats} />;
}

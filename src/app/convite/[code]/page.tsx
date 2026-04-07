import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PublicInvitationContent from './PublicInvitationContent';

export default async function PublicInvitationPage({ params }: { params: { code: string } }) {
  const code = params.code;

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
}

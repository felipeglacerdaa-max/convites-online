import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, invitationId } = body;

    if (!name || !invitationId) {
      return NextResponse.json({ error: 'Nome e ID do convite são necessários.' }, { status: 400 });
    }

    const rsvp = await prisma.rSVP.create({
      data: {
        name,
        invitationId,
        confirmed: true,
      },
    });

    console.log(`Confirmado RSVP:`, rsvp);

    return NextResponse.json({ success: true, message: 'RSVP confirmado com sucesso!', id: rsvp.id });
  } catch (error: any) {
    console.error("Erro no RSVP:", error);
    return NextResponse.json({ error: 'Erro ao processar RSVP.', message: error.message }, { status: 500 });
  }
}

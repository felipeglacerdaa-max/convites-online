import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, invitationId } = body;

    if (!name || !invitationId) {
      return NextResponse.json({ error: 'Nome e ID do convite são necessários.' }, { status: 400 });
    }

    // Mock DB Store
    console.log(`Confirmado RSVP de ${name} para o convite ${invitationId}`);

    return NextResponse.json({ success: true, message: 'RSVP confirmado com sucesso!' });
  } catch (error) {
     return NextResponse.json({ error: 'Erro ao processar RSVP.' }, { status: 500 });
  }
}

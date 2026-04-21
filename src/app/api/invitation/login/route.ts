import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { adminCode, email, password } = await req.json();

    if (!adminCode || !email || !password) {
      return NextResponse.json({ message: 'Preencha todos os campos.' }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { adminCode },
    });

    if (!invitation) {
      return NextResponse.json({ message: 'Convite não encontrado.' }, { status: 404 });
    }

    if (invitation.adminEmail !== email) {
      return NextResponse.json({ message: 'E-mail ou senha incorretos.' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, invitation.adminPassword);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'E-mail ou senha incorretos.' }, { status: 401 });
    }

    // Success - In a real app we'd set a cookie here. 
    // For this simple case, we'll just return the invitation data with RSVPs.
    const fullInvitation = await prisma.invitation.findUnique({
      where: { id: invitation.id },
      include: {
        rsvps: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(fullInvitation);
  } catch (error) {
    console.error('Erro no login admin cliente:', error);
    return NextResponse.json({ message: 'Erro ao processar login.' }, { status: 500 });
  }
}

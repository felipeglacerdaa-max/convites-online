import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

type InvitationPayload = {
  title: string;
  date: string;
  time: string;
  location: string;
  message: string;
  imageUrl?: string;
  imageLocal?: string;
  videoUrl?: string;
  musicUrl?: string;
  adminEmail: string;
  adminPassword: string;
  template?: string;
  backgroundUrl?: string;
  backgroundLocal?: string;
  backgroundType?: 'image' | 'video';
};

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID não fornecido' }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      return NextResponse.json({ message: 'Convite não encontrado' }, { status: 404 });
    }

    // Only owner or admin can fetch
    const isAdmin = user.email === 'contato@felipelacerda.com' || user.email?.includes('admin');
    if (!isAdmin && invitation.userId !== user.id) {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar convite' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const data = (await req.json()) as InvitationPayload;
    const {
      title,
      date,
      time,
      location,
      message,
      imageUrl,
      imageLocal,
      videoUrl,
      musicUrl,
      backgroundUrl,
      backgroundLocal,
      backgroundType,
      adminEmail,
      adminPassword,
      template,
    } = data;

    if (!title || !date || !time || !location || !message || !adminEmail || !adminPassword) {
      return NextResponse.json({ message: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000).toString();
    const generateAdminCode = () => Math.random().toString(36).substring(2, 12).toUpperCase();

    let code = generateRandomCode();
    let codeExists = await prisma.invitation.findUnique({ where: { code } });

    while (codeExists) {
      code = generateRandomCode();
      codeExists = await prisma.invitation.findUnique({ where: { code } });
    }

    let adminCode = generateAdminCode();
    let adminCodeExists = await prisma.invitation.findUnique({ where: { adminCode } });

    while (adminCodeExists) {
      adminCode = generateAdminCode();
      adminCodeExists = await prisma.invitation.findUnique({ where: { adminCode } });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const invitation = await prisma.invitation.create({
      data: {
        title,
        date,
        time,
        location,
        message,
        imageUrl: imageLocal || imageUrl || null,
        videoUrl: videoUrl || null,
        musicUrl: musicUrl || null,
        backgroundUrl: backgroundLocal || backgroundUrl || null,
        backgroundLocal: backgroundLocal || null,
        backgroundType: backgroundType || 'image',
        template: String(template || '1'),
        code,
        userId: user.id,
        adminEmail,
        adminPassword: hashedPassword,
        adminCode,
      },
    });

    return NextResponse.json({
      message: 'Convite criado!',
      code: invitation.code,
      adminCode: invitation.adminCode,
      adminEmail: invitation.adminEmail,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    console.error('Erro ao criar convite:', error);
    return NextResponse.json({ message: 'Erro ao criar convite.', error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID não fornecido' }, { status: 400 });
    }

    const data = (await req.json()) as InvitationPayload;
    const {
      title, date, time, location, message,
      imageUrl, imageLocal, videoUrl, musicUrl,
      adminEmail, adminPassword, template,
      backgroundUrl, backgroundLocal, backgroundType
    } = data;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      return NextResponse.json({ message: 'Convite não encontrado' }, { status: 404 });
    }

    const isAdmin = user.email === 'contato@felipelacerda.com' || user.email?.includes('admin');
    if (!isAdmin && invitation.userId !== user.id) {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
    }

    const updateData: any = {
      title, date, time, location, message,
      imageUrl: imageLocal || imageUrl || invitation.imageUrl,
      videoUrl: videoUrl || null,
      musicUrl: musicUrl || null,
      backgroundUrl: backgroundLocal || backgroundUrl || invitation.backgroundUrl,
      backgroundLocal: backgroundLocal || invitation.backgroundLocal,
      backgroundType: backgroundType || invitation.backgroundType,
      template: String(template || '1'),
      adminEmail,
    };

    if (adminPassword && adminPassword.length > 0) {
      updateData.adminPassword = await bcrypt.hash(adminPassword, 10);
    }

    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: 'Convite atualizado!', code: updatedInvitation.code });
  } catch (error) {
    console.error('Erro ao atualizar convite:', error);
    return NextResponse.json({ message: 'Erro ao atualizar convite.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const invitationId = searchParams.get('id');

    if (!invitationId) {
      return NextResponse.json({ message: 'ID do convite não fornecido' }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { user: true },
    });

    if (!invitation) {
      return NextResponse.json({ message: 'Convite não encontrado' }, { status: 404 });
    }

    const isAdmin = user.email === 'contato@felipelacerda.com' || user.email?.includes('admin');
    const isOwner = invitation.userId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { message: 'Você não tem permissão para deletar este convite' },
        { status: 403 }
      );
    }

    await prisma.$transaction([
      prisma.rSVP.deleteMany({
        where: { invitationId },
      }),
      prisma.invitation.delete({
        where: { id: invitationId },
      }),
    ]);

    return NextResponse.json({ message: 'Convite deletado com sucesso!' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    console.error('Erro ao deletar convite:', error);
    return NextResponse.json({ message: 'Erro ao deletar convite.', error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    const { title, date, time, location, message, imageUrl, videoUrl, musicUrl, template } = data;

    // Generate a unique random code (6 digits)
    const generateRandomCode = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    let code = generateRandomCode();
    let slugExists = await prisma.invitation.findUnique({ where: { code } });

    while (slugExists) {
      code = generateRandomCode();
      slugExists = await prisma.invitation.findUnique({ where: { code } });
    }

    const invitation = await prisma.invitation.create({
      data: {
        title,
        date,
        time,
        location,
        message,
        imageUrl,
        videoUrl,
        musicUrl,
        template: String(template),
        code,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Convite criado!", code: invitation.code });
  } catch (error: any) {
    console.error("Erro ao criar convite:", error);
    return NextResponse.json({ message: "Erro ao criar convite.", error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    const { title, date, time, location, message, imageUrl, videoUrl, musicUrl, template } = data;

    // Generate a unique code
    const baseCode = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    let code = baseCode || "convite";
    let slugExists = await prisma.invitation.findUnique({ where: { code } });
    let counter = 1;

    while (slugExists) {
      code = `${baseCode}-${counter}`;
      slugExists = await prisma.invitation.findUnique({ where: { code } });
      counter++;
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

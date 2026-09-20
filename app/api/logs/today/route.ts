import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { dailyLogSchema } from "@/lib/validation";
import { getTodayIST } from "@/lib/date";

export async function PUT(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (user.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Only students can modify daily logs" },
      { status: 403 }
    );
  }

  const body = await request.json();

  const result = dailyLogSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.flatten() },
      { status: 400 }
    );
  }

const today = getTodayIST();

  const log = await prisma.dailyLog.upsert({
    where: {
      userId_date: {
        userId: user.userId,
        date: today,
      },
    },
    update: result.data,
    create: {
      userId: user.userId,
      date: today,
      ...result.data,
    },
    include: {
      proofOfWork: true,
    },
  });

  return NextResponse.json({ log });
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const today = getTodayIST();

  const log = await prisma.dailyLog.findUnique({
    where: {
      userId_date: {
        userId: user.userId,
        date: today,
      },
    },
    include: {
      proofOfWork: true,
    },
  });

  return NextResponse.json({ log });
}
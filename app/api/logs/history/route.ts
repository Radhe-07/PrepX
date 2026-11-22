import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const logs = await prisma.dailyLog.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        classAttended: true,
        mathRevision: true,
        mathHomework: true,
        mathDoubt: true,
        physicsRevision: true,
        physicsHomework: true,
        physicsDoubt: true,
        chemistryRevision: true,
        chemistryHomework: true,
        chemistryDoubt: true,
        proofOfWork: {
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            url: true,
            sortOrder: true,
          },
        },
      },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("History API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

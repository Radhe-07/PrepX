import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getTodayIST } from "@/lib/date";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;

type CursorData = { id: string; createdAt: string };

function parseDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : date;
}

function decodeCursor(value: string): CursorData | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.createdAt !== "string" ||
      Number.isNaN(Date.parse(parsed.createdAt))
    ) {
      return null;
    }
    return parsed as CursorData;
  } catch {
    return null;
  }
}

function encodeCursor(cursor: CursorData) {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Your session has expired. Please sign in again." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    if (url.searchParams.get("dates") === "1") {
      const today = getTodayIST();
      const records = await prisma.dailyLog.findMany({
        where: {
          userId: user.userId,
          date: { lte: today },
          proofOfWork: { some: {} },
        },
        orderBy: { date: "desc" },
        select: { date: true },
      });

      return NextResponse.json({
        dates: records.map((record) => record.date.toISOString().slice(0, 10)),
      });
    }

    if (url.searchParams.has("category")) {
      return NextResponse.json(
        { error: "Subject categories are not stored for proof of work" },
        { status: 400 }
      );
    }

    const selectedDate = parseDate(url.searchParams.get("date"));
    if (!selectedDate) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    if (selectedDate > getTodayIST()) {
      return NextResponse.json(
        { error: "Future dates cannot be selected" },
        { status: 400 }
      );
    }

    const limitValue = url.searchParams.get("limit");
    const parsedLimit = limitValue === null ? DEFAULT_LIMIT : Number(limitValue);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      return NextResponse.json({ error: "Invalid page size" }, { status: 400 });
    }
    const limit = Math.min(parsedLimit, MAX_LIMIT);

    const cursorParam = url.searchParams.get("cursor");
    const cursor = cursorParam ? decodeCursor(cursorParam) : null;
    if (cursorParam && !cursor) {
      return NextResponse.json({ error: "Invalid pagination cursor" }, { status: 400 });
    }

    const dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: user.userId,
          date: selectedDate,
        },
      },
      select: {
        date: true,
        ...(cursor ? {} : { _count: { select: { proofOfWork: true } } }),
        proofOfWork: {
          where: cursor
            ? {
                OR: [
                  { createdAt: { lt: new Date(cursor.createdAt) } },
                  {
                    createdAt: new Date(cursor.createdAt),
                    id: { lt: cursor.id },
                  },
                ],
              }
            : undefined,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: limit + 1,
          select: {
            id: true,
            url: true,
            createdAt: true,
          },
        },
      },
    });

    const records = dailyLog?.proofOfWork ?? [];
    const hasMore = records.length > limit;
    const photos = records.slice(0, limit);
    const lastPhoto = photos.at(-1);
    const totalCount = dailyLog && "_count" in dailyLog
      ? dailyLog._count.proofOfWork
      : undefined;

    return NextResponse.json({
      date: url.searchParams.get("date"),
      photos,
      totalCount,
      hasMore,
      nextCursor:
        hasMore && lastPhoto
          ? encodeCursor({
              id: lastPhoto.id,
              createdAt: lastPhoto.createdAt.toISOString(),
            })
          : null,
      canUpload:
        selectedDate.getTime() === getTodayIST().getTime() && dailyLog !== null,
    });
  } catch (error) {
    console.error("POW gallery API error:", error);
    return NextResponse.json(
      { error: "Proof of work could not be loaded. Please try again." },
      { status: 500 }
    );
  }
}

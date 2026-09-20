import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getTodayIST } from "@/lib/date";
import cloudinary from "@/lib/cloudinary";

const MAX_FILES = 15;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can upload proof of work" },
        { status: 403 }
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
    });

    if (!log) {
      return NextResponse.json(
        { error: "Submit today's log before uploading proof of work" },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} photos allowed` },
        { status: 400 }
      );
    }

    const existingCount = await prisma.proofOfWork.count({
      where: {
        dailyLogId: log.id,
      },
    });

    if (existingCount + files.length > MAX_FILES) {
      return NextResponse.json(
        {
          error: `Maximum ${MAX_FILES} photos allowed for today's log`,
        },
        { status: 400 }
      );
    }

    const uploadFile = async (file: File) => {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "prepx/proof-of-work",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Cloudinary upload failed"));
              return;
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );

        uploadStream.end(buffer);
      });
    };

    const uploadedFiles: {
      secure_url: string;
      public_id: string;
    }[] = [];

    const CONCURRENCY = 3;

    for (let i = 0; i < files.length; i += CONCURRENCY) {
      const batch = files.slice(i, i + CONCURRENCY);

      const results = await Promise.all(
        batch.map((file) => uploadFile(file))
      );

      uploadedFiles.push(...results);
    }
    const proofOfWork = await prisma.$transaction(
      uploadedFiles.map((file, index) =>
        prisma.proofOfWork.create({
          data: {
            dailyLogId: log.id,
            url: file.secure_url,
            publicId: file.public_id,
            sortOrder: existingCount + index,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Proof of work uploaded successfully",
      proofOfWork,
    });
  } catch (error) {
    console.error("POW upload error:", error);

    return NextResponse.json(
      { error: "Failed to upload proof of work" },
      { status: 500 }
    );
  }
}
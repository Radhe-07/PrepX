-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "classAttended" BOOLEAN NOT NULL DEFAULT false,
    "mathRevision" BOOLEAN NOT NULL DEFAULT false,
    "mathRevisionNote" TEXT,
    "mathHomework" BOOLEAN NOT NULL DEFAULT false,
    "mathHomeworkNote" TEXT,
    "mathDoubt" BOOLEAN NOT NULL DEFAULT false,
    "mathDoubtNote" TEXT,
    "physicsRevision" BOOLEAN NOT NULL DEFAULT false,
    "physicsRevisionNote" TEXT,
    "physicsHomework" BOOLEAN NOT NULL DEFAULT false,
    "physicsHomeworkNote" TEXT,
    "physicsDoubt" BOOLEAN NOT NULL DEFAULT false,
    "physicsDoubtNote" TEXT,
    "chemistryRevision" BOOLEAN NOT NULL DEFAULT false,
    "chemistryRevisionNote" TEXT,
    "chemistryHomework" BOOLEAN NOT NULL DEFAULT false,
    "chemistryHomeworkNote" TEXT,
    "chemistryDoubt" BOOLEAN NOT NULL DEFAULT false,
    "chemistryDoubtNote" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofOfWork" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProofOfWork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DailyLog_userId_date_idx" ON "DailyLog"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_date_key" ON "DailyLog"("userId", "date");

-- CreateIndex
CREATE INDEX "ProofOfWork_dailyLogId_idx" ON "ProofOfWork"("dailyLogId");

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofOfWork" ADD CONSTRAINT "ProofOfWork_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "DailyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

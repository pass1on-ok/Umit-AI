/*
  Warnings:

  - You are about to drop the column `severity` on the `Symptom` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Symptom` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Symptom` table. All the data in the column will be lost.
  - Made the column `userId` on table `Symptom` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Symptom" DROP COLUMN "severity",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "SymptomValue" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "entryId" INTEGER NOT NULL,

    CONSTRAINT "SymptomValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SymptomValue" ADD CONSTRAINT "SymptomValue_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Symptom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

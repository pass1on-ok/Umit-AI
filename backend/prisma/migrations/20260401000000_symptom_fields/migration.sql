-- AlterTable Symptom: replace type+severity with individual symptom fields
ALTER TABLE "Symptom" DROP COLUMN IF EXISTS "type";
ALTER TABLE "Symptom" DROP COLUMN IF EXISTS "severity";
ALTER TABLE "Symptom" DROP COLUMN IF EXISTS "description";

ALTER TABLE "Symptom" ADD COLUMN "pain"     INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Symptom" ADD COLUMN "fatigue"  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Symptom" ADD COLUMN "appetite" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Symptom" ADD COLUMN "nausea"   INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Symptom" ADD COLUMN "sleep"    INTEGER NOT NULL DEFAULT 0;

-- AlterTable Profile: add clinical and contact fields
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "phone"          TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "diagnosis"      TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "stage"          TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "treatmentPhase" TEXT;

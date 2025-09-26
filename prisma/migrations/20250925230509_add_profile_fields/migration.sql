-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "achievements" JSONB,
ADD COLUMN     "education" JSONB,
ADD COLUMN     "experience" JSONB,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "summary" TEXT;

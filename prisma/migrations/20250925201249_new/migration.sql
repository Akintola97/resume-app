/*
  Warnings:

  - You are about to drop the column `authEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `familyName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `givenName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Preference" DROP CONSTRAINT "Preference_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "authEmail",
DROP COLUMN "familyName",
DROP COLUMN "givenName",
DROP COLUMN "name",
DROP COLUMN "profileEmail",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;

-- DropTable
DROP TABLE "public"."Preference";

-- DropEnum
DROP TYPE "public"."Frequency";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

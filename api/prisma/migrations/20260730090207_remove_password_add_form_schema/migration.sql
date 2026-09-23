/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[professorId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "FormTarget" AS ENUM ('PROFESSOR', 'ACTIVITY');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordHash",
ADD COLUMN     "professorId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_professorId_key" ON "users"("professorId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

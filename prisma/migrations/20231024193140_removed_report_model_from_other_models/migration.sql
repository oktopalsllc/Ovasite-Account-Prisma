/*
  Warnings:

  - You are about to drop the column `primaryKey` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `userIpAddress` on the `Audit` table. All the data in the column will be lost.
  - The `role` column on the `EmployeeProjectAssociation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `formId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `Report` table. All the data in the column will be lost.
  - Added the required column `rowId` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('SUPERVISOR', 'FIELD_AGENT', 'GUEST', 'MANAGER');

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_formId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_submissionId_fkey";

-- DropIndex
DROP INDEX "Report_formId_projectId_creatorId_submissionId_organization_idx";

-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "primaryKey",
DROP COLUMN "userIpAddress",
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "rowId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EmployeeProjectAssociation" DROP COLUMN "role",
ADD COLUMN     "role" "ProjectRole" NOT NULL DEFAULT 'FIELD_AGENT';

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "formId",
DROP COLUMN "submissionId";

-- CreateIndex
CREATE INDEX "Report_projectId_creatorId_organizationId_idx" ON "Report"("projectId", "creatorId", "organizationId");

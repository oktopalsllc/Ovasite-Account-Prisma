/*
  Warnings:

  - You are about to drop the column `description` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Report` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geolocation` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_formId_fkey";

-- DropIndex
DROP INDEX "Form_projectId_creatorId_idx";

-- DropIndex
DROP INDEX "Report_formId_projectId_creatorId_submissionId_idx";

-- DropIndex
DROP INDEX "Submission_formId_projectId_creatorId_idx";

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "description",
DROP COLUMN "status",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "geolocation" TEXT NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Form_projectId_creatorId_organizationId_idx" ON "Form"("projectId", "creatorId", "organizationId");

-- CreateIndex
CREATE INDEX "Report_formId_projectId_creatorId_submissionId_organization_idx" ON "Report"("formId", "projectId", "creatorId", "submissionId", "organizationId");

-- CreateIndex
CREATE INDEX "Submission_formId_projectId_creatorId_organizationId_idx" ON "Submission"("formId", "projectId", "creatorId", "organizationId");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

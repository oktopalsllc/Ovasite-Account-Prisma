-- DropIndex
DROP INDEX "Project_organizationId_idx";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE INDEX "Project_organizationId_creatorId_idx" ON "Project"("organizationId", "creatorId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

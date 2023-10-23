-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "geolocation" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "userMail" TEXT NOT NULL,
    "userIpAddress" TEXT,
    "orgId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldValues" TEXT NOT NULL,
    "newValues" TEXT NOT NULL,
    "primaryKey" TEXT NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "subCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visits" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;

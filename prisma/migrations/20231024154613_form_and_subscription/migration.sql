/*
  Warnings:

  - The values [OWNER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[stripe_customer_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_subscription_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "formData" SET DEFAULT '[]',
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripe_current_period_end" TIMESTAMP(3),
ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_price_id" TEXT,
ADD COLUMN     "stripe_subscription_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_stripe_customer_id_key" ON "User"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripe_subscription_id_key" ON "User"("stripe_subscription_id");

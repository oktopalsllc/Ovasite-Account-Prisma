/*
  Warnings:

  - You are about to drop the column `image` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "image",
ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "imageUrl",
ADD COLUMN     "logo" TEXT;

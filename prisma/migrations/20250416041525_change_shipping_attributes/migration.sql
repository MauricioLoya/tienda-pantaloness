/*
  Warnings:

  - You are about to drop the column `shippingFree` on the `Region` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Region" DROP COLUMN "shippingFree",
ADD COLUMN     "amountForFreeShipping" DOUBLE PRECISION;

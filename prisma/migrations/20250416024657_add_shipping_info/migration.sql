-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "isFreeShipping" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shippingFree" DOUBLE PRECISION;

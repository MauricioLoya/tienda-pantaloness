-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "regionId" TEXT;

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "currencyCode" TEXT,
ADD COLUMN     "taxRate" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("code") ON DELETE SET NULL ON UPDATE CASCADE;

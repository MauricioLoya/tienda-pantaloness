-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "regionId" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "regionId" TEXT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("code") ON DELETE SET NULL ON UPDATE CASCADE;

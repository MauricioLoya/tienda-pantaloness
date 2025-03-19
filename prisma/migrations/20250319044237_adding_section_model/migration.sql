-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('highlight', 'banner');

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "type" "SectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "actionUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "backgroundUrl" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "regionCode" TEXT,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightProduct" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,

    CONSTRAINT "HighlightProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightProduct" ADD CONSTRAINT "HighlightProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightProduct" ADD CONSTRAINT "HighlightProduct_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Promotion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");

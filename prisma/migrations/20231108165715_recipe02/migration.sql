/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recipe_id_userId_key" ON "Recipe"("id", "userId");

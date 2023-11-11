/*
  Warnings:

  - The primary key for the `Ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Ingredient` table. All the data in the column will be lost.
  - The primary key for the `Step` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Step` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[index,recipeId]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[index,recipeId]` on the table `Step` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ingredient_id_recipeId_key";

-- DropIndex
DROP INDEX "Step_id_recipeId_key";

-- AlterTable
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "Step" DROP CONSTRAINT "Step_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_index_recipeId_key" ON "Ingredient"("index", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Step_index_recipeId_key" ON "Step"("index", "recipeId");

/*
  Warnings:

  - Made the column `new_price` on table `Dish` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dish" ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "new_price" SET NOT NULL;

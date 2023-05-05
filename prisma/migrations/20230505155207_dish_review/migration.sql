/*
  Warnings:

  - A unique constraint covering the columns `[accountId,restaurantId]` on the table `RestaurantReview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "DishReview" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DishReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DishReview_accountId_dishId_key" ON "DishReview"("accountId", "dishId");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantReview_accountId_restaurantId_key" ON "RestaurantReview"("accountId", "restaurantId");

-- AddForeignKey
ALTER TABLE "DishReview" ADD CONSTRAINT "DishReview_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishReview" ADD CONSTRAINT "DishReview_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

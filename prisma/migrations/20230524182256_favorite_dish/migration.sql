-- CreateTable
CREATE TABLE "FavoriteDish" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FavoriteDish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteDish_accountId_dishId_key" ON "FavoriteDish"("accountId", "dishId");

-- AddForeignKey
ALTER TABLE "FavoriteDish" ADD CONSTRAINT "FavoriteDish_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDish" ADD CONSTRAINT "FavoriteDish_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

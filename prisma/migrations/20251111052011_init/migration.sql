/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `PaymentTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `PaymentTransaction` ADD COLUMN `bookingId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PaymentTransaction_bookingId_key` ON `PaymentTransaction`(`bookingId`);

-- AddForeignKey
ALTER TABLE `PaymentTransaction` ADD CONSTRAINT `PaymentTransaction_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slot` TIMESTAMP(6) NOT NULL,
    `duration` INTEGER NOT NULL,
    `massageType` VARCHAR(64) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(32) NOT NULL,
    `notes` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NOT NULL,

    INDEX `Booking_slot_idx`(`slot`),
    INDEX `Booking_massageType_idx`(`massageType`),
    INDEX `Booking_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(32) NOT NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NOT NULL,

    INDEX `PaymentTransaction_order_id_idx`(`order_id`),
    INDEX `PaymentTransaction_session_id_idx`(`session_id`),
    INDEX `PaymentTransaction_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

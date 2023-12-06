/*
  Warnings:

  - You are about to drop the column `profileId` on the `documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `Documents_profileId_fkey`;

-- AlterTable
ALTER TABLE `documents` DROP COLUMN `profileId`;

-- CreateTable
CREATE TABLE `_DocumentsToUserProfile` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DocumentsToUserProfile_AB_unique`(`A`, `B`),
    INDEX `_DocumentsToUserProfile_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DocumentsToUserProfile` ADD CONSTRAINT `_DocumentsToUserProfile_A_fkey` FOREIGN KEY (`A`) REFERENCES `Documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DocumentsToUserProfile` ADD CONSTRAINT `_DocumentsToUserProfile_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

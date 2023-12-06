/*
  Warnings:

  - You are about to drop the `_documentstouserprofile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profileId` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_documentstouserprofile` DROP FOREIGN KEY `_DocumentsToUserProfile_A_fkey`;

-- DropForeignKey
ALTER TABLE `_documentstouserprofile` DROP FOREIGN KEY `_DocumentsToUserProfile_B_fkey`;

-- AlterTable
ALTER TABLE `documents` ADD COLUMN `profileId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_documentstouserprofile`;

-- AddForeignKey
ALTER TABLE `Documents` ADD CONSTRAINT `Documents_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `UserProfile`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

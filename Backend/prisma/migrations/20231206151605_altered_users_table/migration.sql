/*
  Warnings:

  - You are about to drop the column `profileId` on the `documents` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `Documents_profileId_fkey`;

-- AlterTable
ALTER TABLE `documents` DROP COLUMN `profileId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Documents` ADD CONSTRAINT `Documents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `accessToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `accessToken`;

-- CreateTable
CREATE TABLE `Projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `userIds` INTEGER NOT NULL,

    UNIQUE INDEX `Projects_userIds_key`(`userIds`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Projects` ADD CONSTRAINT `Projects_userIds_fkey` FOREIGN KEY (`userIds`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

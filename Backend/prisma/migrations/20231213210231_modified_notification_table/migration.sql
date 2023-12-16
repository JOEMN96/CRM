/*
  Warnings:

  - Added the required column `type` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `documents` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `read` BOOLEAN NOT NULL DEFAULT false;

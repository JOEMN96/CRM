/*
  Warnings:

  - Added the required column `projectID` to the `Calender` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `calender` ADD COLUMN `projectID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Calender` ADD CONSTRAINT `Calender_projectID_fkey` FOREIGN KEY (`projectID`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

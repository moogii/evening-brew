/*
  Warnings:

  - You are about to drop the column `tagId` on the `Posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_tagId_fkey";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "tagId",
ADD COLUMN     "tagName" TEXT;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tags"("name") ON DELETE SET NULL ON UPDATE CASCADE;

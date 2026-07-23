/*
  Warnings:

  - You are about to alter the column `title` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `currency` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `location` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `category` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `image_url` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `status` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `sexe` on the `Promotion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `pourcentage` on the `Promotion` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `available_tickets` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre` on table `Promotion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sexe` on table `Promotion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pourcentage` on table `Promotion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duree` on table `Promotion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_user_id_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "currency" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "category" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "available_tickets" SET NOT NULL,
ALTER COLUMN "image_url" DROP DEFAULT,
ALTER COLUMN "image_url" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "status" SET DEFAULT 'draft',
ALTER COLUMN "status" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "nombre" SET NOT NULL,
ALTER COLUMN "nombre" SET DEFAULT 0,
ALTER COLUMN "sexe" SET NOT NULL,
ALTER COLUMN "sexe" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "pourcentage" SET NOT NULL,
ALTER COLUMN "pourcentage" SET DEFAULT 0,
ALTER COLUMN "pourcentage" SET DATA TYPE INTEGER,
ALTER COLUMN "duree" SET NOT NULL,
ALTER COLUMN "duree" SET DEFAULT 0;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Ticket";

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_start_date_idx" ON "Event"("start_date");

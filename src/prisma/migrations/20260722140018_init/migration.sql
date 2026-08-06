/*
  Warnings:

  - A unique constraint covering the columns `[event_id]` on the table `Promotion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "price" DROP DEFAULT,
ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "capacity" DROP DEFAULT,
ALTER COLUMN "available_tickets" DROP NOT NULL,
ALTER COLUMN "available_tickets" DROP DEFAULT,
ALTER COLUMN "image_url" SET DEFAULT '/images/events/placeholder.jpg',
ALTER COLUMN "status" SET DEFAULT 'published';

-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "nombre" DROP NOT NULL,
ALTER COLUMN "nombre" DROP DEFAULT,
ALTER COLUMN "sexe" SET DEFAULT 'tous',
ALTER COLUMN "pourcentage" DROP NOT NULL,
ALTER COLUMN "pourcentage" DROP DEFAULT,
ALTER COLUMN "pourcentage" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "prix_promo" DROP NOT NULL,
ALTER COLUMN "prix_promo" DROP DEFAULT,
ALTER COLUMN "duree" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "code" TEXT NOT NULL,
    "prix_paye" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "date_achat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_validite" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_code_key" ON "Ticket"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_event_id_key" ON "Promotion"("event_id");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

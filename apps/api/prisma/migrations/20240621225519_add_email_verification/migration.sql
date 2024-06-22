-- AlterEnum
ALTER TYPE "TokenType" ADD VALUE 'EMAIL_CONFIRMATION';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verified_email" BOOLEAN NOT NULL DEFAULT false;

-- CreateEnum
CREATE TYPE "AUTH_PROVIDER" AS ENUM ('UNKNOWN', 'LOCAL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "USER_STATUS" AS ENUM ('CONFIRMED', 'PENDING', 'DEACTIVATED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "auth_provider" "AUTH_PROVIDER" NOT NULL DEFAULT 'UNKNOWN',
    "googleId" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(60),
    "email" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "status" "USER_STATUS" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(2) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(2) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(2) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(2) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

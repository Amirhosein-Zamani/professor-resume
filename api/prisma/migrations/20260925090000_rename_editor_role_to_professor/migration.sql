-- Replace the legacy editor name with the domain role used by the application.
ALTER TYPE "UserRole" RENAME VALUE 'EDITOR' TO 'PROFESSOR';

ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'PROFESSOR';

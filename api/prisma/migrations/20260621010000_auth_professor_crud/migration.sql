DO $$
BEGIN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

ALTER TABLE "professors"
    ADD COLUMN IF NOT EXISTS "slug" TEXT,
    ADD COLUMN IF NOT EXISTS "firstName" TEXT,
    ADD COLUMN IF NOT EXISTS "lastName" TEXT,
    ADD COLUMN IF NOT EXISTS "displayName" TEXT,
    ADD COLUMN IF NOT EXISTS "nationalCode" TEXT,
    ADD COLUMN IF NOT EXISTS "rank" TEXT,
    ADD COLUMN IF NOT EXISTS "faculty" TEXT,
    ADD COLUMN IF NOT EXISTS "specialty" TEXT,
    ADD COLUMN IF NOT EXISTS "isFaculty" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "avatar" TEXT,
    ADD COLUMN IF NOT EXISTS "email" TEXT,
    ADD COLUMN IF NOT EXISTS "cvUrl" TEXT,
    ADD COLUMN IF NOT EXISTS "bio" TEXT;

UPDATE "professors"
SET
    "slug" = COALESCE("slug", 'professor-' || SUBSTRING("id" FROM 1 FOR 8)),
    "firstName" = COALESCE("firstName", 'نامشخص'),
    "lastName" = COALESCE("lastName", COALESCE("golestanProfessorNo", 'استاد')),
    "displayName" = COALESCE(
        "displayName",
        TRIM(
            COALESCE("firstName", 'نامشخص') || ' ' ||
            COALESCE("lastName", COALESCE("golestanProfessorNo", 'استاد'))
        )
    ),
    "rank" = COALESCE("rank", 'نامشخص'),
    "faculty" = COALESCE("faculty", COALESCE("facultyName", 'نامشخص')),
    "avatar" = COALESCE("avatar", '/Images/professors/default-avatar.png');

ALTER TABLE "professors"
    ALTER COLUMN "slug" SET NOT NULL,
    ALTER COLUMN "firstName" SET NOT NULL,
    ALTER COLUMN "lastName" SET NOT NULL,
    ALTER COLUMN "displayName" SET NOT NULL,
    ALTER COLUMN "rank" SET NOT NULL,
    ALTER COLUMN "faculty" SET NOT NULL,
    ALTER COLUMN "avatar" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "professors_slug_key" ON "professors"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "professors_nationalCode_key" ON "professors"("nationalCode");
CREATE INDEX IF NOT EXISTS "professors_lastName_firstName_idx" ON "professors"("lastName", "firstName");
CREATE INDEX IF NOT EXISTS "professors_displayName_idx" ON "professors"("displayName");

CREATE TABLE IF NOT EXISTS "professor_links" (
    "id" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "scholar" TEXT,
    "researchgate" TEXT,
    "scopus" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professor_links_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "professor_links_professorId_key" ON "professor_links"("professorId");

DO $$
BEGIN
    ALTER TABLE "professor_links"
        ADD CONSTRAINT "professor_links_professorId_fkey"
        FOREIGN KEY ("professorId") REFERENCES "professors"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "professor_activities" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT,
    "type" TEXT NOT NULL,
    "titleFa" TEXT,
    "titleEn" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "professorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professor_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "professor_activities_professorId_sortOrder_idx" ON "professor_activities"("professorId", "sortOrder");
CREATE INDEX IF NOT EXISTS "professor_activities_sourceId_idx" ON "professor_activities"("sourceId");

DO $$
BEGIN
    ALTER TABLE "professor_activities"
        ADD CONSTRAINT "professor_activities_professorId_fkey"
        FOREIGN KEY ("professorId") REFERENCES "professors"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "publications"
    ADD COLUMN IF NOT EXISTS "title" TEXT,
    ADD COLUMN IF NOT EXISTS "journal" TEXT,
    ADD COLUMN IF NOT EXISTS "year" INTEGER,
    ADD COLUMN IF NOT EXISTS "authors" TEXT,
    ADD COLUMN IF NOT EXISTS "doi" TEXT;

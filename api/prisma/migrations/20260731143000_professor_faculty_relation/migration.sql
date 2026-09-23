INSERT INTO "faculties" ("id", "name", "createdAt", "updatedAt")
SELECT
    md5(random()::text || clock_timestamp()::text),
    p."faculty",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "professors" p
WHERE p."faculty" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "faculties" f
    WHERE f."name" = p."faculty"
  );

ALTER TABLE "professors"
ADD COLUMN "facultyId" TEXT;

UPDATE "professors" p
SET "facultyId" = f."id"
FROM "faculties" f
WHERE f."name" = p."faculty";

ALTER TABLE "professors"
ALTER COLUMN "facultyId" SET NOT NULL;

CREATE INDEX "professors_facultyId_idx" ON "professors"("facultyId");

ALTER TABLE "professors"
ADD CONSTRAINT "professors_facultyId_fkey"
FOREIGN KEY ("facultyId") REFERENCES "faculties"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

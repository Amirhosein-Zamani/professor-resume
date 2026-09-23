-- CreateTable
CREATE TABLE "professors" (
    "id" TEXT NOT NULL,
    "golestanProfessorNo" TEXT,
    "employeeNo" TEXT,
    "studentNo" TEXT,
    "facultyName" TEXT,
    "researchGroupName" TEXT,
    "organizationName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL,
    "golestanArticleNo" TEXT,
    "printPlace" TEXT,
    "language" TEXT,
    "journalArticleType" TEXT,
    "latinJournalOrConfTitle" TEXT,
    "persianJournalOrConfTitle" TEXT,
    "activityRegisteredAt" TIMESTAMP(3),
    "professorId" TEXT,
    "rawData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professors_golestanProfessorNo_key" ON "professors"("golestanProfessorNo");

-- CreateIndex
CREATE UNIQUE INDEX "professors_employeeNo_key" ON "professors"("employeeNo");

-- CreateIndex
CREATE UNIQUE INDEX "publications_golestanArticleNo_key" ON "publications"("golestanArticleNo");

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

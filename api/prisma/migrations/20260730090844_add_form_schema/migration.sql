-- CreateTable
CREATE TABLE "form_schemas" (
    "id" TEXT NOT NULL,
    "target" "FormTarget" NOT NULL,
    "title" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_schemas_target_key" ON "form_schemas"("target");

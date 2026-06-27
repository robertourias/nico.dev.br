-- CreateTable
CREATE TABLE "claps" (
    "slug" TEXT NOT NULL,
    "uid" UUID NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claps_pkey" PRIMARY KEY ("slug","uid")
);

-- CreateIndex
CREATE INDEX "claps_slug_idx" ON "claps"("slug");

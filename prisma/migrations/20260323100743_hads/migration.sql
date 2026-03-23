-- CreateTable
CREATE TABLE "HadsResponse" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" INTEGER[],
    "anxietyScore" INTEGER NOT NULL,
    "depressionScore" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "HadsResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HadsResponse" ADD CONSTRAINT "HadsResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

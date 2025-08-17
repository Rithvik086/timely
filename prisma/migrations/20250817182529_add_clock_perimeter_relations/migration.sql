-- CreateTable
CREATE TABLE "public"."Clock" (
    "id" TEXT NOT NULL,
    "clockIn" TIMESTAMP(3) NOT NULL,
    "clockOut" TIMESTAMP(3),
    "clockInLat" DOUBLE PRECISION,
    "clockInLon" DOUBLE PRECISION,
    "clockOutLat" DOUBLE PRECISION,
    "clockOutLon" DOUBLE PRECISION,
    "clockInNote" TEXT,
    "clockOutNote" TEXT,
    "userId" TEXT NOT NULL,
    "perimeterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Perimeter" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radiusM" DOUBLE PRECISION NOT NULL,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Perimeter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Clock" ADD CONSTRAINT "Clock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Clock" ADD CONSTRAINT "Clock_perimeterId_fkey" FOREIGN KEY ("perimeterId") REFERENCES "public"."Perimeter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Perimeter" ADD CONSTRAINT "Perimeter_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

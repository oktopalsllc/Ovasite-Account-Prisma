-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "numberOfOrgs" TEXT NOT NULL,
    "numberOfEmployees" TEXT NOT NULL,
    "numberOfProjects" TEXT NOT NULL,
    "numberOfForms" TEXT NOT NULL,
    "numberOfSubmissions" TEXT NOT NULL,
    "offlineSubmission" BOOLEAN NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "testId" TEXT,
    "productionId" TEXT,
    "subscriptionId" TEXT NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_name_key" ON "Subscription"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Price_subscriptionId_key" ON "Price"("subscriptionId");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

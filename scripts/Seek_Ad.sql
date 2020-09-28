CREATE TYPE "offer_type" AS ENUM (
  'discount',
  'deal'
);

CREATE TYPE "subscriptionStatus" AS ENUM (
  'pending',
  'completed'
);

CREATE TABLE "customer" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT,

  PRIMARY KEY ("id")
);

CREATE TABLE "products" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT,
  "description" TEXT,
  "price" NUMBER,

  PRIMARY KEY ("id")
);

CREATE TABLE "Offers" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "type" "offer_type" not null,
  "price" NUMBER,
  "upgradedNumber" NUMBER,
  "originalNumber" NUMBER,
  "productId" UUID NOT NULL REFERENCES "products" ON DELETE CASCADE ON UPDATE CASCADE,

  PRIMARY KEY ("id")
);

CREATE TABLE "specialOffers" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "customerId" UUID NOT NULL REFERENCES "customer" ON DELETE CASCADE ON UPDATE CASCADE,
  "offerId" UUID NOT NULL REFERENCES "Offers" ON DELETE CASCADE ON UPDATE CASCADE,

  PRIMARY KEY ("id")

);

CREATE TABLE "subscriptions" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "customerId" UUID NOT NULL REFERENCES "customer" ON DELETE CASCADE ON UPDATE CASCADE,
  "productId" UUID NOT NULL REFERENCES "products" ON DELETE CASCADE ON UPDATE CASCADE,
  "status" "subscriptionStatus" NOT NULL,
  "quantity" NUMBER,
  "timeCreated" TIMESTAMP NOT NULL ,

  PRIMARY KEY ("id")
);

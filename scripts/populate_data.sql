INSERT INTO "customer" ("id", "name") VALUES (uuid_generate_v4(), 'SecondBite');
INSERT INTO "customer" ("id", "name") VALUES (uuid_generate_v4(), 'Axil Coffee Roasters');
INSERT INTO "customer" ("id", "name") VALUES (uuid_generate_v4(), 'MYER');

INSERT INTO "product" ("id", "name", "description", "price") VALUES (uuid_generate_v4(), 'Classic Ad', 'Offers the most basic level of advertisement', 269.99);
INSERT INTO "product" ("id", "name", "description", "price") VALUES (uuid_generate_v4(), 'Stand out Ad', 'Allows advertisers to use a company logo and use a longer presentation text', 322.99);
INSERT INTO "product" ("id", "name", "description", "price") VALUES (uuid_generate_v4(), 'Premium Ad', 'Same benefits as Standout Ad, but also puts the advertisement at the top of the results, allowing higher visibility', 394.99);

INSERT INTO "Offers" ("id", "type", "price", "upgradedNumber", "originalNumber", "productId") select uuid_generate_v4(), 'discount', 269.99, null, null, id from product where name = 'Stand out Ad';
INSERT INTO "Offers" ("id", "type", "price", "upgradedNumber", "originalNumber", "productId") select uuid_generate_v4(), 'discount', 389.99, null, null, id from product where name = 'Premium Ad';
INSERT INTO "Offers" ("id", "type", "price", "upgradedNumber", "originalNumber", "productId") select uuid_generate_v4(), 'deal', null, 3, 2, id from product where name = 'Classic Ad';
INSERT INTO "Offers" ("id", "type", "price", "upgradedNumber", "originalNumber", "productId") select uuid_generate_v4(), 'deal', null, 5, 4, id from product where name = 'Stand out Ad';

INSERT INTO "specialOffers" ("id", "customerId", "offerId") select uuid_generate_v4(), id from customer where name = 'SecondBite', select id from "Offers" where type = 'deal' and "originalNumber" = 2
INSERT INTO "specialOffers" ("id", "customerId", "offerId") select uuid_generate_v4(), id from customer where name = 'Axil Coffee Roasters', select id from "Offers" where type = 'discount' and price = 269.99
INSERT INTO "specialOffers" ("id", "customerId", "offerId") select uuid_generate_v4(), id from customer where name = 'MYER', select id from "Offers" where type = 'deal' and "originalNumber" = 4
INSERT INTO "specialOffers" ("id", "customerId", "offerId") select uuid_generate_v4(), id from customer where name = 'MYER', select id from "Offers" where type = 'discount' and price = 389.99

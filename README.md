# Price Calculator 

## Component Outline

This is an express app using nodejs and typescript that allows user to add items and see the total price of all items. The UI is bare minimal and uses EJS to just render data. This app needs POSTGRES DB and connects to a postgres DB with the parameters defined in .env file. It allows user to add multiple products in varying quanitities. It also takes into account special discounts available for certain customers

## Running

### Install packages.

`npm install`

### Set up settings

#### Locally

1. Install POSTGRES - https://www.postgresql.org/download/
2. Go to scripts directory and run ./seed-with.sh Seek_Ad.sql , this will create the schema. Please note that depending on your environment, you might
need to give permission for your script to run. In case you get permission denied error, please do chmod 777 ./seed-with.sh
3. Run ./seed-with.sh populate_data.sql , this will populate initial set of data with customers that have special offers
4. Check the .env file and change DB connection entries if need be
5. npm install
6. npm start, please go to localhost:3000 and it will bring up the UI


### Run the application:

`npm start`

## Tech Stack

- Typescript
- EJS
- Postgres DB
- Jest for unit tests

## CLI Commands

``` bash
# install dependencies
npm install

# start server
npm start

# run tests with jest
npm test
```
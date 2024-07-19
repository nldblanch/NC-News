# Northcoders News API

## View this project online
You can view the hosted API [here](https://nc-news-bxej.onrender.com/api)!


## Description
Northcoders News is a Reddit clone created in JavaScript. It's fundamentally built upon PSQL and Express.js to run the database and server. 


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

You will need Node.js v21.7.3 (or later) installed on your computer. 

You will also need Postgres v14 (or later).

### Cloning the repo

In your terminal, run the following command:
```
git clone https://github.com/nldblanch/NC-News.git
```

This will copy the repo and its contents to the directory you run the command from.

### Dependencies

This API relies on dotenv, express and pg. There are several extra developer dependencies for testing.

### Installing

They can be easily installed by running this command in your terminal:
```
npm install
```
You should now see a new directory in your local repository called node_modules. 

### Creating .env files for local hosting
This API uses private .env files that contain the environment variables for the databases. To connect to the databases locally you will need to create two .env files called .env.test and .env.development (for the respective test and development databases).
These files will need to store the appropriate environment variable. 
> In the testing .env file, declare **PGDATABASE=nc_news_test** \
> In the development .env file, declare **PGDATABASE=nc_news**

Please make sure there is nothing else in those files, including and semi-colons, commas, or full-stops. 

There is a .env-example file to show what it should look like.

### Executing program

There are several scripts depending on whether you run the test or developer database:

- Setup the local database
```
npm run setup-dbs
```
_Required first time to setup the database and tables._

---
- Seed the developer database
```
npm run seed
```
_Seeds the developer database with the developer data._

---
- Test any of the test files
```
npm test [file_name]
```
For example
```
npm test app
```
will run the app.test.js test file.

_The test database will seed itself with the test data for each test._

## Deploying your own version of the API

Do you want to deploy your own version of this API? [Follow these instructions!](./api-hosting.md) 

## Acknowledgements

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).
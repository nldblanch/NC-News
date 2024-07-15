# Northcoders News API

This API uses private .env files that contain the environment variables for the databases. To connect to the databases locally you will need to create two .env files called .env.test and .env.development (for the respective test and development databases).

These files will need to store the appropriate environment variable. 
> In the testing .env file, declare **PGDATABASE=nc_news_test** \
> In the development .env file, declare **PGDATABASE=nc_news**

Please make sure there is nothing else in those files, including and semi-colons, commas, or full-stops. 

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

# NodeJS API Assessment

## Getting Started

1. Have Node.js, NPM and MySQL installed on local machine.
2. Clone the repository to your local machine.
3. In the project directory, open a terminal and run `npm install` to install necessary modules.
4. Create a new MySQL database with the name of 'govtech_assessment_dev' and replace the MySQL credentials in the config file '/config/config.js'.

   ```
   // can be found in '/config/config.js'

   // Update local MySQL credentials here!
   config.dbConfig = {
       host: process.env.DB_HOST || 'localhost',
       username: process.env.DB_USERNAME || 'root', // replace 'root' with your username
       password: process.env.DB_PASSWORD || 'q1w2e3r4Q!W@E#R$', // replace 'q1w2e3r4Q!W@E#R$' your password
       database: process.env.DB_DATABASE || 'govtech_assessment_dev'
   };
   ```

5. In the project directory, open a terminal and run `npm start` to start the server. It will automatically sync the database schema.

6. Alternatively, run `npm run dev` to have nodemon automatically restarting the application when file changes are detected. This command will also drop the existing tables and create the tables agin.

7. To check on unit tests, run `npm test`.


## Local API Endpoints

`POST http://localhost:5000/api/register`

`GET http://localhost:5000/api/commonstudents`

`POST http://localhost:5000/api/suspend`

`POST http://localhost:5000/api/retrievefornotifications`

## Hosted API Endpoints

`POST https://jiehan-assessment-staging.azurewebsites.net/api/register`

`GET https://jiehan-assessment-staging.azurewebsites.net/api/commonstudents`

`POST https://jiehan-assessment-staging.azurewebsites.net/api/suspend`

`POST https://jiehan-assessment-staging.azurewebsites.net/api/retrievefornotifications`

## Postman Collection
Sample postman collection is available in the postman folder.
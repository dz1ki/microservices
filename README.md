## Description

A small service for receiving invoices for payment.

Stack:  
 The platform for creating a service is Node.js.  
 Framework - Express.  
 ORM - Sequelize-typescript.  
 PostgreSQL as a database.  
 Message Broker: RebbitMQ.  
 Swagger documentation.  
 Docker-compose is used to organize work with RebbitMQ and PostgreSQL.  
 Logging: Bunyan.

The working process:

1. The client sends an HTTP request to the service, passing to the API:  
   1.1 Email address.  
   1.2 The content of the work performed, in the form of a list of works and the cost for each item.

2. On the server side "web-api":  
   2.1 Using e-mail, the server retrieves additional information about the client from the database to generate an invoice.  
   2.3 Sends data to the queue: "generateInvoice".  
   2.4 Waiting for a response from the "sendInvoice" queue.  
   2.5 If within 7s. no response, an error is returned.

3. On the microservice "worker-pdf" side:  
   3.1 The event listener responds to messages.  
   3.2 Calls a function to generate an invoice.  
   3.3 After the file is generated, it is sent to the queue: "sendInvoice".

For clarity, the Invoice generation function uses a delay of 2s. Logs are stored in the folder: Logs.

## Running the app

```bash

# In the console, run the build and launch images with the command:
$ docker-compose up

# Wait until the server starts.

# In the new terminal go to the web-api directory.
$ cd web-api

# Install dependencies.
$ npm install

# Create tables in the database using the "migrations" command:
$ npm run migrate:run

# Fill in the tables with the data "seeders" with the command:
$ npm run seed:run

# Start the server
$ npm run start

# In the new terminal go to the worker-pdf directory.
$ cd worker-pdf

# Install dependencies.
$ npm install

# Run worker-pdf microservice.
$ npm run start

```

## Test

Documentation (Swagger UI) is available at: [link] http://localhost:3000/api/

RabbitMQ Management: [link] http://localhost:15672/  
Credentials: User: Yra, Passaword: 1234

node v16.14.2

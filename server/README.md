Node JS Machine Test – Backend

This project is the backend implementation for the Node JS Machine Test using Node.js, Express, and PostgreSQL (RDBMS).

Tech Stack:
Node.js, Express.js, PostgreSQL (Local RDBMS)

Database:
PostgreSQL database name: machine_test
Port: 5432
Product table is related to Category table using foreign key.

Features:
Category Master CRUD operations
Product Master CRUD operations
Each product belongs to a category
Product list displays ProductId, ProductName, CategoryId, CategoryName
Server-side pagination implemented using LIMIT and OFFSET

Environment Configuration:
PORT=3000
DATABASE_URL=postgresql://postgres:root@localhost:5432/machine_test

Run Project:
npm install
npm start

API Endpoints:
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id

GET /api/products?page=1&limit=10
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id

Pagination Logic:
Records are fetched from database based on page size using:
(page - 1) * limit

API Testing:
All APIs are tested using Postman.

Note:
Only RDBMS (PostgreSQL) is used as required in the machine test.

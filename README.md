## Description <!-- omit in toc -->
This project is a sample application built with Nest.js. It demonstrates functionalities such as adding accounts, withdrawing, depositing, and transferring money, all secured with JWT authentication. The application uses Prisma as the ORM and PostgreSQL as the database. Additionally, Swagger is integrated for API documentation.

For testing, the project includes end-to-end (e2e) testing and utilizes k6 for load, stress, spike, and soak testing.

## Table of content <!-- omit in toc -->
- [Project setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Compile and run the project](#compile-and-run-the-project)
- [Run tests](#run-tests)

### TypeScript
!TypeScript

## Project setup
```bash
$ yarn install
```

## Environment Variables
Create `.env` and `.env.test` files with the **following** keys:

- `DATABASE_URL`: URL for your PostgreSQL database.
- `TOKEN_SECRET_KEY`: Secret key for JWT authentication.

## Compile and run the project
```bash 
# development
$ yarn run start

# watch mode
$ yarn run start:dev

```

## Run tests
```bash
# e2e test
$ yarn run test:e2e
```

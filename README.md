## Description <!-- omit in toc -->
This is a sample bank application using Nest.js, showcasing key functionalities such as account creation, withdrawals, deposits, and money transfers, all secured with JWT authentication. The application leverages Prisma as the ORM and PostgreSQL as the database. Also uses Redis for caching. Integrated Swagger for comprehensive API documentation.

For testing, implemented end-to-end (e2e) testing with Jest and utilized k6 for load, stress, spike, and soak testing.

## Table of content <!-- omit in toc -->
- [Project setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Docker setup](#docker-setup)
- [Compile and run the project](#compile-and-run-the-project)
- [Run tests](#run-tests)
- [Swagger](#swagger)

## Project setup
```bash
$ pnpm install
```

## Environment Variables
Create `.env` and `.env.test` files with the **following** keys:

- `DATABASE_URL`: URL for your PostgreSQL database.
- `REDIS_URL`: URL for your Redis database.
- `TOKEN_SECRET_KEY`: Secret key for JWT authentication.

## Docker setup
```bash
$ docker-compose up --build
```

## Compile and run the project
```bash 
# development
$ pnpm start

# watch mode
$ pnpm start:dev

```

## Run tests
```bash
# e2e test
$ pnpm test:e2e
```
## Swagger
http://localhost:3000/swagger#/
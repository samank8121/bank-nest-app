## Description <!-- omit in toc -->
This project is a sample application built with Nest.js. It demonstrates functionalities such as adding accounts, withdrawing, depositing, and transferring money, all secured with JWT authentication. The application uses Prisma as the ORM and PostgreSQL as the database. Additionally, Swagger is integrated for API documentation.

For testing, the project includes end-to-end (e2e) testing and utilizes k6 for load, stress, spike, and soak testing.

<p align="left">
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://developer.mozilla.org/en-US/docs/Web/HTML">
    <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
  </a>
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://developer.mozilla.org/en-US/docs/Web/CSS">
    <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
  </a>
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
    <img src="https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
  </a>
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/node.js-%2343853D.svg?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  </a>
</p>

## Table of content <!-- omit in toc -->
- [Project setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Compile and run the project](#compile-and-run-the-project)
- [Run tests](#run-tests)

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

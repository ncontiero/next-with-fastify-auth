# NFWA

[![license mit](https://img.shields.io/badge/licence-MIT-6C47FF)](LICENSE)

A project with [Next.Js](https://nextjs.org/) and [Fastify](https://fastify.dev/).

## Install and run the project

### Global Dependencies

You need to have a main dependency installed:

- Node.js LTS v18 (or any higher version)

Do you use `nvm`? Then you can run `nvm install` in the project folder to install and use the most appropriate version of Node.js.

### Get the repository

```bash
git clone https://github.com/ncontiero/next-with-fastify-auth.git
```

### Local Dependencies

So after getting the repository, don't forget to install the project's local dependencies:

```bash
pnpm install
```

### Environment variables

#### Root variables

Create a `.env` file similar to [`.env.example`](./.env.example). These variables refer to the Postgres service in [Docker](./docker-compose.yml).

#### Api variables ([`apps/api`](./apps/api/))

Create a `.env` file similar to [`.env.example`](./apps/api/.env.example).
To run the project, all variables present in `.env.example` will be enough, except those related to SMTP that can be used from [Ethereal](https://ethereal.email/).

#### Web variables ([`apps/web`](./apps/web/))

Create a `.env` file similar to [`.env.example`](./apps/web/.env.example).
To run the project, all the variables present in `.env.example` will be enough.

### Run the project

To run the project locally, just run the command below:

```bash
pnpm dev
```

- go to <http://localhost:3000> to see the application.

## License

This project is licensed under the **MIT** License - see the [LICENSE](./LICENSE) file for details.

# guildspeak-backend-server

## Create `.env` file ([example](./.env.example) in repo):

## Install

### [Docker](https://www.docker.com/get-started)

### Dependencies

```bash
npm i
```

## Start the Docker containers using the docker-compose CLI

```bash
# in database subdir
cd database
docker-compose up -d
```

## Deploy the Prisma service to your local Prisma server

```bash
npm run prisma deploy
```

## Commands

* `npm run start` starts GraphQL server on `http://localhost:4000`
* `npm run dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground
* `npm run playground` opens the GraphQL Playground for the `projects` from [`.graphqlconfig.yml`](./.graphqlconfig.yml)
* `npm run prisma <subcommand>` gives access to local version of Prisma CLI (e.g. `npm run prisma deploy`)

# Example usage

When you [started Docker containers using the docker-compose](#Start-the-Docker-containers-using-the-docker-compose-CLI) then deploy the Prisma service to your local Prisma server every time when you change  [`database/datamodel.graphql`](./database/datamodel.graphql) finally run [start or dev command](#Commands)

## FAQ
-  How to clean current database?
    ```bash
    npm run prisma reset
    ```
-  Where Prisma docs? [here](https://www.prisma.io/docs)

<p align="center">
  <h1 align="center">
    <img src="https://cdn.rawgit.com/guildspeak/branding/cdn/SVG/icon-backend.svg" width="50%" alt="Guildspeak Backend"/><br/><br/>
     <img src="https://img.shields.io/github/license/guildspeak/guildspeak-backend.svg?style=for-the-badge" alt="GitHub"/>
     <a href="https://github.com/guildspeak/guildspeak-backend/issues"><img src="https://img.shields.io/github/issues/guildspeak/guildspeak-backend.svg?style=for-the-badge" alt="GitHub issues" /></a>
     <img src="https://img.shields.io/badge/Built%20with-%E2%9D%A4%20LOVE-red.svg?longCache=true&amp;style=for-the-badge" alt="LOVE" />
  </h1>
</p>


### Preparations
- Install [Node.js](https://nodejs.org/en/download/)
- Install [Docker](https://www.docker.com/get-started)
- Create `.env` file ([example file](./.env.example) in repository)
- Install dependencies via `npm i`

### Running backend in development mode

- Start Prisma + Postgres from the database directory
```bash
cd database
docker-compose up -d
```

- Deploy the Prisma service to your local Prisma server
```bash
npm run prisma deploy
```

- Start GraphQl server
```bash
npm run start
```

### Running backend in production mode

- Start Docker containers using the docker-compose CLI
```bash
docker-compose up
```

## Commands:
* `npm run start` starts GraphQL server on `http://localhost:4000`
* `npm run dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground
* `npm run playground` opens the GraphQL Playground for the `projects` from [`.graphqlconfig.yml`](./.graphqlconfig.yml)
* `npm run prisma <subcommand>` gives access to local version of Prisma CLI (e.g. `npm run prisma deploy`)

## FAQ
### How to update production container after making changes? 
```bash
docker-compose down
docker-compose build
docker-compose up
```
### How to clean current database?
**Production**
```bash
docker-compose run guildspeak 
npm run prisma -- reset
```
**Development**
 ```bash
npm run prisma -- reset
```
#### Where are the Prisma docs? 
[here](https://www.prisma.io/docs)

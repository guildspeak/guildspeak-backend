# Guildspeak Backend [![Discord](https://discordapp.com/api/guilds/367325058353594378/embed.png)]()


[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![GitHub issues](https://img.shields.io/github/issues/guildspeak/guildspeak-backend.svg)](https://github.com/guildspeak/guildspeak-backend/issues)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)



## Preparation

- Install [Docker](https://www.docker.com/get-started)
- Create `.env` file ([example](./.env.example) in repo)

## Production

- Start Docker containers using the docker-compose CLI
```bash
docker-compose up -d
```

## Development

- Start Prisma + Postgres from the database directory
```bash
cd database
docker-compose up -d
```

- Deploy the Prisma service to your local Prisma server
```bash
npm run prisma deploy
```

- Commands:
* `npm run start` starts GraphQL server on `http://localhost:4000`
* `npm run dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground
* `npm run playground` opens the GraphQL Playground for the `projects` from [`.graphqlconfig.yml`](./.graphqlconfig.yml)
* `npm run prisma <subcommand>` gives access to local version of Prisma CLI (e.g. `npm run prisma deploy`)

## FAQ
-  How to update production container after making changes?  
```bash
docker-compose down
docker-compose build
docker-compose up
```
-  How to clean current database?


**Production:**
```bash
docker-compose run guildspeak npm run prisma reset
```
**Development:**
```bash
npm run prisma reset
```
-  Where are the Prisma docs? [here](https://www.prisma.io/docs)

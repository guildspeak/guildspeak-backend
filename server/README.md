# guildspeak-backend-server

## Create `.env` file ([example](./.env.example) in repo):

## Install

### [Docker](https://www.docker.com/get-started)

## Start Docker containers using the docker-compose CLI

```bash
docker-compose up -d
```

## FAQ
-  How to update Docker guildspeak container after making changes?
```bash
docker-compose down
docker-compose build
docker-compose up
```
-  How to clean current database?
```bash
docker-compose run guildspeak npm run prisma reset
```
-  Where are the Prisma docs? [here](https://www.prisma.io/docs)

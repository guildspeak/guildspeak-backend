FROM node:10-alpine
WORKDIR /app
COPY . /app/
RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
  && npm install --silent \
  && apk del .build-deps

CMD echo "Waiting for prisma..." && sleep 10 && npm run prisma deploy && npm run start

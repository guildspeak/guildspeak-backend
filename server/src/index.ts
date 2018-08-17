import dotenv from 'dotenv-safe'
let envConfig = {}
if (process.env.NODE_ENV === 'production') {
  envConfig = { path: './.env.production' }
} else if (process.env.NODE_ENV === 'test') {
  envConfig = { path: './.env.test' }
} else {
  envConfig = { path: './.env' }
}
dotenv.config(Object.assign({}, { allowEmptyValues: true, example: './.env.example' }, envConfig))
import express from 'express'
import cors from 'cors'
import consola from 'consola'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import schema from './schema'
import logger from './middlewares/logger'
import db from './db'
const PORT = process.env.PORT || 4000
const HOST = process.env.HOST || 'localhost' || '0.0.0.0'

const server = new ApolloServer({ schema: makeExecutableSchema(schema) })

const app = express()
// @ts-ignore
server.applyMiddleware({ app })
app.use(cors())
app.use(logger())

app.listen(PORT as number, HOST, async (err) => {
  if (err) throw err
  await db()
  consola.start(`Api is listening on http://${HOST}:${PORT}${server.graphqlPath}`)
})

export default () => app

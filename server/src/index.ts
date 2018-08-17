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
import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import db from './db'
import cors from 'cors'
import consola from 'consola'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import schema from './schema'
import logger from './middlewares/logger'
const PORT = process.env.PORT || 4000
const HOST = process.env.HOST || 'localhost' || '0.0.0.0'

const server = new ApolloServer({ schema: makeExecutableSchema(schema) })

const app = fastify()
// @ts-ignore
server.applyMiddleware({ app })
app.register(db).ready()
app.use(cors())
app.use(logger())

app.listen(PORT as number, HOST, err => {
  if (err) throw err
  consola.start(`Api is listening on http://${HOST}:${PORT}${server.graphqlPath}`)
})

export default () => app

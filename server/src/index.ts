import express from 'express'
import cors from 'cors'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import schema from './schema'
const PORT = process.env.PORT || 4000
const HOST = process.env.HOST || 'localhost' || '0.0.0.0'

const server = new ApolloServer({ schema: makeExecutableSchema(schema) })

const app = express()
server.applyMiddleware({ app })
app.use(cors())

app.listen(PORT as number, HOST, err => {
  if (err) throw err
  console.log(`Api is listening on http://${HOST}:${PORT}${server.graphqlPath}`)
})

export default () => app

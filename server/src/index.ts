import express from 'express'
import cors from 'cors'
import { ApolloServer, gql } from 'apollo-server-express'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

const app = express()

server.applyMiddleware({ app })

const PORT = process.env.PORT || 4000
const HOST = process.env.HOST || 'localhost' || '0.0.0.0'
app.use(cors())

app.listen(PORT as number, HOST, err => {
  if (err) throw err
  console.log(`Api is listening on http://${HOST}:${PORT}${server.graphqlPath}`)
})

export default () => app

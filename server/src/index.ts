import { GraphQLServer } from 'graphql-yoga'
import { crunch } from 'graphql-crunch'
import { Prisma } from './generated/prisma'
import resolvers from './resolvers'

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
      debug: true, // log all GraphQL queries & mutations sent to the Prisma API
      // secret: process.env.PRISMA_SECRET, // only needed if specified in `database/prisma.yml` (value set in `.env`)
    }),
    formatResponse: (response) => {
      if (response.data) {
        response.data = crunch(response.data)
      }
      return response
    },
  }),
})
server.start((config) => console.log(`Server is running on http://localhost:${config.port}`))

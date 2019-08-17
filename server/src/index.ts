import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'
import resolvers from './resolvers'
import { PubSub } from 'graphql-subscriptions'
import { makePrismaSchema } from 'nexus-prisma'
import datamodelInfo from './generated/nexus-prisma'
import * as path from 'path'
import { permissions as permissionsMiddleware } from './permissions'

const pubsub = new PubSub()

const schema = makePrismaSchema({
  // Provide all the GraphQL types we've implemented
  types: resolvers,

  // Configure the interface to Prisma
  prisma: {
    datamodelInfo,
    client: prisma
  },

  // Specify where Nexus should put the generated files
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts')
  },

  // Configure nullability of input arguments: All arguments are non-nullable by default
  nonNullDefaults: {
    input: false,
    output: false
  },

  // Configure automatic type resolution for the TS representations of the associated types
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, './types.ts'),
        alias: 'types'
      }
    ],
    contextType: 'types.Context'
  }
})

const server = new GraphQLServer({
  schema,
  // middlewares: [permissionsMiddleware],
  context: req => ({
    ...req,
    prisma,
    pubsub
  })
})

server.start(config => console.log(`Server is running on http://localhost:${config.port}`))

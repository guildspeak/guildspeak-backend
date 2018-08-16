import { gql } from 'apollo-server-express'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
type User {
  id: ID! @unique @relation(name: "UserId")
  username: String @unique
  messages: [Message!]! @relation(name: "MessagesFromUser")
}

type Message {
  id: ID! @unique
  createdAt: String
  updatedAt: String
  content: String!
  sentBy: User! @relation(name: "MessagesFromUser")
}

type Guild {
  id: ID! @unique
  name: String!
  users: [User!]! @relation(name: "UserId")
}

type Query {
  users: [User!]!
  guilds: [Guild!]!
  messages: [Message!]!
}
`

// Provide resolver functions for your schema fields
// TODO: remove mocks from here
const resolvers = {
  Query: {
    users: () => [{
      id: () => '1',
      username: () => 'John',
    }],
    messages: () => [{
      id: () => '1',
      content: () => 'Hello guys!',
    }],
  },
}

export default {
  typeDefs,
  resolvers,
}

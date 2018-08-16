import { gql } from 'apollo-server-express'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
type User {
  id: ID!
  username: String
  messages: [Message!]! @relation(name: "MessagesFromUser")
}

type Message {
  id: ID!
  createdAt: String
  updatedAt: String
  content: String
  sentBy: User! @relation(name: "MessagesFromUser")
}

type Query {
  users: [User]
  messages: [Message]
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

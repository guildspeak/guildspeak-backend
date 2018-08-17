import { gql } from 'apollo-server-express'
import User from './entity/User'
import Message from './entity/Message'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
type User {
  _id: ID! @unique @relation(name: "UserId")
  username: String @unique
  messages: [Message!]! @relation(name: "MessagesFromUser")
}

type Message {
  _id: ID! @unique
  createdAt: String
  updatedAt: String
  content: String!
  sentBy: User! @relation(name: "MessagesFromUser")
}

type Guild {
  _id: ID! @unique
  name: String!
  users: [User!]! @relation(name: "UserId")
  channels: [Channel!]! @relation(name: "ChannelId")
}

type Channel {
  _id: ID! @unique @relation(name: "ChannelId")
  name: String!
  users: [User!]! @relation(name: "UserId")
}

type Query {
  users: [User!]!
  guilds: [Guild!]!
  messages: [Message!]!
}

type Mutation {
  CreateUser(username: String!): User
  CreateMessage(usernameId: ID! content: String!): Message!
}
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    users: async () => {
      const usersModel = new User().getModelForClass(User)
      return await usersModel.find()
    },
    messages: async () => {
      const messagesModel = new Message().getModelForClass(Message)
      return await messagesModel.find()
    },
  },
  Mutation: {
    CreateUser: async (root, args) => {
      const userModel = new User().getModelForClass(User)
      const user = new userModel({
        username: args.username,
      })
      await user.save()
      return await userModel.findOne(args)
    },
    CreateMessage: async (root, args) => {
      const usersModel = new User().getModelForClass(User)
      const messagesModel = new Message().getModelForClass(Message)
      const user = await usersModel.findOne({ _id: args.usernameId })
      if (user) {
        const messages = new messagesModel({
          content: args.content,
          sentBy: args.usernameId,
        })
        await messages.save()
        return await messagesModel.find(args)
      }
    },
  },
}

export default {
  typeDefs,
  resolvers,
}

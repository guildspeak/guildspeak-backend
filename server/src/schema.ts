import { gql } from 'apollo-server-express'
import User from './entity/User'
import Message from './entity/Message'
import Guild from './entity/Guild'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
type User {
  _id: ID! @unique @relation(name: "UserId")
  username: String! @unique
  messages: [Message] @relation(name: "UserMessages")
  createdGuilds: [Guild] @relation(name: "CreatedUserGuilds")
  guilds: [Guild] @relation(name: "UserGuilds")
}

type Message {
  _id: ID! @unique
  createdAt: String!
  updatedAt: String
  content: String!
  sentBy: ID! @relation(name: "UserMessages")
}

type Guild {
  _id: ID! @unique
  name: String!
  createdAt: String!
  createdBy: ID! @relation(name: "UserId")
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
  createUser(username: String!): User!
  createMessage(sentBy: ID!, content: String!): Message!
  createGuild(createdBy: ID!, name:String!, ): Guild!
}
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    users: async (root, args) => {
      const userModel = new User().getModelForClass(User)
      return await userModel.find(args)
    },
    messages: async (root, args) => {
      const messageModel = new Message().getModelForClass(Message)
      return await messageModel.find(args)
    },
    guilds: async (root, args) => {
      const guildModel = new Guild().getModelForClass(Guild)
      return await guildModel.find(args)
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const userModel = new User().getModelForClass(User)
      const user = new userModel({
        username: args.username,
        createdAt: new Date().toUTCString(),
      })
      await user.save()
      return await userModel.findOne(args)
    },
    createMessage: async (root, args) => {
      const userModel = new User().getModelForClass(User)
      const user = await userModel.findOne({ _id: args.sentBy })
      if (user) {
        const messageModel = new Message().getModelForClass(Message)
        const message = new messageModel({
          content: args.content,
          sentBy: args.sentBy,
          createdAt: new Date().toUTCString(),
        })
        await message.save()
        await userModel.update({ _id: args.createdBy }, { $push: { messages: message._id } })
        return await messageModel.findOne(args)
      }
    },
    createGuild: async (root, args) => {
      const userModel = new User().getModelForClass(User)
      const user = await userModel.findOne({ _id: args.createdBy })
      if (user) {
        const guildModel = new Guild().getModelForClass(Guild)
        const guild = new guildModel({
          name: args.name,
          createdBy: args.createdBy,
          createdAt: new Date().toUTCString(),
        })
        await guild.save()
        await userModel.update({ _id: args.createdBy }, { $push: { createdGuilds: guild._id } })
        return await guildModel.findOne(args)
      }
    },
  },
}

export default {
  typeDefs,
  resolvers,
}

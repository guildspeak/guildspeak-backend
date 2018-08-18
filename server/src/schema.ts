import { gql, IResolvers } from 'apollo-server-express'
import User from './entity/User'
import Message from './entity/Message'
import Guild from './entity/Guild'
import Channel from './entity/Channel'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
type User {
  _id: ID! @unique @relation(name: "UserId")
  username: String! @unique
  createdAt: String!
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
  createdAt: String!
  users: [User] @relation(name: "UserId")
}

type Query {
  users: [User!]!
  guilds: [Guild!]!
  messages: [Message!]!
  userById(_id: ID!): User!
  userByUsername(username: String!): User!
}

type Mutation {
  createUser(username: String!): User!
  createMessage(sentBy: ID!, content: String!): Message!
  createGuild(createdBy: ID!, name:String!): Guild!
  createChannel(createdBy: ID!, name:String!): Guild!
}
`

// Provide resolver functions for your schema fields
const resolvers: IResolvers = {
  Query: {
    /**
   * @param root (also sometimes called parent): Remember how we said all a GraphQL server needs to do to resolve a query is calling the resolvers of the query’s fields? Well, it’s doing so breadth-first (level-by-level) and the root argument in each resolver call is simply the result of the previous call (initial value is null if not otherwise specified)
   * @param args This argument carries the parameters for the query, in this case the id of the User to be fetched.
   * @param context An object that gets passed through the resolver chain that each resolver can write to and read from (basically a means for resolvers to communicate and share information).
   * @param info An AST representation of the query or mutation. You can read more about the details in part III of this series: Demystifying the info Argument in GraphQL Resolvers.
   */
    userById: async (root, args, context, info) => {
      const userModel = new User().getModelForClass(User)
      const messageModel = new Message().getModelForClass(Message)
      const guildModel = new Guild().getModelForClass(Guild)
      return await userModel.find().populate([
        { path: 'messages', model: messageModel, select: [args] },
        { path: 'createdGuilds', model: guildModel, select: [args] },
        { path: 'guilds', model: guildModel, select: [args] },
      ])
    },
    userByUsername: async (root, args, context, info) => {
      const userModel = new User().getModelForClass(User)
      const messageModel = new Message().getModelForClass(Message)
      const guildModel = new Guild().getModelForClass(Guild)
      return await userModel.find().populate([
        { path: 'messages', model: messageModel, select: [args] },
        { path: 'createdGuilds', model: guildModel, select: [args] },
        { path: 'guilds', model: guildModel, select: [args] },
      ])
    },
    users: async (root, args, context, info) => {
      const userModel = new User().getModelForClass(User)
      const messageModel = new Message().getModelForClass(Message)
      const guildModel = new Guild().getModelForClass(Guild)
      return await userModel.find().populate([
        { path: 'messages', model: messageModel, select: [args] },
        { path: 'createdGuilds', model: guildModel, select: [args] },
        { path: 'guilds', model: guildModel, select: [args] },
      ])
    },
    messages: async (root, args, context, infos) => {
      const messageModel = new Message().getModelForClass(Message)
      return await messageModel.find(args)
    },
    guilds: async (root, args, context, info) => {
      const guildModel = new Guild().getModelForClass(Guild)
      const channelModel = new Channel().getModelForClass(Channel)
      return await guildModel.find().populate([
        { path: 'channels', model: channelModel, select: [args] },
      ])
    },
  },
  Mutation: {
    createUser: async (root, args, context, info) => {
      const userModel = new User().getModelForClass(User)
      const user = new userModel({
        username: args.username,
        createdAt: new Date().toUTCString(),
      })
      await user.save()
      return await userModel.findOne(args)
    },
    createMessage: async (root, args, context, infos) => {
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
        await userModel.update({ _id: args.createdBy }, { $push: { messages: message } })
        return await messageModel.findOne(args)
      }
    },
    createGuild: async (root, args, context, info) => {
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
        await userModel.update({ _id: args.createdBy }, { $push: { createdGuilds: guild, guilds: guild } })
        return await guildModel.findOne(args)
      }
    },
    createChannel: async (root, args, context, info) => {
      const userModel = new User().getModelForClass(User)
      const user = await userModel.findOne({ _id: args.createdBy })
      if (user) {
        const guildModel = new Guild().getModelForClass(Guild)
        const channelModel = new Channel().getModelForClass(Channel)
        const channel = new channelModel({
          name: args.name,
          createdBy: args.createdBy,
          createdAt: new Date().toUTCString(),
        })
        await channel.save()
        await guildModel.update({ _id: args.createdBy }, { $push: { channels: channel } })
        return await channelModel.findOne(args)
      }
    },
  },
}

export default {
  typeDefs,
  resolvers,
}

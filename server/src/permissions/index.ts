import { rule, shield } from 'graphql-shield'
import { getUserId } from '../utils'
import { Context } from '../types'

const rules = {
  isAuthenticatedUser: rule()(async (parent, args, ctx: Context) => {
    const userId = await getUserId(ctx)

    return userId ? true : false
  }),
  isMessageOwner: rule()(async (parent, { id }, ctx: Context) => {
    const userId = await getUserId(ctx)
    const author = await ctx.prisma.message({ id }).author()

    return userId === author.id ? true : false
  }),
  isUserInChannel: rule()(async (parent, { channelId }, ctx: Context) => {
    const userId = await getUserId(ctx)
    const channel = ctx.prisma.channel({ id: channelId })
    const users = await channel.guildId().users({ where: { id: userId } })

    return users ? true : false
  }),
  isUserInGuild: rule()(async (parent, { guildId }, ctx: Context) => {
    const userId = await getUserId(ctx)
    const guild = ctx.prisma.guild({ id: guildId })
    const users = await guild.users({ where: { id: userId } })

    return users ? true : false
  })
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    guilds: rules.isAuthenticatedUser,
    guild: rules.isAuthenticatedUser,
    channel: rules.isUserInChannel,
    users: rules.isAuthenticatedUser,
    user: rules.isAuthenticatedUser
  },
  Mutation: {
    updateStatus: rules.isAuthenticatedUser,
    disableAccount: rules.isAuthenticatedUser,
    changePassword: rules.isAuthenticatedUser,
    createMessage: rules.isUserInChannel,
    deleteMessage: rules.isMessageOwner,
    editMessage: rules.isMessageOwner,
    createGuild: rules.isAuthenticatedUser,
    joinGuild: rules.isAuthenticatedUser
  },
  AuthPayload: {
    token: rules.isAuthenticatedUser,
    user: rules.isAuthenticatedUser
  },
  User: {
    email: rules.isAuthenticatedUser,
    createdAt: rules.isAuthenticatedUser,
    updatedAt: rules.isAuthenticatedUser,
    createdGuilds: rules.isAuthenticatedUser,
    channels: rules.isAuthenticatedUser
  }
})

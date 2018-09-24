import { Context, getUserId, isUserInChannel, isUserInGuild } from '../utils'

export default {
  channelSubscription: {
    subscribe: async (parent, { channelId }, ctx: Context, info) => {
      await isUserInChannel(ctx, channelId)
      return ctx.db.subscription.channel(
        {
          where: {
            node: {
              id: channelId,
            },
          },
        },
        info,
      )
    },
  },
  guildSubscription: {
    subscribe: async (parent, { guildId }, ctx: Context, info) => {
      await isUserInGuild(ctx, guildId)
      return ctx.db.subscription.guild(
        {
          where: {
            node: {
              id: guildId,
            },
          },
        },
        info,
      )
    },
  },
  guildChannelsSubscription: {
    subscribe: async (parent, { guildId }, ctx: Context, info) => {
      const userId = await getUserId(ctx)
      return ctx.db.subscription.channel(
        {
          where: {
            node: {
              guildId: {
                id: guildId,
                users_some: {
                  id: userId,
                },
              },
            },
          },
        },
        info,
      )
    },
  },
  guildsSubscription: {
    subscribe: async (parent, args, ctx: Context, info) => {
      const userId = await getUserId(ctx)
      return ctx.db.subscription.guild(
        {
          where: {
            node: {
              users_some: {
                id: userId,
              },
            },
          },
        },
        info,
      )
    },
  },
}

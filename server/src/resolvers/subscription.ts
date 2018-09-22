import { Context } from '../utils'

export default {
  channelSubscription: {
    subscribe: (parent, { channelId }, ctx: Context, info) => {
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
    subscribe: (parent, { guildId }, ctx: Context, info) => {
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
    subscribe: (parent, { guildId }, ctx: Context, info) => {
      return ctx.db.subscription.channel(
        {
          where: {
            node: {
              guildId: {
                id: guildId,
              },
            },
          },
        },
        info,
      )
    },
  },
  guildsSubscription: {
    subscribe: (parent, args, ctx: Context, info) => {
      return ctx.db.subscription.guild(
        {},
        info,
      )
    },
  },
}

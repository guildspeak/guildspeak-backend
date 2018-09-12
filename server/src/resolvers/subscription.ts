import { Context } from '../utils'

export default {
  channelSubscription: {
    subscribe: (parent, { channelId }, ctx: Context, info) => {
      return ctx.db.subscription.channel(
        {
          where: {
            mutation_in: ['DELETED', 'UPDATED'],
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
            mutation_in: ['DELETED', 'UPDATED'],
            node: {
              id: guildId,
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
        {
          where: {
            mutation_in: ['DELETED', 'UPDATED'],
          },
        },
        info,
      )
    },
  },
}

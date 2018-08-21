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
}

import { getUserId, Context } from '../../utils'
import { forwardTo } from 'prisma-binding'

export default {
  async createChannel(parent, { name, guildId }, ctx: Context, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createChannel(
      {
        data: {
          name: name,
          guildId: {
            connect: {
              id: guildId,
            },
          },
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info,
    )
  },
}

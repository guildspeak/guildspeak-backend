import { getUserId, Context } from '../../utils'

export default {
  async createMessage(parent, { channelId, content }, ctx: Context, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createMessage(
      {
        data: {
          content: content,
          author: {
            connect: {
              id: userId,
            },
          },
          channelId: {
            connect: {
              id: channelId,
            },
          },
        },
      },
      info,
    )
  },
}

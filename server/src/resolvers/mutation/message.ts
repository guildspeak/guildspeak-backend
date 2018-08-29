import { getUserId, Context } from '../../utils'

export default {
  async createMessage(parent, { channelId, content }, ctx: Context, info) {
    const userId = getUserId(ctx)
    const guild = (await ctx.db.query.guilds({
      where: {
        channels_some: {
          id: channelId,
        },
      },
    }))[0]
    if (!guild.users.find(user => user.id === userId)) throw new Error('User not in guild')
    const result = await ctx.db.mutation.createMessage(
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
    await ctx.db.mutation.updateChannel({
      data: {
        lastMessage: new Date(),
      },
      where: {
        id: channelId,
      },
    })
    return result
  },
}

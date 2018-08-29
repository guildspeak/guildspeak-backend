import { getUserId, Context } from '../../utils'

export default {
  async createMessage(parent, { channelId, content }, ctx: Context, info) {
    const userId = getUserId(ctx)
    const channel = await ctx.db.query.channel({ where: { id: channelId } })
    if (!channel.guildId.users.find(user => user.id === userId)) throw new Error('User not in guild')
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

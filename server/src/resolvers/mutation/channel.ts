import { getUserId, Context, isUserInGuild, isUserInChannel } from '../../utils'

export default {
  async createChannel(parent, { name, guildId }, ctx: Context, info) {
    const userId = await getUserId(ctx)
    await isUserInGuild(ctx, guildId)
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
  async renameChannel(parent, { channelId, newName }, ctx: Context, info) {
    const userId = await getUserId(ctx)
    const channel = await ctx.db.query.channel({ where: { id: channelId } }, '{ author { id } }')
    if (channel.author.id !== userId) throw new Error('That\'s not your channel!')
    return ctx.db.mutation.updateChannel({ where: { id: channelId }, data: { name: newName } }, info)
  },
}

import { getUserId, Context, isUserInGuild } from '../../utils'

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
}

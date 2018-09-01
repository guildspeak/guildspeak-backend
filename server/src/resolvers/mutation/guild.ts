import { getUserId, Context } from '../../utils'
export default {
  async createGuild(parent, { name }, ctx: Context, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createGuild(
      {
        data: {
          name: name,
          author: {
            connect: {
              id: userId,
            },
          },
          users: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info,
    )
  },

  async joinGuild(parent, { guildId }, ctx: Context, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.updateGuild(
      {
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
        },
        where: {
          id: guildId,
        },
      },
      info,
    )
  },
}

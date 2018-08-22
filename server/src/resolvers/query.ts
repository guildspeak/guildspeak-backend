import { getUserId, Context } from '../utils'

export default {
  guilds(parent, args, ctx: Context, info) {
    return ctx.db.query.guilds({}, info)
  },

  guild(parent, { id }, ctx: Context, info) {
    return ctx.db.query.guild({ where: { id } }, info)
  },

  async channel(parent, { id }, ctx: Context, info) {
    const channel = await ctx.db.query.channel({ where: { id } }, {
      ...info,
      guildId: {
        users: {
          id,
        },
      },
    })
    const userId = getUserId(ctx)
    if (!channel.guildId.users.some((el) => el.id === userId)) {
      throw new Error('User not in guild')
    }
    return channel
  },

  users(parent, args, ctx: Context, info) {
    return ctx.db.query.users({}, info)
  },

  user(parent, { id }, ctx: Context, info) {
    return ctx.db.query.user({ where: { id } }, info)
  },

  me(parent, args, ctx: Context, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },
}

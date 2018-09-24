import { getUserId, Context, isUserInChannel } from '../utils'

export default {
  async guilds(parent, args, ctx: Context, info) {
    const id = await getUserId(ctx)
    return ctx.db.query.guilds({ where: { users_some: { id } } }, info)
  },

  guild(parent, { id }, ctx: Context, info) {
    return ctx.db.query.guild({ where: { id } }, info)
  },

  async channel(parent, { id }, ctx: Context, info) {
    await isUserInChannel(ctx, id)
    return ctx.db.query.channel({ where: { id } }, info)
  },

  users(parent, args, ctx: Context, info) {
    return ctx.db.query.users({}, info)
  },

  user(parent, { id }, ctx: Context, info) {
    return ctx.db.query.user({ where: { id } }, info)
  },

  async me(parent, args, ctx: Context, info) {
    const id = await getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },
}

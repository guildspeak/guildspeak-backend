import { getUserId, Context } from '../utils'

export default {
  guilds(parent, args, ctx: Context, info) {
    return ctx.db.query.guilds({}, info)
  },

  guild(parent, { id }, ctx: Context, info) {
    return ctx.db.query.guild({ where: { id } }, info)
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

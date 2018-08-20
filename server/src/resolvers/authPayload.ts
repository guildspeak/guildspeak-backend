import { Context } from '../utils'

export default {
  user: async ({ user: { id } }, args, ctx: Context, info) => {
    return ctx.db.query.user({ where: { id } }, info)
  },
}

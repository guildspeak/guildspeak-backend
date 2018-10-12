import { getUserId, Context } from '../../utils'

export default {
  async disableAccount(parent, { disabled }, ctx: Context, info) {
    const userId = await getUserId(ctx)
    console.log(disabled)
    return ctx.db.mutation.updateUser({
      data: {
        disabled: disabled,
      },
      where: {
        id: userId,
      },
    })
  },

  async updateStatus(parent, { status }, ctx: Context, info) {
    const userId = await getUserId(ctx)
    return ctx.db.mutation.updateUser({
      data: {
        status: status,
      },
      where: {
        id: userId,
      },
    })
  },
}

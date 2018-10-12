import { getUserId, Context } from '../../utils'

export default {
  async setdisableAccount(parent, { disabled }, ctx: Context, info) {
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
}

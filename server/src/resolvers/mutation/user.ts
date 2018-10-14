import { getUserId, Context } from '../../utils'
import { hash, compare } from 'bcrypt'

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

  async changePassword(parent, { oldPassword, newPassword }, ctx: Context, info){
    const userId = await getUserId(ctx)
    const user = await ctx.db.query.user({ where: { id: userId } })
    const valid = await compare(oldPassword, user.password)
    const npassword = await hash(newPassword, 10)
    if (!valid) {
      throw new Error('Invalid password')
    }
    return ctx.db.mutation.updateUser({
      where: {
        id: userId,
      },
      data: {
        password: npassword,
      },
    })
  },
}

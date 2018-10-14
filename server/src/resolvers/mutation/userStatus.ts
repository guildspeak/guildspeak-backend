import { Context, getUserId } from '../../utils'

export default {
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

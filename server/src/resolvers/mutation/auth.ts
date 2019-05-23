import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { Context } from '../../utils'

export default {
  async register(parent, args, ctx: Context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { ...args, password },
    })

    return {
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
      user: user,
    }
  },

  async login(parent, { email, password }, ctx: Context, info) {
    let pass = password
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`No such user found for email: ${email}`)
    }
    // TODO: Change enable way!
    if (user.disabled) {
      if (pass.startsWith('!')) {
        pass = pass.substr(1)
      }
    }
    const valid = await bcrypt.compare(pass, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    if (user.disabled) {
      // TODO: Change enable way!
      if (password.startsWith('!')) {
        ctx.db.mutation.updateUser({
          data: {
            disabled: false,
          },
          where: {
            email: email,
          },
        })
      } else {
        throw new Error('Account is disabled. Please enable your account. (Temporary resolve: give "!" before your password')
      }
    }

    return {
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
      user: user,
    }
  },
}

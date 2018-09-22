import * as jwt from 'jsonwebtoken'
import { Prisma } from './generated/prisma'

export interface Context {
  db: Prisma
  request: any
}

export async function getUserId(ctx: Context) {
  const authorization = ctx.request.get('Authorization')
  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET) as { userId: string }
      const user = await ctx.db.query.user(
        {
          where: {
            id: userId,
          },
        },
        `
          {
            id
          }
        `,
      )
      if (!user) throw new Error('User not found!')
      return userId
    } catch (e) {
      throw new Error(`Session error: ${e}`)
    }
  }

  throw new Error('Not authorized')
}

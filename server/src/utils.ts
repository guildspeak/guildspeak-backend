import * as jwt from 'jsonwebtoken'
import { Prisma } from './generated/prisma'

export interface Context {
  db: Prisma
  request?: ContextRequest
  connection?: ContextConnection
}

interface ContextConnection {
  context: any
}

interface ContextRequest {
  get: (name: string) => string
}

export async function getUserId(ctx: Context) {
  const authorization = ctx.request ? ctx.request.get('Authorization') : ctx.connection.context.Authorization
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

export async function isUserInChannel(ctx: Context, channelId: string) {
  const userId = await getUserId(ctx)
  const channel = await ctx.db.query.channel({ where: { id: channelId } }, '{ guildId { users { id } } }')
  if (!channel.guildId.users.find(user => user.id === userId)) throw new Error('User not in channel')
}

export async function isUserInGuild(ctx: Context, guildId: string) {
  const userId = await getUserId(ctx)
  const guild = await ctx.db.query.guild({ where: { id: guildId } }, '{ users { id } }')
  if (!guild.users.find(user => user.id === userId)) throw new Error('User not in guild')
}

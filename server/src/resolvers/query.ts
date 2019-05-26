import { getUserId, isUserInChannel } from '../utils'
import { idArg, queryType } from 'nexus'
import { Context } from '../types'

export const Query = queryType({
  definition(t) {
    t.list.field('guilds', {
      type: 'Guild',
      resolve: async (parent, args, ctx: Context) => {
        const id = await getUserId(ctx)
        return ctx.prisma.guilds({ where: { users_some: { id } } })
      }
    })

    t.field('guild', {
      type: 'Guild',
      resolve: async (parent, args, ctx: Context) => {
        const id = await getUserId(ctx)
        return ctx.prisma.guild({ id })
      }
    })

    t.field('channel', {
      type: 'Channel',
      args: { id: idArg() },
      resolve: async (parent, { id }, ctx: Context) => {
        await isUserInChannel(ctx, id)
        return ctx.prisma.channel({ id })
      }
    })

    t.list.field('users', {
      type: 'User',
      resolve: async (parent, args, ctx: Context) => {
        return ctx.prisma.users({})
      }
    })

    t.field('user', {
      type: 'User',
      args: { id: idArg() },
      resolve: async (parent, { id }, ctx: Context) => {
        return ctx.prisma.user({ id })
      }
    })

    t.field('me', {
      type: 'User',
      resolve: async (parent, args, ctx: Context) => {
        const userId = await getUserId(ctx)
        return ctx.prisma.user({ id: userId })
      }
    })
  }
})

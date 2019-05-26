import { idArg, subscriptionField } from 'nexus'
import { isUserInChannel, isUserInGuild, getUserId } from '../utils'
import { Channel } from '../generated/prisma-client'
import { Context } from '../types'

export const channelSubscription = subscriptionField('channelSubscription', {
  type: 'Channel',
  args: { channelId: idArg() },
  async subscribe(root, { channelId }, ctx: Context) {
    await isUserInChannel(ctx, channelId)
    const channelIterator: AsyncIterator<Channel> = await ctx.prisma.$subscribe
      .channel({
        mutation_in: ['CREATED', 'UPDATED'],
        node: {
          id: channelId
        }
      })
      .node()

    return channelIterator
  },
  resolve(payload) {
    return payload
  }
})

export const guildSubscription = subscriptionField('guildSubscription', {
  type: 'Guild',
  args: { guildId: idArg() },
  async subscribe(root, { guildId }, ctx: Context) {
    await isUserInGuild(ctx, guildId)
    const guildIterator: AsyncIterator<Channel> = await ctx.prisma.$subscribe
      .guild({
        mutation_in: ['CREATED', 'UPDATED'],
        node: {
          id: guildId
        }
      })
      .node()

    return guildIterator
  },
  resolve(payload) {
    return payload
  }
})

export const guildChannelsSubscription = subscriptionField('guildChannelsSubscription', {
  type: 'Channel',
  args: { guildId: idArg() },
  async subscribe(root, { guildId }, ctx: Context) {
    const userId = await getUserId(ctx)
    const guildChannelsIterator: AsyncIterator<Channel> = await ctx.prisma.$subscribe
      .channel({
        mutation_in: ['CREATED', 'UPDATED'],
        node: {
          guildId: {
            id: guildId,
            users_some: {
              id: userId
            }
          }
        }
      })
      .node()

    return guildChannelsIterator
  },
  resolve(payload) {
    return payload
  }
})

export const guildsSubscription = subscriptionField('guildsSubscription', {
  type: 'Guild',
  args: { guildId: idArg() },
  async subscribe(root, args, ctx: Context) {
    const userId = await getUserId(ctx)
    const guildChannelsIterator: AsyncIterator<Channel> = await ctx.prisma.$subscribe
      .guild({
        mutation_in: ['CREATED', 'UPDATED'],
        node: {
          users_some: {
            id: userId
          }
        }
      })
      .node()

    return guildChannelsIterator
  },
  resolve(payload) {
    return payload
  }
})

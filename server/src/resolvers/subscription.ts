import { idArg, subscriptionField } from 'nexus'
import { getUserId } from '../utils'
import { ChannelSubscriptionPayload, GuildSubscriptionPayload } from '../generated/prisma-client'
import { Context } from '../types'

export const channelSubscription = subscriptionField('channelSubscription', {
  type: 'Channel',
  args: { id: idArg() },
  async subscribe(root, { id }, ctx: Context) {
    const channelIterator: AsyncIterator<ChannelSubscriptionPayload> = await ctx.prisma.$subscribe
      .channel({
        mutation_in: ['CREATED', 'UPDATED', 'DELETED'],
        node: {
          id: id
        }
      })
      .node()

    return channelIterator
  },
  resolve(payload) {
    return payload
  }
})

export const guildChannelsSubscription = subscriptionField('guildChannelsSubscription', {
  type: 'Channel',
  args: { id: idArg() },
  async subscribe(root, { id }, ctx: Context) {
    const channelIterator: AsyncIterator<ChannelSubscriptionPayload> = await ctx.prisma.$subscribe
      .channel({
        mutation_in: ['CREATED', 'UPDATED', 'DELETED'],
        node: {
          guildId: {
            id: id
          }
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
  args: { id: idArg() },
  async subscribe(root, { id }, ctx: Context) {
    // const userId = await getUserId(ctx)
    const guildIterator: AsyncIterator<GuildSubscriptionPayload> = await ctx.prisma.$subscribe
      .guild({
        mutation_in: ['CREATED', 'UPDATED', 'DELETED'],
        node: {
          id: id
          // users_some: {
          //   id: userId
          // }
        }
      })
      .node()

    return guildIterator
  },
  resolve(payload) {
    return payload
  }
})

export const guildsSubscription = subscriptionField('guildsSubscription', {
  type: 'Guild',
  args: { guildId: idArg() },
  async subscribe(root, args, ctx: Context) {
    // const userId = await getUserId(ctx)
    const guildChannelsIterator: AsyncIterator<GuildSubscriptionPayload> = await ctx.prisma.$subscribe
      .guild({
        mutation_in: ['CREATED', 'UPDATED', 'DELETED'],
        node: {
          // users_some: {
          //   id: userId
          // }
        }
      })
      .node()

    return guildChannelsIterator
  },
  resolve(payload) {
    return payload
  }
})

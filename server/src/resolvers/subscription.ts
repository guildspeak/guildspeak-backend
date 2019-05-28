import { idArg, subscriptionField } from 'nexus'
import { getUserId } from '../utils'
import { ChannelSubscriptionPayload, GuildSubscriptionPayload } from '../generated/prisma-client'
import { Context } from '../types'

export const channelSubscription = subscriptionField('channelSubscription', {
  type: 'Channel',
  args: { channelId: idArg() },
  async subscribe(root, { channelId }, ctx: Context) {
    const channelIterator: AsyncIterator<ChannelSubscriptionPayload> = await ctx.prisma.$subscribe
      .channel({
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
    const guildIterator: AsyncIterator<GuildSubscriptionPayload> = await ctx.prisma.$subscribe
      .guild({
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
    const guildChannelsIterator: AsyncIterator<ChannelSubscriptionPayload> = await ctx.prisma.$subscribe
      .channel({
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
    const guildChannelsIterator: AsyncIterator<GuildSubscriptionPayload> = await ctx.prisma.$subscribe
      .guild({
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

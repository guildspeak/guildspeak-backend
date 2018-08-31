import { getUserId, Context } from '../../utils'

export default {
  async createMessage(parent, { channelId, content }, ctx: Context, info) {
    const userId = getUserId(ctx)
    const guild = await ctx.db.query.guilds(
      { where: { channels_some: { id: channelId } } },
      `
      {
        users {
          id
        }
      }
      `,
    )
    if (!guild[0].users.find(user => user.id === userId)) throw new Error('User not in guild')
    const result = await ctx.db.mutation.createMessage(
      {
        data: {
          content: content,
          author: {
            connect: {
              id: userId,
            },
          },
          channelId: {
            connect: {
              id: channelId,
            },
          },
        },
      },
      info,
    )
    await ctx.db.mutation.updateChannel({
      data: {
        lastMessage: new Date(),
      },
      where: {
        id: channelId,
      },
    })
    return result
  },
  async deleteMessage(parent, {messageId}, ctx: Context, info){
    const userId = getUserId(ctx)
    const message = await ctx.db.query.message({
      where: {
        id: messageId
      }
    }, 
    `{
       author {
         id
       }
     }`)
     if(!(message.author.id === userId)) throw new Error(`You aren't owner of this message`)
     await ctx.db.mutation.deleteMessage({
       where: {
         id: messageId
       }
     })
     return message
  }
}

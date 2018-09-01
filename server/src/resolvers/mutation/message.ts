import { getUserId, Context } from '../../utils'
import { Message, User, ID_Input } from '../../generated/prisma'

const modifyUserMessage = async (ctx: Context, userId: ID_Input, messageId: ID_Input,
                                 callback: (ctx: Context, message: Message) => Message) => {
  const message = await ctx.db.query.messages(
    {
      where: {
        id: messageId,
        author: {
          id: userId,
        },
      },
    },
 )
  if (!message.length) throw new Error(`You are not the author of this message`)

  callback(ctx, message[0])

}

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
  async deleteMessage(parent, { messageId }, ctx: Context, info) : Promise<Message> {

    const userId = getUserId(ctx)

    if (!isUserMessage(ctx, userId, messageId)) throw new Error(`You are not the author of this message`)

    const result : Message = await ctx.db.mutation.deleteMessage(
      {
        where: {
          id: messageId,
        },
      },
      info,
   )
    return result
  },
  async editMessage(parent, { messageId }, ctx: Context, info) : Promise<Message> {
    const userId = getUserId(ctx)

    if(isUserMessage(ctx, userId, messageId)) thro
  }
}

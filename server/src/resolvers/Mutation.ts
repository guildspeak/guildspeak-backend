import { stringArg, idArg, mutationType, arg, booleanArg } from 'nexus'
import { getUserId, isUserInChannel, isUserInGuild } from '../utils'
import { sign } from 'jsonwebtoken'
import { hash, compare } from 'bcrypt'
import { Context } from '../types'
import { Message, ID_Input, UserStatus } from '../generated/prisma-client'

const modifyUserMessage = async (
  ctx: Context,
  userId: ID_Input,
  messageId: ID_Input,
  callback: (ctx: Context, message: Message) => Promise<Message>
): Promise<Message> => {
  const message = await ctx.prisma.messages({
    where: {
      id: messageId,
      author: {
        id: userId
      }
    }
  })
  if (!message.length) throw new Error('You are not the author of this message')

  return await callback(ctx, message[0])
}

export const Mutation = mutationType({
  definition(t) {
    // Auth
    t.field('register', {
      type: 'AuthPayload',
      args: {
        username: stringArg(),
        email: stringArg(),
        password: stringArg()
      },
      resolve: async (parent, { username, email, password }, ctx: Context) => {
        const hashedPassword = await hash(password, 10)
        const user = await ctx.prisma.createUser({
          username,
          email,
          password: hashedPassword
        })
        return {
          token: sign({ userId: user.id }, process.env.JWT_SECRET),
          user: user
        }
      }
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg(),
        password: stringArg()
      },
      resolve: async (parent, { email, password }, ctx: Context) => {
        const user = await ctx.prisma.user({ email })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        if (user.disabled) {
          // TODO: Change enable way!
          if (password.startsWith('!')) {
            ctx.prisma.updateUser({
              data: {
                disabled: false
              },
              where: {
                email: email
              }
            })
          } else {
            throw new Error(
              'Account is disabled. Please enable your account. (Temporary resolve: give "!" before your password'
            )
          }
        }
        return {
          token: sign({ userId: user.id }, process.env.JWT_SECRET),
          user: user
        }
      }
    })
    // User
    t.field('updateStatus', {
      type: 'User',
      args: { status: arg({ type: 'UserStatus' }) },
      resolve: async (parent, args, ctx: Context) => {
        const status = args.status as UserStatus
        const userId = await getUserId(ctx)
        return ctx.prisma.updateUser({
          data: {
            status: status
          },
          where: {
            id: userId
          }
        })
      }
    })

    t.field('disableAccount', {
      type: 'User',
      args: { disabled: booleanArg() },
      resolve: async (parent, { disabled }, ctx: Context) => {
        const userId = await getUserId(ctx)
        return ctx.prisma.updateUser({
          data: {
            disabled: (disabled as unknown) as boolean
          },
          where: {
            id: userId
          }
        })
      }
    })

    t.field('changePassword', {
      type: 'User',
      args: {
        oldPassword: stringArg(),
        newPassword: stringArg()
      },
      resolve: async (parent, { oldPassword, newPassword }, ctx: Context) => {
        const userId = await getUserId(ctx)
        const user = await ctx.prisma.user({ id: userId })
        const valid = await compare(oldPassword, user.password)
        const npassword = await hash(newPassword, 10)
        if (!valid) {
          throw new Error('Invalid password')
        }
        return await ctx.prisma.updateUser({
          where: {
            id: userId
          },
          data: {
            password: npassword
          }
        })
      }
    })

    // Message
    t.field('createMessage', {
      type: 'Message',
      args: {
        channelId: idArg(),
        content: stringArg()
      },
      resolve: async (parent, { channelId, content }, ctx: Context) => {
        const userId = await getUserId(ctx)
        const result = await ctx.prisma.createMessage({
          content: content,
          author: {
            connect: {
              id: userId
            }
          },
          channelId: {
            connect: {
              id: channelId
            }
          }
        })
        await ctx.prisma.updateChannel({
          data: {
            lastMessage: new Date()
          },
          where: {
            id: channelId
          }
        })
        return result
      }
    })

    t.field('deleteMessage', {
      type: 'Message',
      args: {
        messageId: idArg()
      },
      resolve: async (parent, { messageId }, ctx: Context) => {
        // TODO: check if deletes only for logged user
        const result: Message = await ctx.prisma.deleteMessage({
          id: messageId
        })

        return result
      }
    })

    t.field('editMessage', {
      type: 'Message',
      args: {
        messageId: idArg(),
        newContent: stringArg()
      },
      resolve: async (parent, { messageId, newContent }, ctx: Context) => {
        const result: Message = await ctx.prisma.updateMessage({
          data: {
            content: newContent
          },
          where: {
            id: messageId
          }
        })

        return result
      }
    })
    // Guild
    t.field('createGuild', {
      type: 'Guild',
      args: {
        name: stringArg()
      },
      resolve: async (parent, { name }, ctx: Context) => {
        const userId = await getUserId(ctx)
        return await ctx.prisma.createGuild({
          name: name,
          author: {
            connect: {
              id: userId
            }
          },
          users: {
            connect: {
              id: userId
            }
          },
          channels: {
            create: {
              name: 'general',
              author: {
                connect: {
                  id: userId
                }
              }
            }
          }
        })
      }
    })

    t.field('joinGuild', {
      type: 'Guild',
      args: {
        guildId: idArg()
      },
      resolve: async (parent, { guildId }, ctx: Context) => {
        const userId = await getUserId(ctx)
        return await ctx.prisma.updateGuild({
          data: {
            users: {
              connect: {
                id: userId
              }
            }
          },
          where: {
            id: guildId
          }
        })
      }
    })

    t.field('renameGuild', {
      type: 'Guild',
      args: {
        guildId: idArg(),
        newName: stringArg()
      },
      resolve: async (parent, { guildId, newName }, ctx: Context) => {
        const userId = await getUserId(ctx)
        const guild = ctx.prisma.guild({ id: guildId })
        const author = await guild.author()

        if (author.id !== userId) throw new Error("That's not your guild!")
        return await ctx.prisma.updateGuild({ where: { id: guildId }, data: { name: newName } })
      }
    })

    // Channel
    t.field('createChannel', {
      type: 'Channel',
      args: {
        guildId: idArg(),
        name: stringArg()
      },
      resolve: async (parent, { name, guildId }, ctx: Context) => {
        const userId = await getUserId(ctx)
        return await ctx.prisma.createChannel({
          name: name,
          guildId: {
            connect: {
              id: guildId
            }
          },
          author: {
            connect: {
              id: userId
            }
          }
        })
      }
    })

    t.field('renameChannel', {
      type: 'Channel',
      args: {
        channelId: idArg(),
        newName: stringArg()
      },
      resolve: async (parent, { channelId, newName }, ctx: Context) => {
        const userId = await getUserId(ctx)
        const channel = ctx.prisma.channel({ id: channelId })
        const author = await channel.author()

        if (author.id !== userId) throw new Error("That's not your channel!")
        return await ctx.prisma.updateChannel({ where: { id: channelId }, data: { name: newName } })
      }
    })
  }
})

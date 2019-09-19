import { prismaObjectType } from 'nexus-prisma'

export const User = prismaObjectType({
  name: 'User',
  definition(t) {
    t.prismaFields([
      'id',
      'username',
      'email',
      'createdAt',
      'updatedAt',
      {
        name: 'messages',
        args: [] // remove the arguments from the `messages` field of the `User` type in the Prisma schema
      },
      {
        name: 'createdGuilds',
        args: []
      },
      {
        name: 'guilds',
        args: []
      },
      {
        name: 'channels',
        args: []
      },
      'lastSeen',
      'disabled'
    ])
  }
})

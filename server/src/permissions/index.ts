import { rule, shield } from 'graphql-shield'
import { getUserId } from '../utils'
import { Context } from '../types'

const rules = {
  isAuthenticatedUser: rule()((parent, args, context: Context) => {
    const userId = getUserId(context)
    return Boolean(userId)
  }),
  isMessageOwner: rule()(async (parent, { id }, context: Context) => {
    const userId = getUserId(context)
    const author = await context.prisma.message({ id }).author()
    // @ts-ignore
    return userId === author.id
  })
}
// WIP
export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    guilds: rules.isAuthenticatedUser,
    guild: rules.isAuthenticatedUser,
    channel: rules.isAuthenticatedUser,
    users: rules.isAuthenticatedUser,
    userrules: rules.isAuthenticatedUser
  },
  Mutation: {
    updateStatus: rules.isAuthenticatedUser,
    disableAccount: rules.isAuthenticatedUser,
    changePassword: rules.isAuthenticatedUser,
    createMessage: rules.isMessageOwner,
    deleteMessage: rules.isMessageOwner,
    editMessage: rules.isMessageOwner,
    createGuild: rules.isAuthenticatedUser,
    joinGuild: rules.isAuthenticatedUser
  }
})

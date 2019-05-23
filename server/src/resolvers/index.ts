import query from './query'
import auth from './mutation/auth'
import authPayload from './authPayload'
import message from './mutation/message'
import guild from './mutation/guild'
import channel from './mutation/channel'
import subscription from './subscription'
import user from './mutation/user'
import userStatus from './mutation/userStatus'

export default {
  Query: query,
  Mutation: {
    ...auth,
    ...message,
    ...guild,
    ...channel,
    ...user,
    ...userStatus,
  },
  Subscription: {
    ...subscription,
  },
  AuthPayload: authPayload,
}

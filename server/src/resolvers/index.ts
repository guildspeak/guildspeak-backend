import query from './query'
import auth from './mutation/auth'
import authPayload from './authPayload'
import message from './mutation/message'
import guild from './mutation/guild'
import channel from './mutation/channel'
import subscription from './subscription'

export default {
  Query: query,
  Mutation: {
    ...auth,
    ...message,
    ...guild,
    ...channel,
  },
  Subscription: subscription,
  AuthPayload: authPayload,
}

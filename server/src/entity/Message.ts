import { prop, Typegoose, Ref } from 'typegoose'
import User from './User'
import Channel from './Channel'

export default class Message extends Typegoose {
  @prop({ required: true })
  createdAt: string

  @prop()
  updatedAt: string

  @prop({ required: true })
  content: string

  @prop({ ref: User, required: true })
  createdBy: Ref<User>

  @prop({ ref: 'Channel', required: true })
  channelId: Ref<Channel>

}

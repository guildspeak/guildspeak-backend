
import { prop, arrayProp, Typegoose, Ref } from 'typegoose'
import User from './User'
import Message from './Message'
import Guild from './Guild'

export default class Channel extends Typegoose {
  @prop({ required: true })
  name: string

  @arrayProp({ itemsRef: User })
  users: Ref<User>[]

  @prop({ required: true })
  createdAt: string

  @prop({ ref: User, required: true })
  createdBy: Ref<User>

  @prop({ ref: Guild, required: true })
  guildId: Ref<Guild>

  @arrayProp({ itemsRef: Message })
  messages: Ref<Message>[]

}

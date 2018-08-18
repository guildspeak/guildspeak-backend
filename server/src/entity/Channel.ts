
import { prop, arrayProp, Typegoose, Ref } from 'typegoose'
import User from './User'
import Message from './Message'

export default class Channel extends Typegoose {
  @prop({ required: true })
  name: string

  @arrayProp({ itemsRef: User })
  users: Ref<User>[]

  @prop({ required: true })
  createdAt: string

  @prop({ ref: User, required: true })
  createdBy: Ref<User>

  @arrayProp({ itemsRef: Message })
  messages: Ref<Message>[]

}

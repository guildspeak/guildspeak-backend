import { prop, Typegoose, Ref } from 'typegoose'
import User from './User'

export default class Message extends Typegoose {
  @prop({ required: true })
  createdAt: string

  @prop()
  updatedAt: string

  @prop({ required: true })
  content: string

  @prop({ ref: User, required: true })
  createdBy: Ref<User>

}


import { prop, arrayProp, Typegoose, Ref } from 'typegoose'
import User from './User'
import Channel from './Channel'

export default class Guild extends Typegoose {
  @prop({ unique: true, required: true })
  name: string

  @prop({ ref: User, required: true })
  createdBy: Ref<User>

  @prop({ required: true })
  createdAt: string

  @arrayProp({ itemsRef: User, required: true })
  users: Ref<User>[]

  @arrayProp({ itemsRef: Channel, required: true })
  channels: Ref<Channel>[]

}

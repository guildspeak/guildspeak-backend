
import { prop, arrayProp, Typegoose, Ref } from 'typegoose'
import User from './User'

export default class Channel extends Typegoose {
  @prop({ required: true })
  name: string

  @arrayProp({ itemsRef: User, required: true })
  users: Ref<User>[]

}

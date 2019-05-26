import * as jwt from 'jsonwebtoken'
import { $$asyncIterator } from 'iterall'
import { Context } from './types'

export async function getUserId(ctx: Context) {
  const authorization = ctx.request.get('Authorization')
  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string
      }
      const user = await ctx.prisma.user({
        id: userId
      })
      if (!user.id) throw new Error('User not found!')
      return userId
    } catch (e) {
      throw new Error(`Session error: ${e}`)
    }
  }

  throw new Error('Not authorized')
}

export async function isUserInChannel(ctx: Context, channelId: string) {
  const userId = await getUserId(ctx)
  const channel = ctx.prisma.channel({ id: channelId })
  const users = await channel.guildId().users()

  if (!users.find(user => user.id === userId)) throw new Error('User not in channel')
}

export async function isUserInGuild(ctx: Context, guildId: string) {
  const userId = await getUserId(ctx)
  const guild = ctx.prisma.guild({ id: guildId })
  const users = await guild.users()

  if (!users.find(user => user.id === userId)) {
    throw new Error('User not in guild')
  }
}

/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
export default function mapAsyncIterator<T, U>(
  iterator: AsyncIterator<T>,
  callback: (value: T) => Promise<U> | U,
  rejectCallback?: any
): AsyncIterator<U> {
  let $return: any
  let abruptClose: any

  if (typeof iterator.return === 'function') {
    $return = iterator.return
    abruptClose = (error: any) => {
      const rethrow = () => Promise.reject(error)
      return $return.call(iterator).then(rethrow, rethrow)
    }
  }

  function mapResult(result: any) {
    return result.done ? result : asyncMapValue(result.value, callback).then(iteratorResult, abruptClose)
  }

  let mapReject: any
  if (rejectCallback) {
    // Capture rejectCallback to ensure it cannot be null.
    const reject = rejectCallback
    mapReject = (error: any) => asyncMapValue(error, reject).then(iteratorResult, abruptClose)
  }

  return {
    next() {
      return iterator.next().then(mapResult, mapReject)
    },
    return() {
      return $return ? $return.call(iterator).then(mapResult, mapReject) : Promise.resolve({ value: undefined, done: true })
    },
    throw(error: any) {
      if (typeof iterator.throw === 'function') {
        return iterator.throw(error).then(mapResult, mapReject)
      }
      return Promise.reject(error).catch(abruptClose)
    },
    // tslint:disable-next-line: function-name
    [$$asyncIterator]() {
      return this
    }
  } as any
}

function asyncMapValue<T, U>(value: T, callback: (value: T) => Promise<U> | U): Promise<U> {
  return new Promise(resolve => resolve(callback(value)))
}

function iteratorResult<T>(value: T): IteratorResult<T> {
  return { value, done: false }
}

import { dbConnURI } from './utils'
import mongoose from 'mongoose'
import consola from 'consola'

async function connection() {
  try {
    const connection = await mongoose.connect(dbConnURI, { useNewUrlParser: true })
    consola.success('Connected to database')
    return connection
  } catch (error) {
    consola.error(error)
    process.exit(1)
  }
}

export default connection

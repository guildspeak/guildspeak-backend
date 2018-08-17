let dbConnURI = ''
if (process.env.NODE_ENV === 'production') {
  dbConnURI = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
} else {
  dbConnURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
}
export { dbConnURI }

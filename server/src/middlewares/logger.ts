import { IncomingMessage, ServerResponse } from 'http'
import consola from 'consola'
import chalk from 'chalk'

export default () => function (req: IncomingMessage, res: ServerResponse, next) {
  if (res.headersSent) {
    coloredOutput(req, res)
  } else {
    res.on('finish', () => {
      coloredOutput(req, res)
    })
  }
  next()
}

function coloredOutput(req: IncomingMessage, res: ServerResponse) {
  let methodColor = 'grey'
  let statusColor = 'bgBlackBright'

  if (req.method === 'GET') {
    methodColor = 'cyan'
  } else if (req.method === 'POST') {
    methodColor = 'green'
  } else if (req.method === 'PATCH') {
    methodColor = 'yellow'
  } else if (req.method === 'DELETE') {
    methodColor = 'red'
  }

  if (res.statusCode >= 200 && res.statusCode <= 226) {
    statusColor = 'bgGreen'
  } else if (res.statusCode >= 300 && res.statusCode <= 308) {
    statusColor = 'bgYellow'
  } else if (res.statusCode >= 400 && res.statusCode <= 511) {
    statusColor = 'bgRed'
  }

  consola.info(chalk`{${methodColor}.bold [${req.method}]} {italic ${req.url}} {${statusColor}.bold ${res.statusCode.toString()} ${res.statusMessage}} from ${req.connection.remoteAddress}`)
}

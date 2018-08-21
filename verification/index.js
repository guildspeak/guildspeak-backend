require('dotenv').config()
const app = require('fastify')()
const randomstring = require('randomstring')
const mail = require('nodemailer').createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})
let pending = []

app.post('/send', (req, res) => {
  if (!req.body.secret || req.body.secret !== process.env.SECRET) return res.code(401).type('text/html').send('<h1>Unauthorized</h1>')
  const verification = randomstring.generate(32)
  pending.push({ username: req.body.username, verification })
  mail.sendMail({
    from: process.env.SMTP_FROM,
    to: req.body.mail,
    subject: 'Guildspeak account verification',
    text: `Hey ${req.body.username},
You need to verify your Guildspeak account by clicking the link here:
${process.env.ENDPOINT}/verify?key=${verification}`
  }, (err, info) => {
    if (err) res.code(400).type('application/json').send({ error: err })
    else res.send(info)
  })
})

app.get('/verify', (req, res) => {
  if (!pending.find(el => el.verification === req.query.key)) res.code(404).type('text/html').send('<h1>Not found</h1>')
  pending = pending.filter(el => el.verification !== req.query.key)
  res.type('text/html').send('Verified correctly.')
  // TODO: send information to the server
})

app.listen(process.env.PORT || 4004, (err, addr) => console.log(err || 'Listening on ' + addr))

# guildspeak-backend-verification

- Copy .env.example to .env, fill with data
- Make sure the secret in .env is the same as in backend's .env "MAILER_SECRET"
- `npm install`
- `npm start`

**Endpoints:**
- `POST /send`
- Example JSON body:
```json
{
  "secret": "MAILER_SECRET env variable",
  "mail": "User's email",
  "username": "User's name"
}
```

- `GET /verify`
- Query params:
- key=random_string
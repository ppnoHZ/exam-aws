# Node.js Email API

A minimal Express API that sends email using Nodemailer and SMTP.

Endpoints

- POST /send
  - JSON body: { to, subject, text, html }
  - Response: { ok: true, messageId, raw }

Setup

1. Copy `.env.example` to `.env` and fill your SMTP values.

2. Install dependencies and start the server:

```bash
npm install
npm start
```

3. Example curl (replace recipient address):

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"to":"recipient@example.com","subject":"Hello","text":"Test email"}'
```

Notes

- This example uses SMTP credentials. You can adapt the transporter in `src/index.js` to use AWS SES or other transports supported by Nodemailer.
- For production, secure your environment variables and consider rate limiting and authentication on the endpoint.

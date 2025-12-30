require('dotenv').config();
const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Simple transporter factory that uses SMTP environment variables
function createTransporterFromEnv() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || false; // default false

  if (!host || !port) return null;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });

  return transporter;
}

app.post('/send',
  // validation
  body('to').isEmail().withMessage('to must be a valid email'),
  body('subject').isString().optional(),
  body('text').isString().optional(),
  body('html').isString().optional(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { to, subject = '', text = '', html } = req.body;

    const transporter = createTransporterFromEnv();
    if (!transporter) {
      return res.status(500).json({ error: 'SMTP configuration missing. See .env.example' });
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_FROM || 'no-reply@example.com',
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return res.json({ ok: true, messageId: info.messageId, raw: info });
    } catch (err) {
      console.error('sendMail error:', err);
      return res.status(502).json({ error: 'Failed to send email', detail: err && err.message });
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Email API listening on port ${PORT}`);
});

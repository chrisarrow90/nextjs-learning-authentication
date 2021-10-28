import { connectToDatabase } from '../../../lib/db'
import { hashPassword } from '../../../lib/auth'

function handler(req, res) {
  const { email, password } = req.body.data

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    res.status(422).json({ message: 'Invalid input' })
  }

  const client = await connectToDatabase()
  const db = client.db()

  const hashedPassword = hashPassword(password)

  const result = await db.collection('users').insertOne({
    email,
    password: hashedPassword
  })

  res.status(201).json({ message: 'Created user' })
}

export default handler

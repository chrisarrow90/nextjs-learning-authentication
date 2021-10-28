import { connectToDatabase } from '../../../lib/db'
import { hashPassword } from '../../../lib/auth'

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body

    if (!email || !email.includes('@') || !password || password.trim().length < 7) {
      res.status(422).json({ message: 'Invalid email or password' })
    }

    const client = await connectToDatabase()
    const db = client.db()

    const existingUser = await db.collection('users').findOne({ email: email })

    if (existingUser) {
      res.status(422).json({ message: 'User with that email address already exists' })
      client.close()
      return
    }

    const hashedPassword = await hashPassword(password)

    await db.collection('users').insertOne({
      email,
      password: hashedPassword
    })

    res.status(201).json({ message: 'Created user' })
    client.close()
  }
}

export default handler

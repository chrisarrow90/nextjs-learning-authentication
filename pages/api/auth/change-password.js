import { getSession } from 'next-auth/client'
import { connectToDatabase } from '../../../lib/db'
import { verifyPassword, hashPassword } from '../../../lib/auth'

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return
  }

  const session = await getSession({ req })

  if (!session) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  const userEmail = session.user.email
  const { oldPassword, newPassword } = req.body

  const client = await connectToDatabase()

  const usersCollection = await client.db().collection('users')

  const foundUser = await usersCollection.findOne({ email: userEmail })

  if (!foundUser) {
    client.close()
    res.status(404).json({ message: 'User not found' })
    return
  }

  const currentPassword = foundUser.password

  const validPassword = await verifyPassword(oldPassword, currentPassword)

  if (!validPassword) {
    client.close()
    res.status(403).json({ message: 'Invalid password' })
    return
  }

  const hashedPassword = await hashPassword(newPassword)

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  )

  client.close()

  res.status(200).json({ message: 'Password updated' })
}

export default handler

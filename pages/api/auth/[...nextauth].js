import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { verifyPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'

export default NextAuth({
  session: {
    jwt: true
  },
  providers: [
    Providers.Credentials({
      credentials: {
        async authorize(credentials) {
          const client = await connectToDatabase()

          const usersCollection = client.db().collection('users')

          const foundUser = await usersCollection.findOne({ email: credentials.email })

          if (!foundUser) {
            client.close()
            throw new Error('Invalid username or password')
          }

          const isValidPassword = await verifyPassword(credentials.password, foundUser.password)

          if (!isValidPassword) {
            client.close()
            throw new Error('Invalid username or password')
          }
          client.close()

          return { email: foundUser.email }
        }
      }
    })
  ]
})

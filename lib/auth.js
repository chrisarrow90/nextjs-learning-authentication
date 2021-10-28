import { hash } from 'bcryptjs'

export async function hashPassword(password) {
  const hashedPassword = await hash(pasword, 12)
  return hashedPassword
}

import bcrypt from 'bcryptjs'
import { signToken, ConflictError, UnauthorizedError } from '@collab/shared'
import prisma from '../prisma'
import { RegisterInput, LoginInput } from '../validators/auth.validators'

export const registerUser = async (data: RegisterInput) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  })

  if (existing) {
    const field = existing.email === data.email ? 'Email' : 'Username'
    throw new ConflictError(`${field} is already taken`)
  }

  const hashed = await bcrypt.hash(data.password, 12)

  const user = await prisma.user.create({
    data: { email: data.email, username: data.username, password: hashed },
  })

  const token = signToken({ userId: user.id, email: user.email, username: user.username })

  return { token, user: { id: user.id, email: user.email, username: user.username } }
}

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } })

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const token = signToken({ userId: user.id, email: user.email, username: user.username })

  return { token, user: { id: user.id, email: user.email, username: user.username } }
}
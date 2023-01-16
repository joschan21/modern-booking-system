import { jwtVerify, SignJWT } from 'jose'
import { nanoid } from 'nanoid'
import type { NextResponse } from 'next/server'

interface UserJwtPayload {
  jti: string
  iat: number
}

export function getJwtSecretKey(): string {
  const secret = process.env.JWT_SECRET_KEY

  if (!secret || secret.length === 0) {
    throw new Error('The environment variable JWT_SECRET_KEY is not set.')
  }

  return secret
}

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()))
    return verified.payload as UserJwtPayload
  } catch (err) {
    throw new Error('Your token has expired.')
  }
}

/**
 * Adds the user token cookie to a response.
 */
export async function setUserCookie(res: NextResponse) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(getJwtSecretKey()))

  res.cookies.set('user-token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hours in seconds
  })

  return res
}

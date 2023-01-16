import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { prisma } from '../db/client'

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  return {
    req,
    res,
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>

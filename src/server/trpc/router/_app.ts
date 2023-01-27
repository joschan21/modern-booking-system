import { router } from '../trpc'
import { adminRouter } from './admin'
import { checkoutRouter } from './checkout'
import { menuRouter } from './menu'
import { openingRouter } from './opening'

export const appRouter = router({
  admin: adminRouter,
  menu: menuRouter,
  opening: openingRouter,
  checkout: checkoutRouter
})

// export type definition of API
export type AppRouter = typeof appRouter

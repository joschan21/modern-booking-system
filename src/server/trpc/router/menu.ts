import { publicProcedure, router } from '../trpc'
import { s3 } from '@lib/s3'
import { z } from 'zod'

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const menuRouter = router({
  /**
   * Method for getting all menu items
   * @returns an array of all menu items with their image url
   */

  getMenuItems: publicProcedure.query(async ({ ctx }) => {
    const menuItems = await ctx.prisma.menuItem.findMany()

    // Each menu items only contains its AWS key. Extend all items with their actual img url
    const withUrls = await Promise.all(
      menuItems.map(async (menuItem) => {
        return {
          ...menuItem,
          url: await s3.getSignedUrlPromise('getObject', {
            Bucket: 'youtube-booking-software',
            Key: menuItem.imageKey,
          }),
        }
      })
    )

    return withUrls
  }),

  /**
   * Method for fetching all items in users cart
   * @returns an array of all menu items in the users cart with their image url
   */

  getCartItems: publicProcedure
    .input(z.array(z.object({ id: z.string(), quantity: z.number() })))
    .query(async ({ ctx, input }) => {
      const menuItems = await ctx.prisma.menuItem.findMany({
        where: {
          id: {
            in: input.map((item) => item.id),
          },
        },
      })

      // Each menu items only contains its AWS key. Extend all items with their actual img url
      const withUrls = await Promise.all(
        menuItems.map(async (menuItem) => {
          return {
            ...menuItem,
            url: await s3.getSignedUrlPromise('getObject', {
              Bucket: 'youtube-booking-software',
              Key: menuItem.imageKey,
            }),
            quantity: input.find((item) => item.id === menuItem.id)?.quantity,
          }
        })
      )

      return withUrls
    }),

  /**
   * Method for checking the validity of the user time & date selection
   * @returns boolean indicating if the user selection is valid
   */

  checkMenuStatus: publicProcedure.query(async () => {
    // Mock menu checking logic
    await sleep(1000)

    return true
  }),
})

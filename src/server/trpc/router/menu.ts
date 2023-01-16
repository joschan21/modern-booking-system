import { publicProcedure, router } from '../trpc'
import { s3 } from '@lib/s3'

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
   * Method for checking the validity of the user time & date selection
   * @returns boolean indicating if the user selection is valid
   */

  checkMenuStatus: publicProcedure.query(async () => {
    // Mock menu checking logic
    await sleep(1000)

    return true
  }),
})

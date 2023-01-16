import { adminProcedure, router } from '../trpc'
import { z } from 'zod'
import { formatISO } from 'date-fns'

export const openingRouter = router({
  /**
   * Method for changing opening hours for a specific day
   * @expects an array all days with their new opening hours
   * @returns an array of all updated days
   */

  changeOpeningHours: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          openTime: z.string(),
          closeTime: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const results = await Promise.all(
        input.map(async (day) => {
          const updatedDay = await ctx.prisma.day.update({
            where: {
              id: day.id,
            },
            data: {
              closeTime: day.closeTime,
              openTime: day.openTime,
            },
          })

          return updatedDay
        })
      )

      return results
    }),

  /**
   * Method for closing a day, so no appointments can be made
   * @param date Date to close
   */

  closeDay: adminProcedure.input(z.object({ date: z.date() })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.closedDay.create({
      data: {
        date: input.date,
      },
    })
  }),

  /**
   * Method to open a previously closed day, so appointments can be made
   * @param date Date to open
   */

  openDay: adminProcedure.input(z.object({ date: z.date() })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.closedDay.delete({
      where: {
        date: input.date,
      },
    })
  }),

  /**
   * Method to get all closed days
   * @returns Array of dates in ISO format
   * @example ['2023-01-18T09:00:00.000Z', '2023-01-19T09:00:00.000Z']
   */

  getClosedDays: adminProcedure.query(async ({ ctx }) => {
    const closedDays = await ctx.prisma.closedDay.findMany()

    return closedDays.map((d) => formatISO(d.date))
  }),
})

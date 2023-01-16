import CalendarComponent from '@components/Calendar'
import type { Day } from '@prisma/client'
import { formatISO } from 'date-fns'
import { type NextPage } from 'next'
import Head from 'next/head'
import { prisma } from '../server/db/client'

interface HomeProps {
  days: Day[]
  closedDays: string[] // as ISO string
}

const Home: NextPage<HomeProps> = ({ days, closedDays }) => {
  return (
    <>
      <Head>
        <title>Booking Software</title>
        <meta name='description' content='by josh' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <CalendarComponent days={days} closedDays={closedDays} />
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const days = await prisma.day.findMany()
  const closedDays = (await prisma.closedDay.findMany()).map((d) => formatISO(d.date))
  return { props: { days, closedDays } }
}

export default Home

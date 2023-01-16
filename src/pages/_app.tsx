import { ChakraProvider } from '@chakra-ui/react'
import { type AppType } from 'next/app'
import { trpc } from 'src/utils/trpc'

import '../components/Calendar.css'
import '../styles/globals.css'
import '../styles/Spinner.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default trpc.withTRPC(MyApp)

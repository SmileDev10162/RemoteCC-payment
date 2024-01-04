import React from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import Explorer from './components/Explorer'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000 }
  }
})

export default function S3Browser () {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Explorer />
      </QueryClientProvider>
    </ChakraProvider>
  )
}
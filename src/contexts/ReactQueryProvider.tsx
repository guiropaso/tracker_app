'use client'
import React from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})


export default function ReactQueryProvider({children}:{children: React.ReactNode}) {
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

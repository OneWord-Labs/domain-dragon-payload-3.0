'use client'
import React, { FC, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const ReactQueryProvider:FC<{children?: React.ReactNode}> = ({ children }) => {
  const [client] = useState(new QueryClient())

  return (
    <>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
      <ToastContainer position="bottom-center" icon={false} />
    </>
  )
}

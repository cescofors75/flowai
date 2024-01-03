import React from 'react'
import './globals.css'

import { ChakraProvider } from '@chakra-ui/react'
import localFont from 'next/font/local'
const myFont = localFont({ src: '../fonts/GeistMono-Medium.otf' })



export const metadata = {
  title: 'Assitant Comunity',
  description: 'A simple, hackable & minimalistic starter for Gridsome that uses Markdown for content.',
}

export default function RootLayout({ children }) {
  return (
 
    <html lang="es">
      <body >
      <ChakraProvider>
    <div className={`${myFont.className} ${"container"}`} style={{ margin: 'auto', fontWeight: '400' }}>
      {children}
    </div>
    </ChakraProvider>
    </body>
  </html>
    
  
  )
}

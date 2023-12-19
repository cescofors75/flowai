import React from 'react'
import './globals.css'
import { Roboto } from 'next/font/google'
//import { ChakraProvider } from '@chakra-ui/react'
import localFont from 'next/font/local'
const myFont = localFont({ src: '../fonts/GeistMono-Medium.otf' })

const inter = Roboto({ weight: '400',subsets: ['latin'] })

export const metadata = {
  title: 'ImageToFacil',
  description: 'Explicación de imágenes para personas',
}

export default function RootLayout({ children }) {
  return (
 
    <html lang="es">
      <body >
      
    <div className={`${myFont.className} ${"container"}`} style={{ margin: 'auto', fontWeight: '400' }}>
      {children}
    </div>
    </body>
  </html>
    
  
  )
}

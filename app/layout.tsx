import React from 'react'
import './globals.css'
import { Roboto } from 'next/font/google'
//import { ChakraProvider } from '@chakra-ui/react'

const inter = Roboto({ weight: '400',subsets: ['latin'] })

export const metadata = {
  title: 'ImageToFacil',
  description: 'Explicación de imágenes para personas',
}

export default function RootLayout({ children }) {
  return (
 
    <html lang="es">
    <div className={`inter ${"container"}`} style={{ margin: 'auto', fontWeight: '400' }}>
      {children}
    </div>
  </html>
    
  
  )
}

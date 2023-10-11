import React from 'react'
import './globals.css'
import { Roboto } from 'next/font/google'

const inter = Roboto({ weight: '400',subsets: ['latin'] })

export const metadata = {
  title: 'AItoFlow',
  description: 'Generated flowcharts from natural language',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}style={{fontWeight:'400'}}>{children}</body>
    </html>
  )
}

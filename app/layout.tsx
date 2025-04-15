"use client"

import { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import './globals.css'
import { Layout } from '@/components/layout'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const pathname = usePathname()
  
  // Check if the current path is an auth page
  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/login'
  
  return (
    <html lang="en">
      <body className={inter.className}>
        {isAuthPage ? (
          children
        ) : (
          children
        )}
      </body>
    </html>
  )
}

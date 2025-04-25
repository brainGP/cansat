"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <main className="min-h-screen h-screen w-full bg-white text-slate-900 overflow-hidden">{children}</main>
    </ThemeProvider>
  )
}

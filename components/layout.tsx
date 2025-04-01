"use client"

import type React from "react"

import { Home, UtensilsCrossed, Weight, SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LayoutProps {
  children: React.ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
  isMobile: boolean
}

export function Layout({ children, activeTab, setActiveTab, isMobile }: LayoutProps) {
  const tabs = [
    { id: "dashboard", label: "Home", icon: <Home className="h-5 w-5" /> },
    { id: "log-food", label: "Log Food", icon: <UtensilsCrossed className="h-5 w-5" /> },
    { id: "weigh-in", label: "Weigh In", icon: <Weight className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isMobile && (
        <header className="border-b">
          <div className="container flex h-16 items-center px-4">
            <div className="mr-4 font-semibold text-lg">NutriTrack</div>
            <nav className="flex items-center space-x-4 lg:space-x-6">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1 container py-6 px-4 md:py-10">{children}</main>

      {isMobile && (
        <footer className="border-t bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 h-16">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center justify-center data-[state=active]:bg-muted py-2"
                >
                  {tab.icon}
                  <span className="text-xs mt-1">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </footer>
      )}
    </div>
  )
}


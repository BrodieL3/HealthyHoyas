"use client"

import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Dashboard } from "@/components/dashboard"
import { LogFood } from "@/components/log-food"
import { WeighIn } from "@/components/weigh-in"
import { Settings } from "@/components/settings"
import { Layout } from "@/components/layout"

export default function NutritionTracker() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile}>
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "log-food" && <LogFood />}
      {activeTab === "weigh-in" && <WeighIn />}
      {activeTab === "settings" && <Settings />}
    </Layout>
  )
}


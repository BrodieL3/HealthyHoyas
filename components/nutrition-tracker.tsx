"use client"

import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Dashboard } from "@/components/dashboard"
import { LogFood } from "@/components/log-food"
import { WeighIn } from "@/components/weigh-in"
import { LogSleep } from "@/components/recordSleep"
import { Settings } from "@/components/settings"
import { Layout } from "@/components/layout"
import AlcoholFactsPage from "./alcohol-facts"
import DrugAwarenessPage from "./drug-facts"
import { LogSteps } from "./count-steps"

export function NutritionTracker() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile}>
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "log-food" && <LogFood />}
      {activeTab === "weigh-in" && <WeighIn />}
      {activeTab === "record-sleep" && <LogSleep />}
      {activeTab === "count-steps" && <LogSteps />}
      {activeTab === "alcohol-facts" && <AlcoholFactsPage />}
      {activeTab === "drug-facts" && <DrugAwarenessPage />}
      {activeTab === "settings" && <Settings />}
    </Layout>
  )
} 
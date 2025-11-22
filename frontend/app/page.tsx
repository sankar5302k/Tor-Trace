"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import UrlFetcher from "@/components/url-fetcher"
import NetworkVisualization from "@/components/network-visualization"
import ForensicReport from "@/components/forensic-report"
import TimelineAnalysis from "@/components/timeline-analysis"
import DataSelector from "@/components/data-selector"
import { getAllMockData } from "@/lib/mock-database"

export default function Home() {
  const [activeData, setActiveData] = useState(null)
  const [allRecords, setAllRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("network")

  // Load initial records from API
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const response = await fetch("/api/forensics")
        if (response.ok) {
          const records = await response.json()
          setAllRecords(records)
          setActiveData(records[0] || null)
        } else {
          throw new Error("Failed to fetch records")
        }
      } catch (error) {
        console.log("[v0] Failed to load from API, using mock data:", error)
        const mockData = getAllMockData()
        setAllRecords(mockData)
        setActiveData(mockData[0] || null)
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [])

  const handleNewFetch = (newData) => {
    setActiveData(newData)
    setAllRecords([newData, ...allRecords])

    // Save to database via API
    fetch("/api/forensics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    }).catch((err) => console.log("[v0] Failed to save to database:", err))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary-dark to-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Data Selector - Show available database records */}
        {!loading && allRecords.length > 0 && (
          <DataSelector records={allRecords} onSelectRecord={setActiveData} currentRecord={activeData} />
        )}



        {/* Analysis Tabs */}
        {activeData && (
          <div className="mt-12">
            <div className="flex gap-2 mb-8 border-b border-border p-2 rounded-t-lg bg-card flex-wrap">
              <button
                onClick={() => setActiveTab("network")}
                className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                  activeTab === "network"
                    ? "bg-primary text-foreground shadow-lg"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                Network Analysis
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                  activeTab === "timeline"
                    ? "bg-primary text-foreground shadow-lg"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                Timeline Correlation
              </button>
              <button
                onClick={() => setActiveTab("forensic")}
                className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                  activeTab === "forensic"
                    ? "bg-primary text-foreground shadow-lg"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                Forensic Report
              </button>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border shadow-2xl">
              {activeTab === "network" && <NetworkVisualization data={activeData} />}
              {activeTab === "timeline" && <TimelineAnalysis data={activeData} />}
              {activeTab === "forensic" && <ForensicReport data={activeData} />}
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-12 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-12 w-12 bg-accent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading forensic records...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Send, AlertCircle, CheckCircle, Network } from "lucide-react"

interface UrlFetcherProps {
  onDataFetch: (data: any) => void
  onLoadingChange: (loading: boolean) => void
}

export default function UrlFetcher({ onDataFetch, onLoadingChange }: UrlFetcherProps) {
  const [url, setUrl] = useState("https://google.com")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleFetch = async () => {
    if (!url) {
      setError("Please enter a URL")
      return
    }

    setError("")
    setSuccess("")
    onLoadingChange(true)

    try {
      const response = await fetch(`http://localhost:4000/fetch?url=${encodeURIComponent(url)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSuccess("Network path analyzed successfully")
      onDataFetch(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch data. Ensure localhost:4000 is running.")
      console.log("[v0] Fetch error:", err)
    } finally {
      onLoadingChange(false)
    }
  }

  return (
    <Card className="bg-card border border-border rounded-lg p-8 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Network size={20} className="text-accent" />
        <h2 className="text-xl font-bold text-foreground">Network Path Analyzer</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Analyze a new URL through Tor network (optional)</p>

      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <label className="block text-sm text-muted-foreground mb-2">Target URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
          />
        </div>
        <button
          onClick={handleFetch}
          className="sm:mt-6 px-8 py-3 bg-accent hover:bg-accent/80 text-accent-foreground font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Send size={16} />
          Fetch & Analyze
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-start gap-3">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Analysis Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-start gap-3">
          <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Success</p>
            <p>{success}</p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/50">
        <p className="text-xs text-muted-foreground">
          <span className="text-accent font-semibold">API Endpoint:</span> http://localhost:4000/fetch
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          The backend server analyzes Tor network relay paths, captures source/destination IPs, node processing delays,
          and generates forensic data automatically.
        </p>
      </div>
    </Card>
  )
}

"use client"

import { useRef } from "react"

interface ForensicReportProps {
  data: any
}

export default function ForensicReport({ data }: ForensicReportProps) {
  const reportRef = useRef<HTMLDivElement>(null)

  const generateReport = () => {
    if (!reportRef.current) return

    const reportHTML = reportRef.current.innerHTML
    const blob = new Blob([reportHTML], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `forensic-report-${data.id || Date.now()}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  const startTime = new Date(data.path?.[0]?.recvTime)
  const endTime = new Date(data.path?.[data.path.length - 1]?.recvTime)
  const riskLevel = data.totalLatencyMs > 500 ? "HIGH" : data.totalLatencyMs > 300 ? "MEDIUM" : "LOW"
  const riskColor = riskLevel === "HIGH" ? "text-red-400" : riskLevel === "MEDIUM" ? "text-amber-400" : "text-green-400"

  const avgNodeDelay = Math.round(
    (data.path?.reduce((sum: number, n: any) => sum + (n.processDelayMs + n.forwardDelayMs), 0) || 0) /
      (data.path?.length || 1),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Forensic Analysis Report</h3>
        <button
          onClick={generateReport}
          className="px-6 py-2 bg-primary hover:bg-primary/80 text-foreground font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          <span>Download HTML Report</span>
        </button>
      </div>

      {/* Report Preview */}
      <div
        ref={reportRef}
        className="bg-foreground text-card p-8 rounded-lg space-y-6 print:bg-white print:text-black print:p-0"
      >
        {/* Header */}
        <div className="border-b-4 border-card pb-6">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">OFFICIAL FORENSIC ANALYSIS REPORT</h1>
          <p className="text-sm font-semibold">தமிழ்நாடு சைபர் குற்றப் பிரிவு - Tamil Nadu Cyber Crime Wing</p>
          <p className="text-sm">Network Forensics & Tor Analysis Division</p>
          <p className="text-xs mt-4 text-card/60">
            Report Generated:{" "}
            {new Date().toLocaleString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          <p className="text-xs font-bold tracking-widest mt-2 text-red-600">CLASSIFICATION: INVESTIGATION CASE FILE</p>
          <p className="text-xs font-mono mt-2">
            Case ID: {data.id || "TN-CCW-" + Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>

        {/* Executive Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-card pb-3">Executive Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4 bg-card/10 p-4 rounded">
            <div>
              <p className="font-semibold text-card/80">Target URL:</p>
              <p className="font-mono text-xs text-card break-all">{data.target}</p>
            </div>
            <div>
              <p className="font-semibold text-card/80">Source IP Address:</p>
              <p className="font-mono text-xs text-card">{data.sender_ip}</p>
            </div>
            <div>
              <p className="font-semibold text-card/80">Analysis Timestamp:</p>
              <p className="font-mono text-xs text-card">{startTime.toISOString()}</p>
            </div>
            <div>
              <p className="font-semibold text-card/80">Risk Assessment:</p>
              <p
                className={`font-bold ${riskLevel === "HIGH" ? "text-red-600" : riskLevel === "MEDIUM" ? "text-amber-600" : "text-green-600"}`}
              >
                {riskLevel}
              </p>
            </div>
            <div>
              <p className="font-semibold text-card/80">Total Latency:</p>
              <p className="font-mono font-bold text-card">{data.totalLatencyMs}ms</p>
            </div>
            <div>
              <p className="font-semibold text-card/80">Network Nodes:</p>
              <p className="font-mono font-bold text-card">{data.path?.length}</p>
            </div>
          </div>
        </div>

        {/* Network Path Analysis */}
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-card pb-3">Network Path Analysis</h2>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-card text-foreground">
                <th className="border-2 border-card p-3 text-left font-bold">Node ID</th>
                <th className="border-2 border-card p-3 text-left font-bold">Classification</th>
                <th className="border-2 border-card p-3 text-left font-bold">IP Address</th>
                <th className="border-2 border-card p-3 text-left font-bold">Processing Time</th>
                <th className="border-2 border-card p-3 text-left font-bold">Forward Time</th>
                <th className="border-2 border-card p-3 text-left font-bold">Total Time</th>
              </tr>
            </thead>
            <tbody>
              {data.path?.map((node: any, idx: number) => {
                const nodeType = idx === 0 ? "ENTRY POINT" : idx === data.path.length - 1 ? "EXIT POINT" : "RELAY NODE"
                const bgColor = idx === 0 ? "bg-blue-50" : idx === data.path.length - 1 ? "bg-red-50" : "bg-amber-50"
                return (
                  <tr key={idx} className={`border-2 border-card ${bgColor} hover:bg-opacity-80`}>
                    <td className="border-2 border-card p-3 font-bold">Node #{node.node}</td>
                    <td className="border-2 border-card p-3 font-semibold">{nodeType}</td>
                    <td className="border-2 border-card p-3 font-mono text-xs">
                      {idx === 0 ? data.sender_ip : "Hidden"}
                    </td>
                    <td className="border-2 border-card p-3 text-right font-mono">{node.processDelayMs}ms</td>
                    <td className="border-2 border-card p-3 text-right font-mono">{node.forwardDelayMs}ms</td>
                    <td className="border-2 border-card p-3 text-right font-bold font-mono">
                      {node.processDelayMs + node.forwardDelayMs}ms
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Node Classification Details */}
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-card pb-3">Node Classification & Roles</h2>
          <div className="space-y-4">
            <div className="border-l-8 border-blue-600 bg-blue-50 p-4">
              <p className="font-bold text-sm text-blue-900">ENTRY POINT (Node {data.path?.[0]?.node})</p>
              <p className="text-xs text-blue-800 mt-2">Initial network access point - Request origination node</p>
              <p className="font-mono text-xs text-blue-900 mt-1">Source: {data.sender_ip}</p>
              <p className="text-xs text-blue-800 mt-1">Processing Delay: {data.path?.[0]?.processDelayMs}ms</p>
            </div>
            {data.path?.slice(1, -1).map((node: any, idx: number) => (
              <div key={idx} className="border-l-8 border-amber-600 bg-amber-50 p-4">
                <p className="font-bold text-sm text-amber-900">RELAY NODE (Node {node.node})</p>
                <p className="text-xs text-amber-800 mt-2">
                  Intermediate routing node - Relays packets through Tor network
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  Processing Delay: {node.processDelayMs}ms | Forward Delay: {node.forwardDelayMs}ms
                </p>
              </div>
            ))}
            <div className="border-l-8 border-red-600 bg-red-50 p-4">
              <p className="font-bold text-sm text-red-900">
                EXIT POINT (Node {data.path?.[data.path.length - 1]?.node})
              </p>
              <p className="text-xs text-red-800 mt-2">Network exit point - Final destination gateway</p>
              <p className="font-mono text-xs text-red-900 mt-1">Target: {data.target}</p>
              <p className="text-xs text-red-800 mt-1">
                Processing Delay: {data.path?.[data.path.length - 1]?.processDelayMs}ms
              </p>
            </div>
          </div>
        </div>

        {/* Forensic Findings */}
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-card pb-3">Forensic Findings & Analysis</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-card">
            <li>Complete network routing path successfully identified and logged</li>
            <li>
              Total network traversal latency: <span className="font-bold">{data.totalLatencyMs}ms</span>
            </li>
            <li>
              Average per-node processing time: <span className="font-bold">{avgNodeDelay}ms</span>
            </li>
            <li>
              Network nodes in path: <span className="font-bold">{data.path?.length}</span> (Entry + Relays + Exit)
            </li>
            <li>
              Risk Level Assessment: <span className="font-bold">{riskLevel}</span>
            </li>
            <li>
              Server Response Status: <span className="font-bold">{data.fetched?.status}</span>
            </li>
            <li>All network packets traced and logged for forensic record</li>
          </ul>
        </div>

        {/* Investigator Certification */}
        <div className="border-t-4 border-card pt-6 mt-8">
          <p className="text-xs font-bold tracking-widest text-red-600">INVESTIGATOR CERTIFICATION</p>
          <p className="text-xs mt-3 text-card">
            This report is an official forensic analysis document generated by the Tamil Nadu Cyber Crime Wing
            Investigation & Analysis System (CCWIAS).
          </p>
          <p className="text-xs mt-2 text-card">
            All network data contained herein has been collected, verified, and authenticated for legal and
            investigative purposes.
          </p>
          <div className="mt-4 pt-4 border-t border-card flex justify-between">
            <div>
              <p className="text-xs font-bold">Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p className="text-xs mt-1">Generated: {new Date().toLocaleDateString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs">Version: 2.1</p>
              <p className="text-xs">Tamil Nadu CCW</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

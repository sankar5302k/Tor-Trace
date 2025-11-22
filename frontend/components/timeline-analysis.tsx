"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Activity } from "lucide-react"

interface TimelineAnalysisProps {
  data: any
}

export default function TimelineAnalysis({ data }: TimelineAnalysisProps) {
  const chartData =
    data.path?.map((node: any, idx: number) => ({
      node: `Node ${node.node}`,
      nodeNum: node.node,
      processDelay: node.processDelayMs,
      forwardDelay: node.forwardDelayMs,
      totalDelay: node.processDelayMs + node.forwardDelayMs,
      timestamp: new Date(node.recvTime).getTime(),
      index: idx,
    })) || []

  const cumulativeData = chartData.map((item: any, idx: number) => ({
    ...item,
    cumulativeLatency: chartData.slice(0, idx + 1).reduce((sum: number, d: any) => sum + d.totalDelay, 0),
  }))

  const identifyNodeType = (index: number, delay: number, forwardDelay: number) => {
    if (index === 0) {
      return { type: "Entry Node", confidence: "High", reason: "First node in path" }
    }
    if (index === data?.path?.length - 1) {
      return { type: "Exit Node", confidence: "High", reason: `High exit delay: ${forwardDelay}ms` }
    }
    return { type: "Relay Node", confidence: "Medium", reason: `Intermediate processing` }
  }

  const nodeAnalysis = chartData.map((item: any) => {
    const analysis = identifyNodeType(item.index, item.totalDelay, item.forwardDelay)
    return { ...item, ...analysis }
  })

  const avgProcessDelay = Math.round(
    chartData.reduce((sum: number, d: any) => sum + d.processDelay, 0) / chartData.length,
  )
  const avgForwardDelay = Math.round(
    chartData.reduce((sum: number, d: any) => sum + d.forwardDelay, 0) / chartData.length,
  )
  const entryNode = nodeAnalysis.find((n: any) => n.type === "Entry Node")
  const exitNode = nodeAnalysis.find((n: any) => n.type === "Exit Node")

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Activity size={20} className="text-accent" />
        Time-Based Entry/Exit Node Correlation
      </h3>

      {/* Entry/Exit Node Identification */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-green-500/10 border-green-500/50 border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-green-400" />
            <p className="text-xs text-text-secondary">Entry Node</p>
          </div>
          <p className="text-xl font-bold text-green-400">{entryNode?.nodeNum}</p>
          <p className="text-xs text-text-secondary mt-2">{entryNode?.reason}</p>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/50 border p-4">
          <p className="text-xs text-text-secondary mb-2">Avg Process Delay</p>
          <p className="text-xl font-bold text-emerald-400">{avgProcessDelay}ms</p>
          <p className="text-xs text-text-secondary mt-2">Internal relay processing</p>
        </Card>
        <Card className="bg-lime-500/10 border-lime-500/50 border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-lime-400" />
            <p className="text-xs text-text-secondary">Exit Node</p>
          </div>
          <p className="text-xl font-bold text-lime-400">{exitNode?.nodeNum}</p>
          <p className="text-xs text-text-secondary mt-2">{exitNode?.reason}</p>
        </Card>
      </div>

      {/* Forward Delay Analysis (Key for Exit Detection) */}
      <Card className="bg-primary-dark border-border p-6">
        <h4 className="text-base font-semibold text-foreground mb-4">Forward Delay Timing (Exit Point Detection)</h4>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e5a3a" />
              <XAxis dataKey="node" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" label={{ value: "Delay (ms)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f2818",
                  border: "1px solid #1e5a3a",
                  borderRadius: "8px",
                  color: "#b0f0a0",
                }}
                formatter={(value: any) => `${value}ms`}
              />
              <Legend />
              <Bar dataKey="forwardDelay" fill="#22c55e" name="Forward Delay (Exit indicator)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-text-secondary mt-3">
          Higher forward delays indicate exit points where traffic is routed to the target destination
        </p>
      </Card>

      {/* Cumulative Latency Path */}
      <Card className="bg-primary-dark border-border p-6">
        <h4 className="text-base font-semibold text-foreground mb-4">Cumulative Latency Path Progression</h4>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e5a3a" />
              <XAxis dataKey="node" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f2818",
                  border: "1px solid #1e5a3a",
                  borderRadius: "8px",
                  color: "#b0f0a0",
                }}
                formatter={(value: any) => `${value}ms`}
              />
              <Line
                type="monotone"
                dataKey="cumulativeLatency"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#22c55e", r: 6 }}
                name="Cumulative Latency (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Timing Correlation Matrix for Node Identification */}
      <Card className="bg-primary-dark border-border p-6">
        <h4 className="text-base font-semibold text-foreground mb-4">
          Timing Correlation Matrix - Node Classification
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">Node ID</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">Node Type</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">Process Delay (ms)</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">Forward Delay (ms)</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">Cumulative (ms)</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">Classification</th>
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {nodeAnalysis.map((item: any, idx: number) => {
                const typeColors = {
                  "Entry Node": "bg-green-500/20 text-green-400",
                  "Exit Node": "bg-lime-500/20 text-lime-400",
                  "Relay Node": "bg-emerald-500/20 text-emerald-400",
                }
                const typeColor = typeColors[item.type as keyof typeof typeColors]
                return (
                  <tr key={idx} className="border-b border-border hover:bg-card/50 transition">
                    <td className="py-2 px-3 font-mono font-bold text-accent">{item.nodeNum}</td>
                    <td className="py-2 px-3 font-mono text-primary">{item.node}</td>
                    <td className="py-2 px-3 font-mono text-foreground">{item.processDelay}</td>
                    <td className="py-2 px-3 font-mono text-accent">{item.forwardDelay}</td>
                    <td className="py-2 px-3 font-mono text-foreground font-bold">{item.cumulativeLatency}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${typeColor}`}>{item.type}</span>
                    </td>
                    <td className="py-2 px-3 text-text-secondary">{item.confidence}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

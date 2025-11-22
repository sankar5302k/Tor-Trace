"use client"

import { useMemo } from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { ArrowRight, Shield, Database } from "lucide-react"

interface NetworkVisualizationProps {
  data: any
}

export default function NetworkVisualization({ data }: NetworkVisualizationProps) {
  const chartData = useMemo(() => {
    if (!data?.path) return []

    return data.path.map((node: any, idx: number) => ({
      nodeNumber: `Node ${node.node}`,
      index: idx,
      processDelay: node.processDelayMs,
      forwardDelay: node.forwardDelayMs,
      totalDelay: node.processDelayMs + node.forwardDelayMs,
    }))
  }, [data])

  const getNodeType = (idx: number) => {
    if (idx === 0) return "Entry Point"
    if (idx === data?.path?.length - 1) return "Exit Point"
    return "Relay"
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Shield size={20} className="text-accent" />
        Network Path Diagram
      </h3>

      <Card className="bg-primary-dark border-border p-6">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e5a3a" />
              <XAxis dataKey="nodeNumber" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9ca3af" label={{ value: "Delay (ms)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f2818",
                  border: "1px solid #1e5a3a",
                  borderRadius: "8px",
                  color: "#b0f0a0",
                }}
              />
              <Legend />
              <Bar dataKey="processDelay" fill="#22c55e" name="Processing Delay (ms)" />
              <Bar dataKey="forwardDelay" fill="#84cc16" name="Forward Delay (ms)" />
              <Line type="monotone" dataKey="totalDelay" stroke="#10b981" name="Total Delay (ms)" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Node Path Flow Visualization */}
      <Card className="bg-primary-dark border-border p-6">
        <h4 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <Database size={18} className="text-accent" />
          Node Path Flow
        </h4>
        <div className="flex items-center justify-between overflow-x-auto gap-3 pb-4">
          {/* Entry Node */}
          <div className="flex flex-col items-center min-w-max">
            <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-lg flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-green-400">Client</span>
            </div>
            <p className="text-xs text-text-secondary">Entry</p>
          </div>

          {/* Arrow and Relay Nodes */}
          {data.path?.map((node: any, idx: number) => (
            <div key={idx} className="flex flex-col items-center min-w-max">
              <div className="flex items-center gap-2">
                <ArrowRight size={20} className="text-accent" />
              </div>
              <div
                className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center mb-2 ${
                  idx === 0
                    ? "bg-green-500/20 border-green-500"
                    : idx === data.path.length - 1
                      ? "bg-lime-500/20 border-lime-500"
                      : "bg-emerald-500/20 border-emerald-500"
                }`}
              >
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">Node {node.node}</p>
                  <p className="text-xs text-text-secondary">{node.forwardDelayMs}ms</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">{getNodeType(idx)}</p>
            </div>
          ))}

          {/* Arrow and Target Node */}
          <div className="flex flex-col items-center min-w-max">
            <div className="flex items-center gap-2">
              <ArrowRight size={20} className="text-accent" />
            </div>
            <div className="w-16 h-16 bg-lime-500/20 border-2 border-lime-500 rounded-lg flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-lime-400">Target</span>
            </div>
            <p className="text-xs text-text-secondary">Exit</p>
          </div>
        </div>
      </Card>

      {/* Node Details Table */}
      <Card className="bg-primary-dark border-border p-6">
        <h4 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database size={18} className="text-accent" />
          Node Details
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-secondary font-semibold">Node</th>
                <th className="text-left py-3 px-4 text-text-secondary font-semibold">Role</th>
                <th className="text-left py-3 px-4 text-text-secondary font-semibold">Receive Time</th>
                <th className="text-left py-3 px-4 text-accent font-mono text-xs">Processing (ms)</th>
                <th className="text-left py-3 px-4 text-accent font-mono text-xs">Forward (ms)</th>
              </tr>
            </thead>
            <tbody>
              {data.path?.map((node: any, idx: number) => {
                const role = getNodeType(idx)
                const roleColor =
                  role === "Entry Point"
                    ? "text-green-400"
                    : role === "Exit Point"
                      ? "text-lime-400"
                      : "text-emerald-400"

                return (
                  <tr key={idx} className="border-b border-border hover:bg-card/50 transition">
                    <td className="py-3 px-4 font-mono text-foreground">Node #{node.node}</td>
                    <td className={`py-3 px-4 font-semibold ${roleColor}`}>{role}</td>
                    <td className="py-3 px-4 text-text-secondary font-mono text-xs">
                      {new Date(node.recvTime).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 text-accent font-mono">{node.processDelayMs}</td>
                    <td className="py-3 px-4 text-accent font-mono">{node.forwardDelayMs}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary-dark border-border p-6">
          <p className="text-sm text-text-secondary mb-2">Total Latency</p>
          <p className="text-2xl font-bold text-foreground">{data.totalLatencyMs}ms</p>
        </Card>
        <Card className="bg-primary-dark border-border p-6">
          <p className="text-sm text-text-secondary mb-2">Total Nodes</p>
          <p className="text-2xl font-bold text-accent">{data.path?.length}</p>
        </Card>
        <Card className="bg-primary-dark border-border p-6">
          <p className="text-sm text-text-secondary mb-2">Target</p>
          <p className="text-sm font-mono text-primary truncate">{data.target}</p>
        </Card>
      </div>
    </div>
  )
}

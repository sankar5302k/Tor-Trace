"use client"

import { Card } from "@/components/ui/card"
import { Database, Clock, Network as GitNetwork } from "lucide-react"

interface DataSelectorProps {
  records: any[]
  onSelectRecord: (record: any) => void
  currentRecord: any
}

export default function DataSelector({ records, onSelectRecord, currentRecord }: DataSelectorProps) {
  return (
    <Card className="bg-card border border-border p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Database size={20} className="text-accent" />
        <h2 className="text-lg font-bold text-foreground">Investigation Records Database</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {records.map((record, idx) => (
          <button
            key={record.id}
            onClick={() => onSelectRecord(record)}
            className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
              currentRecord?.id === record.id
                ? "bg-primary border-accent shadow-lg"
                : "bg-card border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <GitNetwork size={16} className="text-accent" />
              <p className="font-mono text-sm font-bold text-accent">{record.id}</p>
            </div>
            <p className="text-foreground font-semibold truncate">{record.target}</p>
            <p className="text-xs text-muted-foreground">Source: {record.sender_ip}</p>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <Clock size={12} className="text-accent" />
              <p className="text-muted-foreground">
                Latency: <span className="text-accent font-bold">{record.totalLatencyMs}ms</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Nodes: <span className="font-bold text-accent">{record.path.length}</span>
            </p>
          </button>
        ))}
      </div>
    </Card>
  )
}

import { Lock, Shield } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-bold">
              <Shield size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tamil Nadu Cyber Crime Wing</h1>
              <p className="text-sm text-muted-foreground">Network Forensics & Tor Analysis Platform</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Classified Level</p>
            <div className="flex items-center gap-2 justify-end">
              <Lock size={14} />
              <p className="text-sm font-mono text-accent">FORENSICS v2.1</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

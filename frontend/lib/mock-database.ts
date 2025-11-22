// Mock database with sample Tor network forensics data
export const mockDatabaseRecords = [
  {
    id: "case-2025-001",
    target: "https://example.com",
    sender_ip: "192.168.1.100",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    totalLatencyMs: 450,
    path: [
      { node: 1, recvTime: new Date(Date.now() - 86400000).toISOString(), processDelayMs: 15, forwardDelayMs: 45 },
      { node: 2, recvTime: new Date(Date.now() - 86399955).toISOString(), processDelayMs: 28, forwardDelayMs: 52 },
      { node: 3, recvTime: new Date(Date.now() - 86399875).toISOString(), processDelayMs: 32, forwardDelayMs: 48 },
      { node: 4, recvTime: new Date(Date.now() - 86399795).toISOString(), processDelayMs: 18, forwardDelayMs: 215 },
    ],
    fetched: { status: 200, contentType: "text/html" },
  },
  {
    id: "case-2025-002",
    target: "https://research.site",
    sender_ip: "10.0.0.50",
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    totalLatencyMs: 625,
    path: [
      { node: 1, recvTime: new Date(Date.now() - 43200000).toISOString(), processDelayMs: 22, forwardDelayMs: 58 },
      { node: 2, recvTime: new Date(Date.now() - 43199920).toISOString(), processDelayMs: 35, forwardDelayMs: 72 },
      { node: 3, recvTime: new Date(Date.now() - 43199813).toISOString(), processDelayMs: 42, forwardDelayMs: 88 },
      { node: 4, recvTime: new Date(Date.now() - 43199693).toISOString(), processDelayMs: 28, forwardDelayMs: 280 },
    ],
    fetched: { status: 200, contentType: "text/html" },
  },
  {
    id: "case-2025-003",
    target: "https://secure.domain",
    sender_ip: "172.16.0.200",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    totalLatencyMs: 520,
    path: [
      { node: 1, recvTime: new Date(Date.now() - 3600000).toISOString(), processDelayMs: 18, forwardDelayMs: 50 },
      { node: 2, recvTime: new Date(Date.now() - 3599932).toISOString(), processDelayMs: 30, forwardDelayMs: 65 },
      { node: 3, recvTime: new Date(Date.now() - 3599837).toISOString(), processDelayMs: 38, forwardDelayMs: 55 },
      { node: 4, recvTime: new Date(Date.now() - 3599744).toISOString(), processDelayMs: 22, forwardDelayMs: 242 },
    ],
    fetched: { status: 200, contentType: "application/json" },
  },
]

export const getMockData = (index: number) => mockDatabaseRecords[index] || mockDatabaseRecords[0]
export const getAllMockData = () => mockDatabaseRecords

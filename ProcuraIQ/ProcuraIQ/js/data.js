/* ProcuraIQ – Realistic sample data for Enterprise Procurement & Supplier Risk Intelligence */

const PROC_DATA = {
  kpis: {
    totalSpend: 18472500,
    spendChange: 8.4,
    activeSuppliers: 142,
    supplierChange: -3.2,
    avgRiskScore: 34,
    riskChange: -5.1,
    openPos: 87,
    poChange: 12.6,
    anomalyCount: 11,
    forecastNextQ: 5120000
  },

  spendByCategory: [
    { category: "Raw Materials", amount: 6240000, pct: 33.8 },
    { category: "IT & Software", amount: 3180000, pct: 17.2 },
    { category: "Logistics", amount: 2750000, pct: 14.9 },
    { category: "Professional Services", amount: 2410000, pct: 13.0 },
    { category: "MRO & Facilities", amount: 1890000, pct: 10.2 },
    { category: "Marketing", amount: 1120000, pct: 6.1 },
    { category: "Other", amount: 882500, pct: 4.8 }
  ],

  monthlySpend: [
    { month: "Jun", amount: 1420000 },
    { month: "Jul", amount: 1510000 },
    { month: "Aug", amount: 1380000 },
    { month: "Sep", amount: 1650000 },
    { month: "Oct", amount: 1720000 },
    { month: "Nov", amount: 1840000 }
  ],

  forecast: [
    { month: "Dec", actual: null, forecast: 1910000, lower: 1750000, upper: 2080000 },
    { month: "Jan", actual: null, forecast: 1680000, lower: 1520000, upper: 1850000 },
    { month: "Feb", actual: null, forecast: 1530000, lower: 1380000, upper: 1690000 }
  ],

  suppliers: [
    {
      id: "SUP-001",
      name: "Apex Metals Corp",
      category: "Raw Materials",
      spend: 2840000,
      riskScore: 22,
      riskLevel: "low",
      onTimeRate: 96.4,
      qualityScore: 94,
      contracts: 3,
      lastOrder: "2026-11-18",
      country: "USA",
      status: "Active"
    },
    {
      id: "SUP-002",
      name: "NovaTech Systems",
      category: "IT & Software",
      spend: 1950000,
      riskScore: 41,
      riskLevel: "medium",
      onTimeRate: 88.2,
      qualityScore: 91,
      contracts: 5,
      lastOrder: "2026-11-22",
      country: "Germany",
      status: "Active"
    },
    {
      id: "SUP-003",
      name: "GlobalFreight Solutions",
      category: "Logistics",
      spend: 1620000,
      riskScore: 58,
      riskLevel: "medium",
      onTimeRate: 79.5,
      qualityScore: 82,
      contracts: 2,
      lastOrder: "2026-11-15",
      country: "Netherlands",
      status: "Active"
    },
    {
      id: "SUP-004",
      name: "Summit Consulting Group",
      category: "Professional Services",
      spend: 1180000,
      riskScore: 18,
      riskLevel: "low",
      onTimeRate: 98.1,
      qualityScore: 97,
      contracts: 4,
      lastOrder: "2026-11-20",
      country: "USA",
      status: "Active"
    },
    {
      id: "SUP-005",
      name: "Pacific Components Ltd",
      category: "Raw Materials",
      spend: 980000,
      riskScore: 72,
      riskLevel: "high",
      onTimeRate: 71.3,
      qualityScore: 76,
      contracts: 1,
      lastOrder: "2026-10-28",
      country: "China",
      status: "Under Review"
    },
    {
      id: "SUP-006",
      name: "Vertex Facilities Inc",
      category: "MRO & Facilities",
      spend: 745000,
      riskScore: 29,
      riskLevel: "low",
      onTimeRate: 93.8,
      qualityScore: 90,
      contracts: 2,
      lastOrder: "2026-11-12",
      country: "Canada",
      status: "Active"
    },
    {
      id: "SUP-007",
      name: "BrightPath Marketing",
      category: "Marketing",
      spend: 620000,
      riskScore: 35,
      riskLevel: "medium",
      onTimeRate: 91.0,
      qualityScore: 88,
      contracts: 3,
      lastOrder: "2026-11-19",
      country: "UK",
      status: "Active"
    },
    {
      id: "SUP-008",
      name: "Helix Industrial Supply",
      category: "MRO & Facilities",
      spend: 510000,
      riskScore: 64,
      riskLevel: "high",
      onTimeRate: 74.6,
      qualityScore: 79,
      contracts: 1,
      lastOrder: "2026-11-05",
      country: "Mexico",
      status: "Active"
    },
    {
      id: "SUP-009",
      name: "Quantum Analytics Co",
      category: "IT & Software",
      spend: 890000,
      riskScore: 15,
      riskLevel: "low",
      onTimeRate: 99.2,
      qualityScore: 98,
      contracts: 2,
      lastOrder: "2026-11-24",
      country: "USA",
      status: "Active"
    },
    {
      id: "SUP-010",
      name: "Eastern Polymers",
      category: "Raw Materials",
      spend: 1340000,
      riskScore: 47,
      riskLevel: "medium",
      onTimeRate: 85.7,
      qualityScore: 86,
      contracts: 2,
      lastOrder: "2026-11-10",
      country: "South Korea",
      status: "Active"
    }
  ],

  transactions: [
    { id: "PO-78421", date: "2026-11-24", supplier: "NovaTech Systems", category: "IT & Software", amount: 125000, status: "Approved", buyer: "A. Patel" },
    { id: "PO-78418", date: "2026-11-23", supplier: "Apex Metals Corp", category: "Raw Materials", amount: 248500, status: "Approved", buyer: "M. Chen" },
    { id: "PO-78415", date: "2026-11-22", supplier: "GlobalFreight Solutions", category: "Logistics", amount: 67200, status: "Pending", buyer: "S. Okonkwo" },
    { id: "PO-78412", date: "2026-11-21", supplier: "Summit Consulting Group", category: "Professional Services", amount: 89000, status: "Approved", buyer: "A. Patel" },
    { id: "PO-78409", date: "2026-11-20", supplier: "BrightPath Marketing", category: "Marketing", amount: 42000, status: "Approved", buyer: "L. Rivera" },
    { id: "PO-78405", date: "2026-11-19", supplier: "Quantum Analytics Co", category: "IT & Software", amount: 156000, status: "Approved", buyer: "M. Chen" },
    { id: "PO-78401", date: "2026-11-18", supplier: "Apex Metals Corp", category: "Raw Materials", amount: 312000, status: "Approved", buyer: "S. Okonkwo" },
    { id: "PO-78398", date: "2026-11-17", supplier: "Vertex Facilities Inc", category: "MRO & Facilities", amount: 28500, status: "Approved", buyer: "L. Rivera" },
    { id: "PO-78394", date: "2026-11-15", supplier: "Eastern Polymers", category: "Raw Materials", amount: 187000, status: "Approved", buyer: "A. Patel" },
    { id: "PO-78390", date: "2026-11-14", supplier: "Helix Industrial Supply", category: "MRO & Facilities", amount: 45300, status: "Flagged", buyer: "M. Chen" },
    { id: "PO-78385", date: "2026-11-12", supplier: "Pacific Components Ltd", category: "Raw Materials", amount: 96000, status: "Under Review", buyer: "S. Okonkwo" },
    { id: "PO-78380", date: "2026-11-10", supplier: "GlobalFreight Solutions", category: "Logistics", amount: 112400, status: "Approved", buyer: "L. Rivera" },
    { id: "PO-78375", date: "2026-11-08", supplier: "NovaTech Systems", category: "IT & Software", amount: 78000, status: "Approved", buyer: "A. Patel" },
    { id: "PO-78370", date: "2026-11-05", supplier: "Summit Consulting Group", category: "Professional Services", amount: 54000, status: "Approved", buyer: "M. Chen" },
    { id: "PO-78365", date: "2026-11-03", supplier: "Apex Metals Corp", category: "Raw Materials", amount: 205000, status: "Approved", buyer: "S. Okonkwo" }
  ],

  anomalies: [
    {
      id: "AN-041",
      type: "Price Spike",
      severity: "high",
      supplier: "Pacific Components Ltd",
      description: "Unit price for titanium fasteners rose 47% vs 6-month average on PO-78385.",
      amount: 96000,
      date: "2026-11-12",
      status: "Open"
    },
    {
      id: "AN-040",
      type: "Volume Outlier",
      severity: "medium",
      supplier: "Helix Industrial Supply",
      description: "Order quantity 3.2× higher than typical monthly volume for HVAC filters.",
      amount: 45300,
      date: "2026-11-05",
      status: "Investigating"
    },
    {
      id: "AN-039",
      type: "Duplicate Risk",
      severity: "medium",
      supplier: "GlobalFreight Solutions",
      description: "Two overlapping freight contracts detected for the same lane (EU-West).",
      amount: 0,
      date: "2026-11-08",
      status: "Open"
    },
    {
      id: "AN-038",
      type: "New Supplier High Spend",
      severity: "low",
      supplier: "BrightPath Marketing",
      description: "First-year spend already exceeds 80% of category annual budget.",
      amount: 620000,
      date: "2026-11-01",
      status: "Resolved"
    },
    {
      id: "AN-037",
      type: "Late Delivery Pattern",
      severity: "high",
      supplier: "Pacific Components Ltd",
      description: "On-time rate dropped to 71% over last 90 days; 4 critical delays.",
      amount: 0,
      date: "2026-10-28",
      status: "Open"
    },
    {
      id: "AN-036",
      type: "Maverick Spend",
      severity: "medium",
      supplier: "Helix Industrial Supply",
      description: "Purchase outside preferred supplier list for industrial lubricants.",
      amount: 18200,
      date: "2026-10-22",
      status: "Resolved"
    }
  ],

  insights: [
    {
      id: "IN-12",
      title: "Consolidate Raw Materials suppliers",
      body: "Apex Metals and Eastern Polymers cover 68% of category spend. Negotiating a dual-source agreement could yield 4–7% savings (~$280k/yr).",
      impact: "High",
      type: "savings"
    },
    {
      id: "IN-11",
      title: "Pacific Components risk escalation",
      body: "Risk score climbed from 48 to 72 in 60 days. Recommend immediate performance review and alternate source qualification.",
      impact: "Critical",
      type: "risk"
    },
    {
      id: "IN-10",
      title: "IT software license optimization",
      body: "NovaTech and Quantum Analytics overlap on analytics modules. Consolidating could reduce annual license cost by ~$140k.",
      impact: "Medium",
      type: "savings"
    },
    {
      id: "IN-09",
      title: "Q1 logistics capacity alert",
      body: "Forecasted inbound volume for Jan–Mar exceeds GlobalFreight contracted capacity by 18%. Initiate capacity discussion now.",
      impact: "High",
      type: "ops"
    },
    {
      id: "IN-08",
      title: "Payment term opportunity",
      body: "12 suppliers still on Net-30. Moving top 5 by spend to Net-45 could free ~$410k in working capital.",
      impact: "Medium",
      type: "cash"
    }
  ],

  riskDistribution: [
    { level: "Low (0–30)", count: 68, color: "#10b981" },
    { level: "Medium (31–60)", count: 51, color: "#f59e0b" },
    { level: "High (61–100)", count: 23, color: "#ef4444" }
  ]
};

================================================================================
ProcuraIQ – Enterprise Procurement & Supplier Risk Intelligence
================================================================================

PROJECT OVERVIEW
----------------
ProcuraIQ is an intelligent business analytics platform designed for
procurement and supply-chain teams. It evaluates procurement transactions,
identifies unusual spending patterns, analyses supplier performance, forecasts
purchasing requirements, and surfaces actionable insights through interactive
dashboards.

PURPOSE
-------
Help procurement leaders reduce risk, control spend, and make faster decisions
by consolidating transaction data, supplier scores, anomaly detection, and
AI-generated recommendations in one place.

TARGET USERS
------------
- Procurement managers and category leads
- Supply-chain risk analysts
- Finance / spend-control teams
- CFOs and operations executives reviewing vendor exposure

KEY FEATURES
------------
1. Executive Dashboard
   - KPI cards: Total Spend (YTD), Active Suppliers, Average Risk Score, Open POs
   - Monthly spend trend (bar chart)
   - Spend by category (doughnut chart)
   - Top suppliers by spend with risk scores
   - Recent high-priority anomalies

2. Transactions
   - Full purchase-order list with filters (status, category, search)
   - Status badges (Approved, Pending, Flagged, Under Review)
   - Clickable rows for detail views

3. Suppliers
   - Card grid of suppliers with risk score, on-time rate, quality, spend
   - Filter by risk level and category
   - Detailed supplier modal (contracts, last order, country, status)

4. Risk Intelligence
   - Risk distribution (Low / Medium / High)
   - Ranked list of highest-risk suppliers
   - Visual risk doughnut chart

5. Spend Forecast
   - Next-quarter spend projection with confidence band
   - Historical + forecast line chart
   - Category-level forecast notes and recommended actions

6. Anomaly Detection
   - Price spikes, volume outliers, duplicate contracts, maverick spend
   - Severity and status tracking
   - Drill-down descriptions

7. AI Insights
   - Ranked recommendations (savings, risk escalation, capacity, cash)
   - Impact labels (Critical / High / Medium)
   - Actionable language tied to real sample data

TECHNOLOGY STACK
----------------
- HTML5 + CSS3 (custom design system, dark professional theme)
- Vanilla JavaScript (no framework dependency)
- Chart.js 4 (CDN) for interactive charts
- Google Fonts (Inter + JetBrains Mono)
- Fully client-side – works offline after first load of Chart.js CDN

FOLDER STRUCTURE
----------------
ProcuraIQ/
├── index.html          ← Primary entry point (open with Live Server)
├── readme.txt          ← This file
├── css/
│   └── styles.css      ← Complete design system & responsive layout
├── js/
│   ├── data.js         ← Realistic sample procurement data
│   └── app.js          ← Application logic, views, charts, interactions
└── assets/             ← Reserved for future static assets

HOW TO RUN
----------
1. Download and extract the ZIP.
2. Open the extracted “ProcuraIQ” folder in Visual Studio Code.
3. Install the “Live Server” extension if you do not already have it.
4. Right-click index.html → “Open with Live Server”.
5. The application opens in your browser and is fully interactive.

No build step, no package install, and no backend is required for the demo.
All data is embedded in js/data.js and persists only in the browser session.

SAMPLE DATA NOTES
-----------------
- 10 suppliers across Raw Materials, IT, Logistics, Professional Services,
  MRO, and Marketing
- 15 recent purchase orders with realistic amounts and statuses
- 6 detected anomalies (price spikes, volume outliers, late-delivery patterns)
- 5 AI-generated insights with estimated financial impact
- Monthly spend history (Jun–Nov) and 3-month forecast (Dec–Feb)

EXTERNAL DEPENDENCIES
---------------------
- Chart.js loaded from CDN (https://cdn.jsdelivr.net/npm/chart.js@4.4.1)
- Google Fonts (Inter, JetBrains Mono)

If you need a fully offline version, download Chart.js and the font files
locally and update the <script> / <link> tags in index.html.

TESTING PERFORMED
-----------------
- All navigation views load and render correctly
- Charts initialize without console errors
- Filters on Transactions and Suppliers work
- Modal detail views open and close
- Responsive layout checked for desktop, tablet, and mobile breakpoints
- Keyboard and click interactions verified

FUTURE / PRODUCTION NOTES
-------------------------
This is a self-contained frontend demonstration. For a production deployment
you would typically add:
- Backend API (Node, Python, or .NET) for real transaction and supplier data
- Authentication and role-based access control
- Persistent database (PostgreSQL / Snowflake / etc.)
- Real-time anomaly detection pipeline
- Integration with ERP / procurement systems (SAP, Coupa, Oracle, etc.)

The current architecture is intentionally simple so the complete experience
can be reviewed immediately via Live Server.

================================================================================
Built as a complete, relevant digital product under the Universal Project Prompt
for AI-Based Project Development.
================================================================================

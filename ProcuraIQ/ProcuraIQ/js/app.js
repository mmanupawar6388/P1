/* ProcuraIQ – Application logic */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  let currentView = "dashboard";
  let charts = {};
  let period = 30;

  // ---------- Helpers ----------
  function fmtCurrency(n) {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
    return "$" + n.toLocaleString();
  }

  function fmtFull(n) {
    return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function riskClass(level) {
    return level === "low" ? "risk-low" : level === "medium" ? "risk-medium" : "risk-high";
  }

  function badgeForStatus(status) {
    const map = {
      Approved: "success",
      Pending: "warning",
      Flagged: "danger",
      "Under Review": "purple",
      Open: "danger",
      Investigating: "warning",
      Resolved: "success",
      Active: "success"
    };
    return map[status] || "muted";
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    $("#toastContainer").appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function destroyCharts() {
    Object.values(charts).forEach((c) => c.destroy());
    charts = {};
  }

  // ---------- Modal ----------
  function openModal(title, html) {
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = html;
    $("#modalOverlay").hidden = false;
  }

  function closeModal() {
    $("#modalOverlay").hidden = true;
  }

  // ---------- Views ----------
  function renderDashboard() {
    const d = PROC_DATA;
    return `
      <div class="view-header">
        <h1>Procurement Dashboard</h1>
        <p>Real-time spend, supplier performance, and risk overview</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Total Spend (YTD)</div>
          <div class="kpi-value">${fmtCurrency(d.kpis.totalSpend)}</div>
          <div class="kpi-delta up">↑ ${d.kpis.spendChange}% vs prior period</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Active Suppliers</div>
          <div class="kpi-value">${d.kpis.activeSuppliers}</div>
          <div class="kpi-delta down">↓ ${Math.abs(d.kpis.supplierChange)}% vs prior</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Avg Risk Score</div>
          <div class="kpi-value">${d.kpis.avgRiskScore}</div>
          <div class="kpi-delta up">↓ ${Math.abs(d.kpis.riskChange)} pts (improved)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Open POs</div>
          <div class="kpi-value">${d.kpis.openPos}</div>
          <div class="kpi-delta up">↑ ${d.kpis.poChange}% this month</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3>Monthly Spend Trend</h3></div>
          <div class="card-body"><div class="chart-wrap"><canvas id="chartSpend"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Spend by Category</h3></div>
          <div class="card-body"><div class="chart-wrap"><canvas id="chartCategory"></canvas></div></div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3>Top Suppliers by Spend</h3></div>
          <div class="card-body" style="padding:0">
            <div class="table-wrap">
              <table>
                <thead><tr><th>Supplier</th><th>Category</th><th>Spend</th><th>Risk</th></tr></thead>
                <tbody>
                  ${d.suppliers.slice(0, 5).map((s) => `
                    <tr data-supplier="${s.id}" class="clickable-row">
                      <td><strong>${s.name}</strong></td>
                      <td>${s.category}</td>
                      <td class="mono">${fmtFull(s.spend)}</td>
                      <td><span class="risk-score ${riskClass(s.riskLevel)}"><span class="risk-dot"></span>${s.riskScore}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Recent Anomalies</h3></div>
          <div class="card-body">
            <div class="insight-list">
              ${d.anomalies.slice(0, 3).map((a) => `
                <div class="insight-item" data-anomaly="${a.id}">
                  <div class="insight-icon ${a.severity === "high" ? "red" : a.severity === "medium" ? "amber" : "blue"}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div class="insight-body">
                    <h4>${a.type} · ${a.supplier}</h4>
                    <p>${a.description}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderTransactions() {
    const txs = PROC_DATA.transactions;
    return `
      <div class="view-header">
        <h1>Transactions</h1>
        <p>Purchase orders and spend activity</p>
      </div>
      <div class="filters">
        <select id="txStatus">
          <option value="">All statuses</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Flagged</option>
          <option>Under Review</option>
        </select>
        <select id="txCategory">
          <option value="">All categories</option>
          ${[...new Set(txs.map((t) => t.category))].map((c) => `<option>${c}</option>`).join("")}
        </select>
        <input type="search" id="txSearch" placeholder="Search PO or supplier..." />
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table id="txTable">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Buyer</th>
                </tr>
              </thead>
              <tbody>
                ${txs.map((t) => `
                  <tr data-po="${t.id}">
                    <td class="mono"><strong>${t.id}</strong></td>
                    <td>${t.date}</td>
                    <td>${t.supplier}</td>
                    <td>${t.category}</td>
                    <td class="mono">${fmtFull(t.amount)}</td>
                    <td><span class="badge badge-${badgeForStatus(t.status)}">${t.status}</span></td>
                    <td>${t.buyer}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderSuppliers() {
    const list = PROC_DATA.suppliers;
    return `
      <div class="view-header">
        <h1>Suppliers</h1>
        <p>Performance, risk scores, and relationship health</p>
      </div>
      <div class="filters">
        <select id="supRisk">
          <option value="">All risk levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select id="supCat">
          <option value="">All categories</option>
          ${[...new Set(list.map((s) => s.category))].map((c) => `<option>${c}</option>`).join("")}
        </select>
        <input type="search" id="supSearch" placeholder="Search suppliers..." />
      </div>
      <div class="supplier-grid" id="supplierGrid">
        ${list.map((s) => supplierCard(s)).join("")}
      </div>
    `;
  }

  function supplierCard(s) {
    return `
      <div class="supplier-card" data-supplier="${s.id}">
        <div class="supplier-card-top">
          <div>
            <div class="supplier-name">${s.name}</div>
            <div class="supplier-cat">${s.category} · ${s.country}</div>
          </div>
          <span class="badge badge-${badgeForStatus(s.status)}">${s.status}</span>
        </div>
        <div class="risk-score ${riskClass(s.riskLevel)}">
          <span class="risk-dot"></span> Risk ${s.riskScore}
        </div>
        <div class="supplier-stats">
          <div>
            <div class="stat-label">YTD Spend</div>
            <div class="stat-value">${fmtCurrency(s.spend)}</div>
          </div>
          <div>
            <div class="stat-label">On-Time</div>
            <div class="stat-value">${s.onTimeRate}%</div>
          </div>
          <div>
            <div class="stat-label">Quality</div>
            <div class="stat-value">${s.qualityScore}</div>
          </div>
          <div>
            <div class="stat-label">Contracts</div>
            <div class="stat-value">${s.contracts}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRisk() {
    const d = PROC_DATA;
    return `
      <div class="view-header">
        <h1>Risk Intelligence</h1>
        <p>Supplier risk distribution and high-priority exposures</p>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi-card">
          <div class="kpi-label">Low Risk Suppliers</div>
          <div class="kpi-value" style="color:var(--success)">${d.riskDistribution[0].count}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Medium Risk</div>
          <div class="kpi-value" style="color:var(--warning)">${d.riskDistribution[1].count}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">High Risk</div>
          <div class="kpi-value" style="color:var(--danger)">${d.riskDistribution[2].count}</div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3>Risk Distribution</h3></div>
          <div class="card-body"><div class="chart-wrap sm"><canvas id="chartRisk"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Highest Risk Suppliers</h3></div>
          <div class="card-body" style="padding:0">
            <div class="table-wrap">
              <table>
                <thead><tr><th>Supplier</th><th>Score</th><th>On-Time</th><th>Status</th></tr></thead>
                <tbody>
                  ${d.suppliers.filter((s) => s.riskLevel !== "low").sort((a, b) => b.riskScore - a.riskScore).map((s) => `
                    <tr data-supplier="${s.id}">
                      <td><strong>${s.name}</strong></td>
                      <td><span class="risk-score ${riskClass(s.riskLevel)}"><span class="risk-dot"></span>${s.riskScore}</span></td>
                      <td>${s.onTimeRate}%</td>
                      <td><span class="badge badge-${badgeForStatus(s.status)}">${s.status}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderForecast() {
    return `
      <div class="view-header">
        <h1>Spend Forecast</h1>
        <p>Projected purchasing requirements for the next quarter</p>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi-card">
          <div class="kpi-label">Next Quarter Forecast</div>
          <div class="kpi-value">${fmtCurrency(PROC_DATA.kpis.forecastNextQ)}</div>
          <div class="kpi-delta neutral">Dec – Feb projection</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Dec Forecast</div>
          <div class="kpi-value">${fmtCurrency(1910000)}</div>
          <div class="kpi-delta up">↑ 3.8% vs Nov</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Confidence Band</div>
          <div class="kpi-value">±9%</div>
          <div class="kpi-delta neutral">Based on 18-mo history</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Historical + Forecast Spend</h3></div>
        <div class="card-body"><div class="chart-wrap" style="height:320px"><canvas id="chartForecast"></canvas></div></div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="card-header"><h3>Category Forecast Notes</h3></div>
        <div class="card-body">
          <div class="insight-list">
            <div class="insight-item">
              <div class="insight-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div class="insight-body">
                <h4>Raw Materials</h4>
                <p>Expected 6% uplift in Q1 due to planned production ramp. Secure capacity with Apex Metals by mid-December.</p>
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div class="insight-body">
                <h4>Logistics</h4>
                <p>Seasonal freight rate increase typically hits in January. Consider locking rates for key lanes now.</p>
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div class="insight-body">
                <h4>IT & Software</h4>
                <p>Renewal cycle for NovaTech licenses in February. Budget $210k and evaluate multi-year discount.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAnomalies() {
    const list = PROC_DATA.anomalies;
    return `
      <div class="view-header">
        <h1>Anomaly Detection</h1>
        <p>Unusual spending patterns and risk signals requiring attention</p>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi-card">
          <div class="kpi-label">Open Anomalies</div>
          <div class="kpi-value">${list.filter((a) => a.status === "Open").length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">High Severity</div>
          <div class="kpi-value" style="color:var(--danger)">${list.filter((a) => a.severity === "high").length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Resolved (30d)</div>
          <div class="kpi-value">${list.filter((a) => a.status === "Resolved").length}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Supplier</th>
                  <th>Severity</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${list.map((a) => `
                  <tr data-anomaly="${a.id}">
                    <td class="mono">${a.id}</td>
                    <td><strong>${a.type}</strong></td>
                    <td>${a.supplier}</td>
                    <td><span class="badge badge-${a.severity === "high" ? "danger" : a.severity === "medium" ? "warning" : "primary"}">${a.severity}</span></td>
                    <td class="mono">${a.amount ? fmtFull(a.amount) : "—"}</td>
                    <td>${a.date}</td>
                    <td><span class="badge badge-${badgeForStatus(a.status)}">${a.status}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderInsights() {
    const list = PROC_DATA.insights;
    const iconMap = { savings: "green", risk: "red", ops: "amber", cash: "blue" };
    return `
      <div class="view-header">
        <h1>AI Insights</h1>
        <p>Actionable recommendations generated from spend and risk patterns</p>
      </div>
      <div class="insight-list">
        ${list.map((i) => `
          <div class="insight-item" data-insight="${i.id}" style="padding:18px">
            <div class="insight-icon ${iconMap[i.type] || "purple"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg>
            </div>
            <div class="insight-body" style="flex:1">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
                <h4 style="font-size:15px">${i.title}</h4>
                <span class="badge badge-${i.impact === "Critical" ? "danger" : i.impact === "High" ? "warning" : "primary"}">${i.impact}</span>
              </div>
              <p style="margin-top:6px">${i.body}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // ---------- Charts ----------
  function initCharts() {
    destroyCharts();
    const gridColor = "rgba(36,48,68,0.8)";
    const textColor = "#9aa8bc";

    if ($("#chartSpend")) {
      charts.spend = new Chart($("#chartSpend"), {
        type: "bar",
        data: {
          labels: PROC_DATA.monthlySpend.map((m) => m.month),
          datasets: [{
            label: "Spend",
            data: PROC_DATA.monthlySpend.map((m) => m.amount),
            backgroundColor: "rgba(59,130,246,0.75)",
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: textColor } },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                callback: (v) => "$" + (v / 1e6).toFixed(1) + "M"
              }
            }
          }
        }
      });
    }

    if ($("#chartCategory")) {
      charts.category = new Chart($("#chartCategory"), {
        type: "doughnut",
        data: {
          labels: PROC_DATA.spendByCategory.map((c) => c.category),
          datasets: [{
            data: PROC_DATA.spendByCategory.map((c) => c.amount),
            backgroundColor: [
              "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981",
              "#f59e0b", "#ef4444", "#6b7a90"
            ],
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: { color: textColor, boxWidth: 12, padding: 12, font: { size: 12 } }
            }
          },
          cutout: "62%"
        }
      });
    }

    if ($("#chartRisk")) {
      charts.risk = new Chart($("#chartRisk"), {
        type: "doughnut",
        data: {
          labels: PROC_DATA.riskDistribution.map((r) => r.level),
          datasets: [{
            data: PROC_DATA.riskDistribution.map((r) => r.count),
            backgroundColor: PROC_DATA.riskDistribution.map((r) => r.color),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: textColor, boxWidth: 12, padding: 14 }
            }
          },
          cutout: "58%"
        }
      });
    }

    if ($("#chartForecast")) {
      const hist = PROC_DATA.monthlySpend;
      const fut = PROC_DATA.forecast;
      charts.forecast = new Chart($("#chartForecast"), {
        type: "line",
        data: {
          labels: [...hist.map((m) => m.month), ...fut.map((m) => m.month)],
          datasets: [
            {
              label: "Actual",
              data: [...hist.map((m) => m.amount), null, null, null],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.1)",
              fill: true,
              tension: 0.3,
              pointRadius: 4
            },
            {
              label: "Forecast",
              data: [null, null, null, null, null, hist[hist.length - 1].amount, ...fut.map((m) => m.forecast)],
              borderColor: "#8b5cf6",
              borderDash: [6, 4],
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: "#8b5cf6"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: textColor }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: textColor } },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                callback: (v) => "$" + (v / 1e6).toFixed(1) + "M"
              }
            }
          }
        }
      });
    }
  }

  // ---------- Navigation & events ----------
  function showView(name) {
    currentView = name;
    destroyCharts();
    const content = $("#content");
    const views = {
      dashboard: renderDashboard,
      transactions: renderTransactions,
      suppliers: renderSuppliers,
      risk: renderRisk,
      forecast: renderForecast,
      anomalies: renderAnomalies,
      insights: renderInsights
    };
    content.innerHTML = (views[name] || views.dashboard)();
    $$(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
    requestAnimationFrame(() => {
      initCharts();
      bindViewEvents();
    });
  }

  function bindViewEvents() {
    // Supplier detail
    $$("[data-supplier]").forEach((el) => {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        const s = PROC_DATA.suppliers.find((x) => x.id === el.dataset.supplier);
        if (!s) return;
        openModal(s.name, `
          <div class="detail-row"><span class="detail-label">Supplier ID</span><span class="detail-value mono">${s.id}</span></div>
          <div class="detail-row"><span class="detail-label">Category</span><span class="detail-value">${s.category}</span></div>
          <div class="detail-row"><span class="detail-label">Country</span><span class="detail-value">${s.country}</span></div>
          <div class="detail-row"><span class="detail-label">YTD Spend</span><span class="detail-value mono">${fmtFull(s.spend)}</span></div>
          <div class="detail-row"><span class="detail-label">Risk Score</span><span class="detail-value"><span class="risk-score ${riskClass(s.riskLevel)}"><span class="risk-dot"></span>${s.riskScore} (${s.riskLevel})</span></span></div>
          <div class="detail-row"><span class="detail-label">On-Time Rate</span><span class="detail-value">${s.onTimeRate}%</span></div>
          <div class="detail-row"><span class="detail-label">Quality Score</span><span class="detail-value">${s.qualityScore}</span></div>
          <div class="detail-row"><span class="detail-label">Active Contracts</span><span class="detail-value">${s.contracts}</span></div>
          <div class="detail-row"><span class="detail-label">Last Order</span><span class="detail-value">${s.lastOrder}</span></div>
          <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge badge-${badgeForStatus(s.status)}">${s.status}</span></span></div>
        `);
      });
    });

    // Anomaly detail
    $$("[data-anomaly]").forEach((el) => {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        const a = PROC_DATA.anomalies.find((x) => x.id === el.dataset.anomaly);
        if (!a) return;
        openModal(a.type, `
          <div class="detail-row"><span class="detail-label">ID</span><span class="detail-value mono">${a.id}</span></div>
          <div class="detail-row"><span class="detail-label">Supplier</span><span class="detail-value">${a.supplier}</span></div>
          <div class="detail-row"><span class="detail-label">Severity</span><span class="detail-value"><span class="badge badge-${a.severity === "high" ? "danger" : a.severity === "medium" ? "warning" : "primary"}">${a.severity}</span></span></div>
          <div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value mono">${a.amount ? fmtFull(a.amount) : "—"}</span></div>
          <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${a.date}</span></div>
          <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge badge-${badgeForStatus(a.status)}">${a.status}</span></span></div>
          <div style="margin-top:16px;padding:12px;background:var(--bg);border-radius:8px;font-size:13.5px;color:var(--text-secondary)">${a.description}</div>
        `);
      });
    });

    // Transaction filters
    const txTable = $("#txTable");
    if (txTable) {
      const filterTx = () => {
        const status = ($("#txStatus") || {}).value || "";
        const cat = ($("#txCategory") || {}).value || "";
        const q = (($("#txSearch") || {}).value || "").toLowerCase();
        $$("#txTable tbody tr").forEach((row) => {
          const cells = row.cells;
          const matchStatus = !status || cells[5].textContent.trim() === status;
          const matchCat = !cat || cells[3].textContent.trim() === cat;
          const matchQ = !q || cells[0].textContent.toLowerCase().includes(q) || cells[2].textContent.toLowerCase().includes(q);
          row.style.display = matchStatus && matchCat && matchQ ? "" : "none";
        });
      };
      ["txStatus", "txCategory", "txSearch"].forEach((id) => {
        const el = $("#" + id);
        if (el) el.addEventListener("input", filterTx);
        if (el) el.addEventListener("change", filterTx);
      });
    }

    // Supplier filters
    if ($("#supplierGrid")) {
      const filterSup = () => {
        const risk = ($("#supRisk") || {}).value || "";
        const cat = ($("#supCat") || {}).value || "";
        const q = (($("#supSearch") || {}).value || "").toLowerCase();
        const filtered = PROC_DATA.suppliers.filter((s) => {
          const matchRisk = !risk || s.riskLevel === risk;
          const matchCat = !cat || s.category === cat;
          const matchQ = !q || s.name.toLowerCase().includes(q);
          return matchRisk && matchCat && matchQ;
        });
        $("#supplierGrid").innerHTML = filtered.map((s) => supplierCard(s)).join("") || `<div class="empty-state">No suppliers match filters</div>`;
        bindViewEvents();
      };
      ["supRisk", "supCat", "supSearch"].forEach((id) => {
        const el = $("#" + id);
        if (el) {
          el.addEventListener("input", filterSup);
          el.addEventListener("change", filterSup);
        }
      });
    }
  }

  // ---------- Init ----------
  function init() {
    $$(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        showView(btn.dataset.view);
        $("#sidebar").classList.remove("open");
      });
    });

    $("#menuToggle").addEventListener("click", () => {
      $("#sidebar").classList.toggle("open");
    });

    $("#modalClose").addEventListener("click", closeModal);
    $("#modalOverlay").addEventListener("click", (e) => {
      if (e.target === $("#modalOverlay")) closeModal();
    });

    $$(".period-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".period-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        period = Number(btn.dataset.period);
        toast(`Period set to last ${period} days`);
      });
    });

    $("#exportBtn").addEventListener("click", () => {
      toast("Export prepared — CSV download started (demo)");
    });

    $("#globalSearch").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = e.target.value.trim();
        if (q) toast(`Search: “${q}” — showing matching results`);
      }
    });

    showView("dashboard");
  }

  document.addEventListener("DOMContentLoaded", init);
})();

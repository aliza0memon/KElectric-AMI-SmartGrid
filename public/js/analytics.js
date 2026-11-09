async function loadAnalytics() {
  try {
    const peakHours = await apiGet('/analytics/peak-hours');
    const monthlyRevenue = await apiGet('/analytics/monthly-revenue');
    const outagesByArea = await apiGet('/analytics/outages-by-area');

    renderPeakHoursChart(peakHours);
    renderMonthlyRevenueChart(monthlyRevenue);
    renderOutageAreaChart(outagesByArea);
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
}

function renderPeakHoursChart(data) {
  const sorted = [...data].sort((a, b) => a.hour - b.hour);
  new Chart(document.getElementById('chart-peak-hours'), {
    type: 'bar',
    data: {
      labels: sorted.map(d => `${d.hour}:00`),
      datasets: [{ label: 'Avg kWh', data: sorted.map(d => d.avgConsumption), backgroundColor: '#00b4d8' }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } }
      }
    }
  });
}

function renderMonthlyRevenueChart(data) {
  new Chart(document.getElementById('chart-monthly-revenue'), {
    type: 'line',
    data: {
      labels: data.map(d => `${d.month}/${d.year}`),
      datasets: [{ label: 'Revenue (Rs)', data: data.map(d => d.totalRevenue), borderColor: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.1)', fill: true }]
    },
    options: {
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } }
      }
    }
  });
}

function renderOutageAreaChart(data) {
  new Chart(document.getElementById('chart-outage-area'), {
    type: 'bar',
    data: {
      labels: data.map(d => d.area),
      datasets: [{ label: 'Total downtime (min)', data: data.map(d => d.totalDowntimeMinutes), backgroundColor: '#e74c3c' }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } }
      }
    }
  });
}
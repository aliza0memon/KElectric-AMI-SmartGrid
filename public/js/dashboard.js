async function loadDashboard() {
  try {
    const consumers = await apiGet('/consumers');
    const meters = await apiGet('/meters');
    const bills = await apiGet('/bills');
    const outages = await apiGet('/outages');
    const dailyData = await apiGet('/analytics/daily-consumption');
    const topConsumersData = await apiGet('/analytics/top-consumers');

    document.getElementById('kpi-consumers').textContent = consumers.length;

    const activeMeters = meters.filter(m => m.meterStatus === 'active').length;
    document.getElementById('kpi-meters').textContent = activeMeters;

    const totalConsumption = dailyData.reduce((sum, d) => sum + d.totalConsumption, 0);
    document.getElementById('kpi-consumption').textContent = totalConsumption.toFixed(0);

    const totalRevenue = bills.reduce((sum, b) => sum + b.amount, 0);
    document.getElementById('kpi-revenue').textContent = totalRevenue.toLocaleString();

    const pendingBills = bills.filter(b => b.paymentStatus !== 'paid').length;
    document.getElementById('kpi-pending').textContent = pendingBills;

    const activeOutages = outages.filter(o => o.outageStatus === 'ongoing').length;
    document.getElementById('kpi-outages').textContent = activeOutages;

    renderDailyConsumptionChart(dailyData);
    renderTopConsumersChart(topConsumersData);

  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

function renderDailyConsumptionChart(data) {
  const ctx = document.getElementById('chart-daily-consumption');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d._id),
      datasets: [{
        label: 'kWh',
        data: data.map(d => d.totalConsumption),
        borderColor: '#00b4d8',
        backgroundColor: 'rgba(0,180,216,0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } }
      }
    }
  });
}

function renderTopConsumersChart(data) {
  const ctx = document.getElementById('chart-top-consumers');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.consumerName),
      datasets: [{
        label: 'kWh consumed',
        data: data.map(d => d.totalConsumption),
        backgroundColor: '#48cae4'
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#2c3e50' } }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', loadDashboard);
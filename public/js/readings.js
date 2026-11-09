async function loadReadings(meterId) {
  try {
    const readings = await apiGet(`/readings/${meterId}?limit=50`);
    renderReadingsTable(readings);
  } catch (error) {
    console.error('Failed to load readings:', error);
    alert('Could not load readings. Check the Meter ID and try again.');
  }
}

function renderReadingsTable(readings) {
  const tbody = document.querySelector('#readings-table tbody');
  tbody.innerHTML = readings.map(r => `
    <tr>
      <td>${new Date(r.timestamp).toLocaleString()}</td>
      <td>${r.energyConsumption_kWh}</td>
      <td>${r.voltage}</td>
      <td>${r.current}</td>
      <td>${r.powerFactor}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-load-readings');
  const input = document.getElementById('reading-meter-input');

  btn.addEventListener('click', () => {
    const meterId = input.value.trim();
    if (meterId) loadReadings(meterId);
  });
});
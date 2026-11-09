async function loadMeters(area = '') {
  try {
    const endpoint = area ? `/meters?area=${encodeURIComponent(area)}` : '/meters';
    const meters = await apiGet(endpoint);
    renderMetersTable(meters);
  } catch (error) {
    console.error('Failed to load meters:', error);
  }
}

function renderMetersTable(meters) {
  const tbody = document.querySelector('#meters-table tbody');
  tbody.innerHTML = meters.map(m => `
    <tr>
      <td>${m.meterId}</td>
      <td>${m.consumerId?.name || '-'}</td>
      <td>${m.location?.area || '-'}</td>
      <td>${m.meterType}</td>
      <td><span class="status-badge status-${m.meterStatus}">${m.meterStatus}</span></td>
      <td>
        <button class="btn-action" onclick="toggleMeterStatus('${m.meterId}', '${m.meterStatus}')">
          ${m.meterStatus === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </td>
    </tr>
  `).join('');
}

async function toggleMeterStatus(meterId, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  try {
    await apiPut(`/meters/${meterId}/status`, { meterStatus: newStatus });
    loadMeters();
  } catch (error) {
    alert('Failed to update meter status');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('meter-search');
  searchInput.addEventListener('input', (e) => {
    loadMeters(e.target.value);
  });
});
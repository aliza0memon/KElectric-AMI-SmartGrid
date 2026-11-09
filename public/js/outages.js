async function loadOutages() {
  try {
    const outages = await apiGet('/outages');
    renderOutagesTable(outages);
  } catch (error) {
    console.error('Failed to load outages:', error);
  }
}

function renderOutagesTable(outages) {
  const tbody = document.querySelector('#outages-table tbody');
  tbody.innerHTML = outages.map(o => `
    <tr>
      <td>${o.outageId}</td>
      <td>${o.affectedArea}</td>
      <td>${new Date(o.startTime).toLocaleString()}</td>
      <td>${o.durationMinutes ? o.durationMinutes + ' min' : 'Ongoing'}</td>
      <td><span class="status-badge status-${o.outageStatus}">${o.outageStatus}</span></td>
      <td>
        ${o.outageStatus === 'ongoing' ? `<button class="btn-action" onclick="resolveOutageRow('${o.outageId}')">Resolve</button>` : ''}
      </td>
    </tr>
  `).join('');
}

async function resolveOutageRow(outageId) {
  try {
    await apiPut(`/outages/${outageId}/resolve`, { restorationTime: new Date().toISOString() });
    loadOutages();
  } catch (error) {
    alert('Failed to resolve outage');
  }
}
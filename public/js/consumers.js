async function loadConsumers(searchTerm = '') {
  try {
    const endpoint = searchTerm ? `/consumers?search=${encodeURIComponent(searchTerm)}` : '/consumers';
    const consumers = await apiGet(endpoint);
    renderConsumersTable(consumers);
  } catch (error) {
    console.error('Failed to load consumers:', error);
  }
}

function renderConsumersTable(consumers) {
  const tbody = document.querySelector('#consumers-table tbody');
  tbody.innerHTML = consumers.map(c => `
    <tr>
      <td>${c.consumerId}</td>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.address?.area || '-'}</td>
      <td>${c.connectionType}</td>
      <td><span class="status-badge status-${c.accountStatus}">${c.accountStatus}</span></td>
      <td>
        <button class="btn-action" onclick="deleteConsumerRow('${c.consumerId}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteConsumerRow(consumerId) {
  if (!confirm(`Delete consumer ${consumerId}?`)) return;
  try {
    await apiDelete(`/consumers/${consumerId}`);
    loadConsumers();
  } catch (error) {
    alert('Failed to delete consumer');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('consumer-search');
  searchInput.addEventListener('input', (e) => {
    loadConsumers(e.target.value);
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('btn-add-consumer');
  addBtn.addEventListener('click', async () => {
    const name = prompt('Consumer name:');
    if (!name) return;
    const email = prompt('Email:');
    const phone = prompt('Phone:');
    const area = prompt('Area (e.g. Clifton, Gulshan, Malir):');
    const connectionType = prompt('Connection type (residential/commercial/industrial):') || 'residential';

    const consumerId = 'CON-' + Date.now().toString().slice(-6);

    try {
      await apiPost('/consumers', {
        consumerId,
        name,
        email,
        phone,
        address: { street: 'N/A', city: 'Karachi', area },
        connectionType,
        accountStatus: 'active'
      });
      alert('Consumer added successfully!');
      loadConsumers();
    } catch (error) {
      alert('Failed to add consumer: ' + error.message);
    }
  });
});
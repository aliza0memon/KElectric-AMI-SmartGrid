async function loadBills() {
  try {
    const bills = await apiGet('/bills');
    renderBillsTable(bills);
  } catch (error) {
    console.error('Failed to load bills:', error);
  }
}

function renderBillsTable(bills) {
  const tbody = document.querySelector('#bills-table tbody');
  tbody.innerHTML = bills.map(b => `
    <tr>
      <td>${b.billId}</td>
      <td>${b.consumerId?.name || '-'}</td>
      <td>${b.billingPeriod.month}/${b.billingPeriod.year}</td>
      <td>${b.unitsConsumed}</td>
      <td>Rs ${b.amount.toLocaleString()}</td>
      <td><span class="status-badge status-${b.paymentStatus}">${b.paymentStatus}</span></td>
      <td>
        ${b.paymentStatus !== 'paid' ? `<button class="btn-action" onclick="markBillPaid('${b.billId}')">Mark Paid</button>` : ''}
      </td>
    </tr>
  `).join('');
}

async function markBillPaid(billId) {
  try {
    await apiPut(`/bills/${billId}/payment`, { paymentStatus: 'paid' });
    loadBills();
  } catch (error) {
    alert('Failed to update bill');
  }
}
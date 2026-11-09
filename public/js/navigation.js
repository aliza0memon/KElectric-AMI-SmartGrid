document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const pageTitle = document.getElementById('page-title');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = item.getAttribute('data-page');

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      pages.forEach(p => p.classList.remove('active'));
      document.getElementById(`page-${targetPage}`).classList.add('active');

      pageTitle.textContent = item.textContent;

      if (targetPage === 'consumers') loadConsumers();
      if (targetPage === 'meters') loadMeters();
      if (targetPage === 'billing') loadBills();
      if (targetPage === 'outages') loadOutages();
      if (targetPage === 'analytics') loadAnalytics();
    });
  });
});
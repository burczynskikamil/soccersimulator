// modules/ui/tabs.js
window.showTab = (name) => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const tabEl = document.getElementById('tab-' + name);
  if (tabEl) tabEl.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const viewEl = document.getElementById(name);
  if (viewEl) viewEl.classList.remove('hidden');
};
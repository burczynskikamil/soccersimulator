// modules/team/detail/budget-editor.js
window.updateTeamBudget = async () => {
  const team = teamState.getById(window.currentTeamId);
  if (!team) return;
  
  const newBudget = parseFloat(el('team-edit-budget').value) || 0;
  const logoInput = el('team-edit-logo-input');
  
  team.budget = newBudget;
  
  if (logoInput.files.length > 0) {
    team.logo = await fileToBase64(logoInput.files[0]);
  }
  
  await window.db.saveTeams(teamState.getAll());
  const { dbStatus } = getDOMElements();
  dbStatus.textContent = '✅ Drużyna zaktualizowana';
  window.showTeamDetail(window.currentTeamId);
};
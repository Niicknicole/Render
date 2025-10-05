const sidebar = document.getElementById("sidebar");
const menuLink = document.getElementById("menuLink");
const closeBtn = document.getElementById("closeSidebar");

if (sidebar && menuLink && closeBtn) {
  // Abre a sidebar ao clicar no menu
  menuLink.addEventListener("click", (e) => {
    e.preventDefault();
    sidebar.classList.add("open");
  });

  // Fecha ao clicar no X
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });
}
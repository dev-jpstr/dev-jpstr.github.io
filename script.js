(() => {
  const root = document.documentElement;

  // Tema claro/escuro (lembra a escolha)
  document.querySelector(".theme-btn")?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Menu no celular
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.getElementById("menu");
  menuBtn?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  nav?.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
    }
  });

  // Filtros da página de projetos
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const filter = btn.dataset.filter;
      document.querySelectorAll("[data-cat]").forEach((el) => {
        const cats = el.dataset.cat.split(" ");
        el.classList.toggle("hidden", filter !== "todos" && !cats.includes(filter));
      });
    });
  });
})();

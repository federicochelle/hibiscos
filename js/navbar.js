const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.querySelector(".menu-overlay");
const closeTargets = document.querySelectorAll("[data-menu-close]");

if (header && toggle && mobileMenu && overlay) {
  const openMenu = () => {
    header.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    overlay.hidden = false;
    mobileMenu.hidden = false;

    const firstLink = mobileMenu.querySelector("a, button");
    firstLink?.focus();
  };

  const closeMenu = () => {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    overlay.hidden = true;
    mobileMenu.hidden = true;
    toggle.focus();
  };

  const isOpen = () => header.classList.contains("is-open");

  // Toggle botón hamburguesa
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  // Click en overlay
  overlay.addEventListener("click", closeMenu);

  // Click en links del menú
  closeTargets.forEach((el) => el.addEventListener("click", closeMenu));

  // ⬅️ CLICK AFUERA REAL
  document.addEventListener("click", (e) => {
    if (!isOpen()) return;

    const clickedInsideMenu =
      mobileMenu.contains(e.target) || toggle.contains(e.target);

    if (!clickedInsideMenu) {
      closeMenu();
    }
  });

  // Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  // Resize → cierra si pasa a desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && isOpen()) closeMenu();
  });
}

// FAQ smooth open/close (compatible iOS/Safari)
document.querySelectorAll("#faq details.card").forEach((details) => {
  const panel = details.querySelector(".faq-panel");
  if (!panel) return;

  // Arranque: si viene abierto, setea altura correcta
  const sync = () => {
    if (details.open) {
      panel.style.height = panel.scrollHeight + "px";
    } else {
      panel.style.height = "0px";
    }
  };
  sync();

  details.addEventListener("toggle", () => {
    // Si abre: animar de 0 -> scrollHeight
    if (details.open) {
      panel.style.transition = "none";
      panel.style.height = "0px";
      panel.offsetHeight; // reflow

      panel.style.transition = "height 260ms ease";
      panel.style.height = panel.scrollHeight + "px";

      // Al terminar, dejar auto para que si cambia contenido no corte
      const onEnd = () => {
        panel.style.height = "auto";
        panel.removeEventListener("transitionend", onEnd);
      };
      panel.addEventListener("transitionend", onEnd);
    } else {
      // Si cierra: de auto/px -> 0
      panel.style.transition = "none";
      panel.style.height = panel.scrollHeight + "px";
      panel.offsetHeight; // reflow

      panel.style.transition = "height 260ms ease";
      panel.style.height = "0px";
    }
  });

  // Por si cambia el layout (rotación)
  window.addEventListener("resize", () => {
    if (details.open) {
      panel.style.height = panel.scrollHeight + "px";
      // opcional: volver a auto luego de un tick
      requestAnimationFrame(() => (panel.style.height = "auto"));
    }
  });
});

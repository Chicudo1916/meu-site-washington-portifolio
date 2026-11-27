const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

// ============================================
// DADOS DAS MATÉRIAS
// ============================================
const subjectsS2 = [
  { nome: "Algoritmos e Pensamento Computacional", prof: "Adriana Falcomer Pontes" },
  { nome: "Desenvolvimento Front-End para Web", prof: "Eliel Silva Da Cruz" },
  { nome: "Design Profissional", prof: "Fernando Esteban Reynoso Acosta" },
  { nome: "Libras - Língua Brasileira de Sinais", prof: "" },
  { nome: "Modelagem de Banco de Dados", prof: "Josyane Lannes Florenzano De Souza" },
];

const subjectsS1 = [
  { nome: "Engenharia de Prompt e Aplicações em IA", prof: "Thiago Ferreira Gomes" },
  { nome: "Interface e Jornada do Usuário", prof: "Bruno Eduardo Morais De Araujo" },
  { nome: "Programação de Computadores", prof: "Ione Ferrarini Goulart" },
  { nome: "Prototipagem de Sistemas Computacionais", prof: "Gabriel De Oliveira Alves" },
];

function renderSubjects(list, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = list.map(s => `
    <div class="subject-card glass">
      <h4>${s.nome}</h4>
      ${s.prof ? `<p>${s.prof}</p>` : ""}
    </div>
  `).join("");
}

renderSubjects(subjectsS2, "subjects-s2");
renderSubjects(subjectsS1, "subjects-s1");

// ============================================
// TERMINAL: introdução padrão e comandos interativos
// ============================================
const terminalBody = document.getElementById("terminalBody");
const terminalInput = document.getElementById("terminalInput");
const terminalClear = document.getElementById("terminalClear");

const terminalIntro = [
  { command: "$ whoami", output: "washington — estudante de CC, UDF" },
  { command: "$ cat interesses.txt", output: "linux · hardware · games · android" },
  { command: "$ echo $STATUS", output: "em aprendizado constante_" }
];

function addTerminalLine(text, className = "") {
  const line = document.createElement("div");
  if (className) line.className = className;
  line.textContent = text;
  terminalBody.appendChild(line);
  return line;
}

function resetTerminal() {
  if (!terminalBody) return;
  terminalBody.replaceChildren();
  terminalIntro.forEach(({ command, output }) => {
    addTerminalLine(command);
    addTerminalLine(output, "line-ink");
  });
  terminalInput && (terminalInput.value = "");
  terminalBody.scrollTop = 0;
}

resetTerminal();

const terminalCommands = {
  help: () => [
    ["Comandos disponíveis:", ""],
    ["  whoami           → sobre mim", "line-ink"],
    ["  cat interesses.txt → meus interesses", "line-ink"],
    ["  echo $STATUS     → meu status", "line-ink"],
    ["  clear            → restaura a apresentação", "line-ink"],
    ["  sudo rm -rf      → não tenta isso aqui kkk", "line-ink"]
  ],
  whoami: () => [["washington — estudante de CC, UDF", "line-ink"]],
  "cat interesses.txt": () => [["linux · hardware · games · android", "line-ink"]],
  "echo $status": () => [["em aprendizado constante_", "line-ink"]]
};

function runTerminalCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd || !terminalBody) return;
  if (cmd === "clear" || cmd === "cls") {
    resetTerminal();
    return;
  }
  addTerminalLine(`$ ${raw}`);
  if (cmd === "sudo rm -rf" || cmd.startsWith("sudo rm -rf")) {
    addTerminalLine("tá querendo quebrar meu site é isso mesmo? 😅", "line-error");
  } else if (terminalCommands[cmd]) {
    terminalCommands[cmd]().forEach(([text, className]) => addTerminalLine(text, className));
  } else {
    addTerminalLine(`comando não encontrado: ${cmd} (tente "help")`, "line-hint");
  }
  terminalBody.scrollTop = terminalBody.scrollHeight;
  terminalInput?.focus();
}

terminalInput?.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  const raw = terminalInput.value;
  if (!raw.trim()) return;
  terminalInput.value = "";
  runTerminalCommand(raw);
});
terminalClear?.addEventListener("click", resetTerminal);

// ============================================
// NAV LOGO: volta ao topo e quebra no 3º clique em qualquer posição
// ============================================
const navLogo = document.getElementById("navLogo");
const logoToast = document.getElementById("logoToast");
const logoToastClose = document.getElementById("logoToastClose");
let logoClickCount = 0;
let logoClickTimer = null;
let logoToastTimer = null;
let logoShattered = false;

function showLogoToast(message, title = "Ops. Deu ruim.") {
  if (!logoToast) return;
  const heading = logoToast.querySelector("strong");
  const paragraph = logoToast.querySelector("p");
  if (heading) heading.textContent = title;
  if (paragraph) paragraph.textContent = message;
  logoToast.classList.add("open");
  logoToast.setAttribute("aria-hidden", "false");
  clearTimeout(logoToastTimer);
  logoToastTimer = setTimeout(() => {
    logoToast.classList.remove("open");
    logoToast.setAttribute("aria-hidden", "true");
  }, 4300);
}

function closeLogoToast() {
  logoToast?.classList.remove("open");
  logoToast?.setAttribute("aria-hidden", "true");
  clearTimeout(logoToastTimer);
}

function createLogoShards() {
  if (!navLogo) return;
  navLogo.querySelector(".logo-shards")?.remove();
  const layer = document.createElement("span");
  layer.className = "logo-shards";
  layer.setAttribute("aria-hidden", "true");
  const palette = ["var(--accent)", "var(--accent-2)", "var(--ink-dim)"];
  for (let i = 0; i < 9; i += 1) {
    const shard = document.createElement("i");
    const angle = (Math.PI * 2 * i) / 9 + (i % 2 ? 0.2 : -0.15);
    const distance = 12 + (i % 4) * 5;
    shard.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    shard.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    shard.style.setProperty("--rot", `${(i % 2 ? 1 : -1) * (25 + i * 7)}deg`);
    shard.style.setProperty("--size", `${3 + (i % 3)}px`);
    shard.style.setProperty("--delay", `${i * 18}ms`);
    shard.style.setProperty("--shard-color", palette[i % palette.length]);
    layer.appendChild(shard);
  }
  navLogo.appendChild(layer);
}

logoToastClose?.addEventListener("click", closeLogoToast);

navLogo?.addEventListener("click", event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });

  logoClickCount += 1;
  clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1600);

  if (logoClickCount >= 3) {
    logoClickCount = 0;
    clearTimeout(logoClickTimer);
    if (!logoShattered) {
      navLogo.classList.remove("expanded", "restoring");
      navLogo.classList.remove("restoring");
      navLogo.classList.add("expanded", "shatter");
      createLogoShards();
      logoShattered = true;
      showLogoToast("Você clicou no W três vezes e quebrou a logo. Agora vai ter que pagar pelo conserto.", "Ops. Deu ruim.");
    } else {
      navLogo.classList.remove("shatter");
      navLogo.classList.add("restoring");
      logoShattered = false;
      setTimeout(() => navLogo.querySelector(".logo-shards")?.remove(), 800);
      showLogoToast("Conserto concluído. Dessa vez não teve cobrança extra.", "Consertado!");
      setTimeout(() => navLogo.classList.remove("restoring"), 500);
    }
    return;
  }

  if (!logoShattered && logoClickCount === 1) navLogo.classList.add("expanded");
});

// ============================================
// NAV: MOBILE TOGGLE
// ============================================
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ============================================
// TEMA: toque alterna claro/escuro; segurar 2s ativa os modos extras
// ============================================
const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;
// O portfólio sempre inicia no tema escuro normal. Os temas extras são ativados
// manualmente pelo usuário ao segurar o botão por dois segundos.
let currentTheme = "dark";
let themeHoldTimer = null;
let holdCompleted = false;

function applyTheme(theme) {
  currentTheme = theme;
  htmlEl.setAttribute("data-theme", theme);
  themeToggle?.setAttribute("aria-pressed", String(theme === "light" || theme === "sunny"));
  const isLight = theme === "light" || theme === "sunny";
  const moon = document.getElementById("iconMoon");
  const sun = document.getElementById("iconSun");
  if (moon) { moon.style.opacity = isLight ? "0" : "1"; moon.style.transform = isLight ? "rotate(90deg) scale(.5)" : "rotate(0) scale(1)"; }
  if (sun) { sun.style.opacity = isLight ? "1" : "0"; sun.style.transform = isLight ? "rotate(0) scale(1)" : "rotate(-90deg) scale(.5)"; }
  try { localStorage.setItem("portfolio-theme", theme); } catch (error) {}
}

applyTheme(currentTheme);

function stopThemeHold() {
  clearTimeout(themeHoldTimer);
  themeHoldTimer = null;
  themeToggle?.classList.remove("holding");
}

themeToggle?.addEventListener("pointerdown", event => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  holdCompleted = false;
  stopThemeHold();
  themeToggle.classList.add("holding");
  themeHoldTimer = setTimeout(() => {
    holdCompleted = true;
    const extraTheme = currentTheme === "dark" ? "oled"
      : currentTheme === "oled" ? "dark"
      : currentTheme === "light" ? "sunny" : "light";
    applyTheme(extraTheme);
    themeToggle.classList.remove("holding");
    themeHoldTimer = null;
  }, 2000);
});

window.addEventListener("pointerup", stopThemeHold);
window.addEventListener("pointercancel", stopThemeHold);
themeToggle?.addEventListener("contextmenu", event => event.preventDefault());

themeToggle?.addEventListener("click", () => {
  if (holdCompleted) {
    holdCompleted = false;
    return;
  }
  applyTheme((currentTheme === "dark" || currentTheme === "oled") ? "light" : "dark");
});

// ============================================
// BOTÃO VOLTAR AO TOPO: lançamento de foguete em 3 segundos
// ============================================
const backToTop = document.getElementById("backToTop");
let rocketAnimating = false;
let rocketFrame = null;

function updateBackToTopVisibility() {
  if (!rocketAnimating) backToTop?.classList.toggle("show", window.scrollY > 240);
}
window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

function launchBackToTop() {
  if (!backToTop || rocketAnimating) return;
  if (prefersReduced || typeof requestAnimationFrame !== "function") {
    window.scrollTo({ top: 0, behavior: "auto" });
    backToTop.classList.remove("show", "launching");
    return;
  }

  const startY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
  if (startY <= 1) return;

  rocketAnimating = true;
  backToTop.classList.add("show", "launching");
  document.body.classList.add("rocket-launching");
  htmlEl.classList.add("rocket-scrolling");

  const duration = 3000;
  const startTime = performance.now();
  const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const frame = now => {
    const progress = Math.min(1, Math.max(0, (now - startTime) / duration));
    const eased = easeInOut(progress);
    window.scrollTo(0, Math.max(0, startY * (1 - eased)));
    if (progress < 1) {
      rocketFrame = requestAnimationFrame(frame);
    } else {
      window.scrollTo(0, 0);
      backToTop.classList.remove("launching", "show");
      document.body.classList.remove("rocket-launching");
      htmlEl.classList.remove("rocket-scrolling");
      rocketAnimating = false;
      rocketFrame = null;
    }
  };
  rocketFrame = requestAnimationFrame(frame);
}

backToTop?.addEventListener("click", launchBackToTop);

// ============================================
// MODAIS: GITHUB, LINKEDIN, YOUTUBE + E-MAIL
// ============================================
const githubLink = document.getElementById("githubLink");
const linkedinLink = document.getElementById("linkedinLink");
const youtubeLink = document.getElementById("youtubeLink");
const emailLink = document.getElementById("emailLink");
const githubModalOverlay = document.getElementById("githubModalOverlay");
const linkedinModalOverlay = document.getElementById("linkedinModalOverlay");
const ytModalOverlay = document.getElementById("ytModalOverlay");
const emailModalOverlay = document.getElementById("emailModalOverlay");
const gameLightboxOverlay = document.getElementById("gameLightboxOverlay");
const gameLightboxImage = document.getElementById("gameLightboxImage");
const gameLightboxTitle = document.getElementById("gameLightboxTitle");
const gameLightboxClose = document.getElementById("gameLightboxClose");
const gameLightboxPrev = document.getElementById("gameLightboxPrev");
const gameLightboxNext = document.getElementById("gameLightboxNext");
const gameLightboxCounter = document.getElementById("gameLightboxCounter");
const gameCoverCards = Array.from(document.querySelectorAll(".game-cover"));
let lastGameCover = null;
let activeGameIndex = 0;
const modalOverlays = [githubModalOverlay, linkedinModalOverlay, ytModalOverlay, emailModalOverlay, gameLightboxOverlay];

function openModal(overlay) {
  modalOverlays.forEach(item => {
    if (item !== overlay) {
      item?.classList.remove("open");
      if (item === gameLightboxOverlay) {
        item.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
      }
    }
  });
  overlay?.classList.add("open");
  if (overlay === gameLightboxOverlay) {
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }
}
function closeModal(overlay) {
  const wasOpen = overlay?.classList.contains("open");
  overlay?.classList.remove("open");
  if (overlay === gameLightboxOverlay) {
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    if (wasOpen) lastGameCover?.focus({ preventScroll: true });
  }
}
function closeAllModals() {
  modalOverlays.forEach(closeModal);
}

function showGameAt(index) {
  if (!gameCoverCards.length || !gameLightboxImage) return;
  activeGameIndex = (index + gameCoverCards.length) % gameCoverCards.length;
  const card = gameCoverCards[activeGameIndex];
  const image = card.querySelector("img");
  if (!image) return;
  gameLightboxImage.src = image.currentSrc || image.src;
  gameLightboxImage.alt = image.alt || `Capa de ${card.dataset.game || "jogo"}`;
  if (gameLightboxTitle) gameLightboxTitle.textContent = card.dataset.game || "Jogo favorito";
  if (gameLightboxCounter) gameLightboxCounter.textContent = `${activeGameIndex + 1} / ${gameCoverCards.length}`;
}
function stepGame(direction) {
  showGameAt(activeGameIndex + direction);
}

// Abre uma galeria compacta e permite percorrer todas as capas sem fechar.
gameCoverCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (!gameLightboxOverlay || !gameLightboxImage) return;
    lastGameCover = card;
    showGameAt(index);
    openModal(gameLightboxOverlay);
    gameLightboxClose?.focus({ preventScroll: true });
  });
});
gameLightboxPrev?.addEventListener("click", () => stepGame(-1));
gameLightboxNext?.addEventListener("click", () => stepGame(1));

githubLink?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(githubModalOverlay);
});
linkedinLink?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(linkedinModalOverlay);
});
youtubeLink?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(ytModalOverlay);
});
emailLink?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(emailModalOverlay);
});

document.querySelectorAll("[data-close-modal]").forEach(btn => {
  btn.addEventListener("click", () => {
    closeModal(document.getElementById(btn.dataset.closeModal));
  });
});
modalOverlays.forEach(overlay => {
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllModals();
    return;
  }
  if (gameLightboxOverlay?.classList.contains("open")) {
    if (e.key === "ArrowLeft") { e.preventDefault(); stepGame(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); stepGame(1); }
  }
});

// Copiar e-mail para a área de transferência
const copyEmailBtn = document.getElementById("copyEmailBtn");
const emailText = document.getElementById("emailText");
const copyIcon = document.getElementById("copyIcon");
const checkIconSvg = `<path d="M20 6 9 17l-5-5"/>`;
const clipboardIconSvg = `<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>`;

copyEmailBtn?.addEventListener("click", async () => {
  const text = emailText?.textContent?.trim() || "";
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback silencioso caso a API de clipboard não esteja disponível
  }
  copyEmailBtn.classList.add("copied");
  if (copyIcon) copyIcon.innerHTML = checkIconSvg;
  setTimeout(() => {
    copyEmailBtn.classList.remove("copied");
    if (copyIcon) copyIcon.innerHTML = clipboardIconSvg;
  }, 1600);
});

// ============================================
// RIPPLE: efeito de clique em botões, links de contato e ícones
// ============================================
function createRipple(e, el) {
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.4;
  const ripple = document.createElement("span");
  ripple.className = "ripple-el";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${(e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2}px`;
  ripple.style.top = `${(e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2}px`;
  el.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

if (!prefersReduced) {
  const rippleTargets = document.querySelectorAll(
    ".btn, .contact-link, .theme-toggle, .nav-toggle, .copy-btn, .modal-links a"
  );
  rippleTargets.forEach(el => {
    el.addEventListener("click", (e) => createRipple(e, el));
  });
}

// ============================================
// SCROLL REVEAL (single, restrained effect)
// ============================================
if (!prefersReduced && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".section, .hero-content, .hero-terminal");
  revealTargets.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => observer.observe(el));
}

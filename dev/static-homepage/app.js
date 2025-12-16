(() => {
  const track = document.querySelector("[data-hero-track]");
  const slides = Array.from(track?.children ?? []);
  const dotsContainer = document.querySelector("[data-hero-dots]");
  const prevBtn = document.querySelector("[data-hero-prev]");
  const nextBtn = document.querySelector("[data-hero-next]");
  let index = 0;
  let timer;

  function renderDots() {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "hero-dot";
      dot.setAttribute("aria-label", `跳到第 ${i + 1} 張`);
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s, idx) => s.setAttribute("aria-hidden", idx !== index));
    dotsContainer.querySelectorAll(".hero-dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
    resetTimer();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 6000);
  }

  if (track && slides.length) {
    renderDots();
    goTo(0);
    nextBtn?.addEventListener("click", next);
    prevBtn?.addEventListener("click", prev);
    resetTimer();
  }

  // Mobile nav
  const navToggle = document.querySelector(".nav-toggle");
  const navMobile = document.querySelector(".nav-mobile");
  const navClose = document.querySelector(".nav-close");
  navToggle?.addEventListener("click", () => {
    navMobile?.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
  });
  navClose?.addEventListener("click", () => {
    navMobile?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });

  navMobile?.addEventListener("click", (e) => {
    if (e.target === navMobile) {
      navMobile.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelectorAll(".nav-mobile-parent").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      const sibling = btn.nextElementSibling;
      if (sibling?.classList.contains("nav-mobile-children")) {
        sibling.classList.toggle("open", !expanded);
      }
    });
  });
})();

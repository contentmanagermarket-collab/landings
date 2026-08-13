const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Открыть меню");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
  const previous = gallery.querySelector(".gallery-prev");
  const next = gallery.querySelector(".gallery-next");
  const current = gallery.querySelector(".gallery-controls strong");
  let index = 0;

  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (current) current.textContent = String(index + 1);
  };

  previous?.addEventListener("click", () => show(index - 1));
  next?.addEventListener("click", () => show(index + 1));
  gallery.tabIndex = 0;
  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
  show(0);
});

const glueWords = [
  "вместе", "между", "перед", "после", "через", "вокруг", "чтобы", "когда", "если",
  "без", "для", "над", "под", "при", "про", "или", "также", "среди", "как", "что",
  "со", "во", "ко", "об", "от", "до", "по", "из", "за", "на", "у", "о", "к", "с", "в", "а", "и", "но"
].sort((a, b) => b.length - a.length);

const gluePattern = new RegExp(
  `(^|[\\s\\u00a0(\\[«„—–-])(${glueWords.join("|")})\\s+(?=[А-Яа-яЁёA-Za-z0-9«„])`,
  "giu"
);

const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const textNodes = [];
while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);

textNodes.forEach((node) => {
  if (!node.nodeValue.trim() || node.parentElement?.closest("script, style, code, pre")) return;
  let value = node.nodeValue;
  for (let pass = 0; pass < 4; pass += 1) value = value.replace(gluePattern, "$1$2\u00a0");
  node.nodeValue = value;
});

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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const previousButton = carousel.querySelector(".carousel-prev");
  const nextButton = carousel.querySelector(".carousel-next");
  const currentLabel = carousel.querySelector(".carousel-status strong");
  const totalLabel = carousel.querySelector(".carousel-status span");
  let currentIndex = 0;

  const showSlide = (nextIndex) => {
    currentIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === currentIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (currentLabel) currentLabel.textContent = String(currentIndex + 1);
    if (totalLabel) totalLabel.textContent = `/ ${slides.length}`;
  };

  previousButton?.addEventListener("click", () => showSlide(currentIndex - 1));
  nextButton?.addEventListener("click", () => showSlide(currentIndex + 1));

  carousel.tabIndex = 0;
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
    if (event.key === "ArrowRight") showSlide(currentIndex + 1);
  });

  showSlide(0);
});

document.querySelectorAll("[data-video-player]").forEach((player) => {
  const video = player.querySelector("video");
  const playButton = player.querySelector(".video-play");

  if (!video || !playButton) return;

  playButton.addEventListener("click", () => {
    video.play();
  });

  video.addEventListener("play", () => {
    player.classList.add("is-playing");
  });

  video.addEventListener("pause", () => {
    if (!video.ended) player.classList.remove("is-playing");
  });

  video.addEventListener("ended", () => {
    player.classList.remove("is-playing");
  });
});

const glueWords = [
  "вместе", "между", "перед", "после", "через", "вокруг",
  "чтобы", "когда", "если", "либо", "потому", "который", "которая", "которые",
  "без", "для", "над", "под", "при", "про", "обо", "ото",
  "или", "зато", "также", "тоже", "среди",
  "мы", "вы", "он", "она", "они", "оно", "это", "этот", "эта", "эти",
  "его", "её", "их", "наш", "наша", "наши", "ваш", "ваша", "ваши",
  "как", "что", "чем", "где", "кто",
  "со", "во", "ко", "об", "от", "до", "по", "из", "за", "на", "у", "о", "к", "с", "в",
  "а", "и", "но", "да"
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
  for (let pass = 0; pass < 4; pass += 1) {
    value = value.replace(gluePattern, "$1$2\u00a0");
  }
  node.nodeValue = value;
});

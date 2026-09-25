(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.mobile-nav');
  const closeMenu = () => {
    nav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
  };
  toggle.addEventListener('click', () => {
    const open = nav.hidden;
    nav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !nav.hidden) { closeMenu(); toggle.focus(); }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const slides = [...gallery.querySelectorAll('.gallery-slides img')];
    let index = 0;
    const show = next => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== index; });
      gallery.querySelector('.gallery-count').textContent = `${index + 1} / ${slides.length}`;
      gallery.querySelector('.gallery-caption').textContent = slides[index].alt.replace(/(?<![\p{L}])(в|и|на|для|с)\s+(?=\p{L})/giu, '$1\u00a0');
    };
    gallery.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
    gallery.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
    });
  });

  const dialog = document.querySelector('.lightbox');
  const expandedImage = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  let opener;
  document.querySelectorAll('.zoom-image').forEach(button => {
    button.addEventListener('click', () => {
      const source = button.querySelector('img');
      expandedImage.src = source.currentSrc || source.src;
      expandedImage.alt = source.alt;
      caption.textContent = button.dataset.caption || source.alt;
      opener = button;
      dialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog || event.target.classList.contains('lightbox-content')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    expandedImage.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });
})();

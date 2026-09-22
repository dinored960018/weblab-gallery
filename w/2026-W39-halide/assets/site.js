/* HALIDE — MOTION_INTENSITY 2. No reveals, no scroll listeners.
   Only the two things that have to move: the mobile drawer and the form. */
(() => {
  'use strict';
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'drawer');
    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !drawer.classList.contains('open')) return;
      drawer.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    });
  }

  $$('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('[required]', form).forEach((el) => {
        const wrap = el.closest('.f');
        const err = wrap.querySelector('.err');
        let msg = '';
        if (!el.value.trim()) msg = 'Required';
        else if (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) {
          msg = 'Check the address';
        }
        if (msg) ok = false;
        wrap.classList.toggle('bad', !!msg);
        err.textContent = msg;
      });
      form.querySelector('[data-said]').textContent = ok
        ? 'Demo only. Nothing was sent.' : '';
    });
  });
})();

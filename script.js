/* AUREA Advisory Group — website interactions (plain JavaScript, no libraries) */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Mobile menu ---------- */
  var burger = $('.burger');
  var mobileNav = $('#mobile-nav');
  var mSubBtn = $('.mnav-btn');
  var mSub = $('#mnav-sub');

  function setMobileMenu(open) {
    if (!burger || !mobileNav) return;
    mobileNav.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('.burger-open', burger).hidden = open;
    $('.burger-close', burger).hidden = !open;
    if (!open) setMobileSub(false);
  }
  function setMobileSub(open) {
    if (!mSubBtn || !mSub) return;
    mSub.hidden = !open;
    mSubBtn.setAttribute('aria-expanded', String(open));
  }
  if (burger) burger.addEventListener('click', function () { setMobileMenu(mobileNav.hidden); });
  if (mSubBtn) mSubBtn.addEventListener('click', function () { setMobileSub(mSub.hidden); });
  $$('.mnav-a, .mnav-sub-a, .logo-link').forEach(function (a) {
    a.addEventListener('click', function () { setMobileMenu(false); });
  });

  /* ---------- "Our services" dropdown (opens on hover via CSS, on click via JS) ---------- */
  var dd = $('.dd');
  var ddBtn = dd ? $('.nav-btn', dd) : null;
  function setDropdown(open) {
    if (!dd) return;
    dd.classList.toggle('open', open);
    ddBtn.setAttribute('aria-expanded', String(open));
  }
  if (ddBtn) {
    ddBtn.addEventListener('click', function () { setDropdown(!dd.classList.contains('open')); });
    dd.addEventListener('mouseleave', function () { setDropdown(false); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) setDropdown(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setDropdown(false); setMobileMenu(false); } });
  }

  /* ---------- Discipline tabs ---------- */
  var tabs = $$('.tab[data-tab]');
  var panels = $$('.tab-panel[data-panel]');

  function showTab(key) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === key;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', String(on));
      t.setAttribute('tabindex', on ? '0' : '-1');
      var icon = $('svg', t);
      if (icon) icon.setAttribute('class', on ? 'ic' : 'ic ic-navy');
    });
    panels.forEach(function (p) { p.hidden = p.dataset.panel !== key; });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { showTab(t.dataset.tab); });
    t.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      showTab(next.dataset.tab);
    });
  });

  // Menu, dropdown and footer links that jump to a discipline open its tab
  $$('a[data-tab]').forEach(function (a) {
    a.addEventListener('click', function () {
      showTab(a.dataset.tab);
      setDropdown(false);
    });
  });
  if (tabs.length) showTab((tabs.filter(function (t) { return t.classList.contains('on'); })[0] || tabs[0]).dataset.tab);

  /* ---------- Contact form ---------- */
  var form = $('#contact-form');
  var success = $('#form-success');
  var resetBtn = $('#form-reset');
  var chips = $$('.chip[data-value]');
  var chosenTopic = '';

  function setTopic(value) {
    chosenTopic = value;
    chips.forEach(function (c) {
      var on = c.dataset.value === value;
      c.classList.toggle('on', on);
      c.setAttribute('aria-pressed', String(on));
      var icon = $('svg', c);
      if (icon) icon.setAttribute('class', on ? 'ic' : 'ic ic-navy');
    });
    clearError('topic');
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () { setTopic(chosenTopic === c.dataset.value ? '' : c.dataset.value); });
  });

  // Buttons and links that name a team pre-select that topic in the form
  $$('[data-team]').forEach(function (el) {
    el.addEventListener('click', function () { setTopic(el.dataset.team); });
  });

  var fields = {
    name: { el: $('#f-name'), msg: 'Please enter your name.' },
    email: { el: $('#f-email'), msg: 'Please enter your email address.' },
    message: { el: $('#f-msg'), msg: 'Please enter a message.' },
    consent: { el: $('#f-consent'), msg: 'Please confirm to continue.' }
  };

  function errorHost(key) {
    if (key === 'topic') return $('.chips-fs', form);
    var el = fields[key].el;
    return key === 'consent' ? el.closest('.fld') : el.parentNode;
  }
  function showError(key, text) {
    var host = errorHost(key);
    var p = $('.err-msg[data-for="' + key + '"]', host);
    if (!p) {
      p = document.createElement('p');
      p.className = 'err-msg';
      p.dataset.for = key;
      host.appendChild(p);
    }
    p.textContent = text;
    if (key === 'topic') chips.forEach(function (c) { c.classList.add('err'); });
    else if (key !== 'consent') { fields[key].el.classList.add('err'); fields[key].el.setAttribute('aria-invalid', 'true'); }
  }
  function clearError(key) {
    if (!form) return;
    var host = errorHost(key);
    var p = host && $('.err-msg[data-for="' + key + '"]', host);
    if (p) p.remove();
    if (key === 'topic') chips.forEach(function (c) { c.classList.remove('err'); });
    else if (key !== 'consent' && fields[key]) { fields[key].el.classList.remove('err'); fields[key].el.removeAttribute('aria-invalid'); }
  }

  if (form) {
    Object.keys(fields).forEach(function (key) {
      var el = fields[key].el;
      el.addEventListener(key === 'consent' ? 'change' : 'input', function () { clearError(key); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      ['name', 'email', 'message', 'consent'].forEach(function (k) { clearError(k); });
      clearError('topic');

      var name = fields.name.el.value.trim();
      var email = fields.email.el.value.trim();
      if (!name) { showError('name', fields.name.msg); ok = false; firstBad = firstBad || fields.name.el; }
      if (!email) { showError('email', fields.email.msg); ok = false; firstBad = firstBad || fields.email.el; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Please enter a valid email address.'); ok = false; firstBad = firstBad || fields.email.el; }
      if (!chosenTopic) { showError('topic', 'Please choose what we can help you with.'); ok = false; firstBad = firstBad || chips[0]; }
      if (!fields.message.el.value.trim()) { showError('message', fields.message.msg); ok = false; firstBad = firstBad || fields.message.el; }
      if (!fields.consent.el.checked) { showError('consent', fields.consent.msg); ok = false; firstBad = firstBad || fields.consent.el; }
      if (!ok) { if (firstBad) firstBad.focus(); return; }

      /*
        TODO (go-live): send the form data to your server or a form service here.
        Example:
          var data = new FormData(form); data.append('topic', chosenTopic);
          fetch('/contact.php', { method: 'POST', body: data }).then(showSuccess);
        Until then the form only shows the thank-you message.
      */
      showSuccess(name, chosenTopic);
    });
  }

  function showSuccess(name, team) {
    $('[data-ok-name]', success).textContent = name;
    $('[data-ok-team]', success).textContent = team;
    form.hidden = true;
    success.hidden = false;
    success.setAttribute('tabindex', '-1');
    success.focus();
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      setTopic('');
      success.hidden = true;
      form.hidden = false;
      fields.name.el.focus();
    });
  }
})();

(function () {
  /* ─────────────────────────────────────────
     ROLE CONFIGURATION
  ───────────────────────────────────────── */
  var ROLES = {
    visitor: {
      label: 'Visitor',
      icon: '👤',
      color: '#888888',
      links: [
        { label: 'How It Works', href: 'index.html#how' },
        { label: 'FAQ',          href: 'faq.html' },
        { label: 'Join',         href: 'index.html#roles' },
      ],
      cta: { label: 'Get Started', href: 'index.html#roles' },
      /* pages this role can access (filename only) */
      access: ['index.html', 'faq.html', ''],
      default: 'index.html',
    },
    sponsor: {
      label: 'Sponsor',
      icon: '🏢',
      color: '#c8ff00',
      links: [
        { label: 'Gig Board',  href: 'gigs.html' },
        { label: 'Post a Gig', href: 'post-gig.html' },
        { label: 'FAQ',        href: 'faq.html' },
        { label: 'Profile',    href: 'profile.html' },
        { label: 'Help',       href: 'help.html' },
      ],
      cta: { label: 'Post a Gig', href: 'post-gig.html' },
      access: ['gigs.html', 'post-gig.html', 'faq.html', 'profile.html', 'help.html', 'gig-detail.html'],
      default: 'gigs.html',
    },
    graduate: {
      label: 'Graduate',
      icon: '🎓',
      color: '#82b4ff',
      links: [
        { label: 'Gig Board', href: 'gigs.html' },
        { label: 'Profile',   href: 'profile.html' },
        { label: 'FAQ',       href: 'faq.html' },
      ],
      cta: { label: 'Browse Gigs', href: 'gigs.html' },
      access: ['gigs.html', 'profile.html', 'faq.html', 'gig-detail.html'],
      default: 'gigs.html',
    },
  };

  /* ─────────────────────────────────────────
     STORAGE HELPERS
  ───────────────────────────────────────── */
  function getRole() {
    try { return localStorage.getItem('ee_role') || 'visitor'; } catch (e) { return 'visitor'; }
  }
  function saveRole(r) {
    try { localStorage.setItem('ee_role', r); } catch (e) {}
  }

  /* ─────────────────────────────────────────
     INJECT STYLES (once)
  ───────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('ee-nav-styles')) return;
    var s = document.createElement('style');
    s.id = 'ee-nav-styles';
    s.textContent = [
      /* role switcher pill */
      '.ee-role-wrap{position:relative;display:flex;align-items:center;}',
      '.ee-role-btn{display:flex;align-items:center;gap:0.45rem;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.13);border-radius:50px;padding:0.38rem 0.85rem;cursor:pointer;font-size:0.78rem;font-weight:600;color:rgba(255,255,255,0.75);font-family:inherit;transition:background 0.15s,color 0.15s;white-space:nowrap;line-height:1;}',
      '.ee-role-btn:hover{background:rgba(255,255,255,0.12);color:#fff;}',
      '.ee-role-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;transition:background 0.2s;}',
      '.ee-role-chevron{opacity:0.45;margin-left:1px;transition:transform 0.2s;}',
      '.ee-role-wrap.open .ee-role-chevron{transform:rotate(180deg);}',
      /* dropdown */
      '.ee-role-drop{display:none;position:absolute;top:calc(100% + 10px);left:0;background:#1c1c1c;border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:0.5rem;min-width:180px;z-index:9999;box-shadow:0 16px 48px rgba(0,0,0,0.6);}',
      '.ee-role-wrap.open .ee-role-drop{display:block;}',
      '.ee-drop-heading{font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.25);padding:0.45rem 0.75rem 0.6rem;display:block;}',
      '.ee-role-opt{display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.75rem;border-radius:9px;cursor:pointer;font-size:0.83rem;font-weight:500;color:rgba(255,255,255,0.55);transition:background 0.12s,color 0.12s;border:none;background:none;width:100%;text-align:left;font-family:inherit;}',
      '.ee-role-opt:hover{background:rgba(255,255,255,0.07);color:#fff;}',
      '.ee-role-opt.active{color:#fff;background:rgba(255,255,255,0.04);}',
      '.ee-opt-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}',
      '.ee-opt-check{margin-left:auto;font-size:0.78rem;color:var(--accent,#c8ff00);}',
      /* nav left cluster */
      '.ee-nav-left{display:flex;align-items:center;gap:1rem;}',
      /* access-denied banner */
      '.ee-access-denied{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;padding:2rem;}',
      '.ee-access-denied h2{font-size:2rem;font-weight:900;margin-bottom:0.75rem;}',
      '.ee-access-denied p{color:rgba(255,255,255,0.45);margin-bottom:2rem;max-width:380px;}',
      '.ee-access-denied a{background:var(--accent,#c8ff00);color:#0a0a0a;padding:0.8rem 2rem;border-radius:50px;font-weight:700;text-decoration:none;}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ─────────────────────────────────────────
     BUILD & INJECT NAV
  ───────────────────────────────────────── */
  function renderNav() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    var role   = getRole();
    var config = ROLES[role];
    var page   = (window.location.pathname.split('/').pop() || 'index.html');

    /* links */
    var linksHTML = config.links.map(function (l) {
      var active = (page === l.href.split('#')[0]) ? ' class="active"' : '';
      return '<li><a href="' + l.href + '"' + active + '>' + l.label + '</a></li>';
    }).join('');

    /* role options */
    var optsHTML = Object.keys(ROLES).map(function (key) {
      var r   = ROLES[key];
      var cls = (key === role) ? ' active' : '';
      var chk = (key === role) ? '<span class="ee-opt-check">✓</span>' : '';
      return '<button class="ee-role-opt' + cls + '" onclick="window.__eeSetRole(\'' + key + '\')">' +
               '<span class="ee-opt-dot" style="background:' + r.color + '"></span>' +
               r.icon + ' ' + r.label +
               chk +
             '</button>';
    }).join('');

    nav.innerHTML =
      '<div class="ee-nav-left">' +
        '<div class="ee-role-wrap" id="eeRoleWrap">' +
          '<button class="ee-role-btn" onclick="window.__eeToggleDrop(event)">' +
            '<span class="ee-role-dot" id="eeRoleDot" style="background:' + config.color + '"></span>' +
            '<span id="eeRoleLabel">' + config.icon + ' ' + config.label + '</span>' +
            '<svg class="ee-role-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">' +
              '<path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</button>' +
          '<div class="ee-role-drop">' +
            '<span class="ee-drop-heading">Switch view</span>' +
            optsHTML +
          '</div>' +
        '</div>' +
        '<a class="nav-logo" href="index.html">EXP EQUITY</a>' +
      '</div>' +
      '<ul class="nav-links">' + linksHTML + '</ul>' +
      '<a href="' + config.cta.href + '" class="nav-cta">' + config.cta.label + '</a>';
  }

  /* ─────────────────────────────────────────
     ACCESS CONTROL
  ───────────────────────────────────────── */
  function enforceAccess(role) {
    var page   = (window.location.pathname.split('/').pop() || 'index.html');
    var config = ROLES[role];
    /* index.html and '' are always accessible to everyone */
    if (page === '' || page === 'index.html') return;
    if (config.access.indexOf(page) === -1) {
      /* page is off-limits — show denial screen instead of redirecting */
      var main = document.querySelector('main') || document.body;
      /* hide page content except nav & footer */
      Array.from(document.body.children).forEach(function (el) {
        if (el.tagName !== 'NAV' && el.tagName !== 'FOOTER') el.style.display = 'none';
      });
      var div = document.createElement('div');
      div.className = 'ee-access-denied';
      div.innerHTML =
        '<h2>Access Restricted</h2>' +
        '<p>This page isn\'t available for the <strong>' + config.label + '</strong> role. Switch roles to continue.</p>' +
        '<a href="' + config.default + '">Go to my dashboard →</a>';
      document.body.insertBefore(div, document.querySelector('footer') || null);
    }
  }

  /* ─────────────────────────────────────────
     GLOBAL HANDLERS
  ───────────────────────────────────────── */
  window.__eeToggleDrop = function (e) {
    e.stopPropagation();
    var wrap = document.getElementById('eeRoleWrap');
    if (wrap) wrap.classList.toggle('open');
  };

  window.__eeSetRole = function (role) {
    saveRole(role);
    /* close dropdown */
    var wrap = document.getElementById('eeRoleWrap');
    if (wrap) wrap.classList.remove('open');
    renderNav();
    enforceAccess(role);
  };

  /* close on outside click */
  document.addEventListener('click', function (e) {
    var wrap = document.getElementById('eeRoleWrap');
    if (wrap && !wrap.contains(e.target)) wrap.classList.remove('open');
  });

  /* ─────────────────────────────────────────
     BOOT
  ───────────────────────────────────────── */
  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      renderNav();
      enforceAccess(getRole());
    });
  } else {
    renderNav();
    enforceAccess(getRole());
  }
})();

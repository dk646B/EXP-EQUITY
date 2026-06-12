(function () {
  /* ─────────────────────────────────────────
     ROLE CONFIGURATION
  ───────────────────────────────────────── */
  var ROLES = {
    visitor: {
      label: 'Visitor',
      icon: '👤',
      color: '#888888',
      /* visitor nav uses dropdown sections instead of flat links */
      links: [],
      sections: [
        { label: 'About',      href: 'index.html#mission' },
        { label: 'How It Works', href: 'index.html#how' },
        { label: 'Categories', href: 'index.html#categories' },
        { label: 'The Wallet', href: 'index.html#wallet' },
        { label: 'Escrow Flow', href: 'index.html#flow' },
        { label: 'Compare',    href: 'index.html#compare' },
        { label: 'Join',       href: 'join.html' },
        { label: 'Contact',    href: 'index.html#contact' },
      ],
      cta: { label: 'Join Now', href: 'join.html' },
      access: ['index.html', 'faq.html', 'join.html', ''],
      default: 'index.html',
    },
    sponsor: {
      label: 'Sponsor',
      icon: '🏢',
      color: '#c8ff00',
      links: [
        { label: 'Dashboard', href: 'dashboard.html' },
        { label: 'Account',   href: 'account.html' },
        { label: 'Help',      href: 'help.html' },
      ],
      cta: { label: 'Post a Gig', href: 'post-gig.html' },
      access: ['post-gig.html', 'faq.html', 'profile.html', 'help.html', 'gig-detail.html', 'dashboard.html', 'account.html', 'sponsor-gig.html'],
      default: 'dashboard.html',
    },
    contractor: {
      label: 'Contractor',
      icon: '🎓',
      color: '#82b4ff',
      links: [
        { label: 'Gig Board',  href: 'gigs.html' },
        { label: 'Dashboard',  href: 'dashboard.html' },
        { label: 'Profile',    href: 'profile.html' },
        { label: 'Account',    href: 'account.html' },
        { label: 'FAQ',        href: 'faq.html' },
      ],
      cta: { label: 'Browse Gigs', href: 'gigs.html' },
      access: ['gigs.html', 'profile.html', 'faq.html', 'gig-detail.html', 'dashboard.html', 'account.html'],
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
      /* role dropdown */
      '.ee-role-drop{display:none;position:absolute;bottom:calc(100% + 10px);left:0;background:#1c1c1c;border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:0.5rem;min-width:180px;z-index:9999;box-shadow:0 -8px 48px rgba(0,0,0,0.6);}',
      '.ee-role-wrap.open .ee-role-drop{display:block;}',
      '.ee-drop-heading{font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.25);padding:0.45rem 0.75rem 0.6rem;display:block;}',
      '.ee-role-opt{display:flex;align-items:center;gap:0.6rem;padding:0.6rem 0.75rem;border-radius:9px;cursor:pointer;font-size:0.83rem;font-weight:500;color:rgba(255,255,255,0.55);transition:background 0.12s,color 0.12s;border:none;background:none;width:100%;text-align:left;font-family:inherit;}',
      '.ee-role-opt:hover{background:rgba(255,255,255,0.07);color:#fff;}',
      '.ee-role-opt.active{color:#fff;background:rgba(255,255,255,0.04);}',
      '.ee-opt-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}',
      '.ee-opt-check{margin-left:auto;font-size:0.78rem;color:var(--accent,#c8ff00);}',
      /* nav left cluster */
      '.ee-nav-left{display:flex;align-items:center;gap:1rem;}',
      /* section dropdown (visitor) */
      '.ee-sections-wrap{position:relative;display:flex;align-items:center;}',
      '.ee-sections-btn{display:flex;align-items:center;gap:0.4rem;background:none;border:none;color:rgba(255,255,255,0.65);font-size:0.875rem;font-weight:500;letter-spacing:0.02em;cursor:pointer;font-family:inherit;padding:0.3rem 0.1rem;transition:color 0.2s;}',
      '.ee-sections-btn:hover{color:#fff;}',
      '.ee-sections-chevron{opacity:0.45;transition:transform 0.2s;}',
      '.ee-sections-wrap.open .ee-sections-chevron{transform:rotate(180deg);}',
      '.ee-sections-drop{display:none;position:absolute;top:calc(100% + 12px);left:0;background:#1c1c1c;border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:0.5rem;min-width:200px;z-index:9999;box-shadow:0 16px 48px rgba(0,0,0,0.6);}',
      '.ee-sections-wrap.open .ee-sections-drop{display:block;}',
      '.ee-section-link{display:block;padding:0.55rem 0.85rem;border-radius:8px;font-size:0.83rem;font-weight:500;color:rgba(255,255,255,0.6);text-decoration:none;transition:background 0.12s,color 0.12s;}',
      '.ee-section-link:hover{background:rgba(255,255,255,0.07);color:#fff;}',
      '.ee-section-divider{height:1px;background:rgba(255,255,255,0.07);margin:0.35rem 0.5rem;}',
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

    var linksHTML;

    if (role === 'visitor') {
      /* Visitor: section dropdown + individual join link */
      var sectionLinks = config.sections
        .filter(function(s) { return s.label !== 'Join'; })
        .map(function(s) {
          return '<a class="ee-section-link" href="' + s.href + '">' + s.label + '</a>';
        }).join('');

      var sectionsDropdown =
        '<div class="ee-sections-wrap" id="eeSectionsWrap">' +
          '<button class="ee-sections-btn" onclick="window.__eeToggleSections(event)">' +
            'Explore' +
            '<svg class="ee-sections-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">' +
              '<path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</button>' +
          '<div class="ee-sections-drop">' +
            sectionLinks +
            '<div class="ee-section-divider"></div>' +
            '<a class="ee-section-link" href="index.html#contact">Contact Us</a>' +
          '</div>' +
        '</div>';

      linksHTML =
        '<ul class="nav-links">' +
          '<li>' + sectionsDropdown + '</li>' +
          '<li><a href="join.html">Join</a></li>' +
          '<li><a href="faq.html">FAQ</a></li>' +
        '</ul>';

    } else {
      /* Sponsor / Contractor: flat links */
      var flatLinks = config.links.map(function (l) {
        var active = (page === l.href.split('#')[0]) ? ' class="active"' : '';
        return '<li><a href="' + l.href + '"' + active + '>' + l.label + '</a></li>';
      }).join('');
      linksHTML = '<ul class="nav-links">' + flatLinks + '</ul>';
    }

    nav.innerHTML =
      '<a class="nav-logo" href="index.html">EXP EQUITY</a>' +
      linksHTML +
      '<a href="' + config.cta.href + '" class="nav-cta">' + config.cta.label + '</a>';
  }

  /* ─────────────────────────────────────────
     ACCESS CONTROL
  ───────────────────────────────────────── */
  function enforceAccess(role) {
    var page   = (window.location.pathname.split('/').pop() || 'index.html');
    var config = ROLES[role];
    if (page === '' || page === 'index.html' || page === 'join.html') return;
    if (config.access.indexOf(page) === -1) {
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

  window.__eeToggleSections = function (e) {
    e.stopPropagation();
    var wrap = document.getElementById('eeSectionsWrap');
    if (wrap) wrap.classList.toggle('open');
  };

  window.__eeSetRole = function (role) {
    saveRole(role);
    renderNav();
    enforceAccess(role);
  };

  /* close dropdowns on outside click */
  document.addEventListener('click', function (e) {
    var roleWrap = document.getElementById('eeRoleWrap');
    if (roleWrap && !roleWrap.contains(e.target)) roleWrap.classList.remove('open');
    var sectWrap = document.getElementById('eeSectionsWrap');
    if (sectWrap && !sectWrap.contains(e.target)) sectWrap.classList.remove('open');
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

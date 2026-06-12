/**
 * DEV NAV — temporary development navigation bar
 * To remove: delete this file and remove the <script src="dev-nav.js"> tag from each page.
 * This script has zero side effects on page functionality.
 */
(function () {
  const pages = [
    { label: "Home",        href: "index.html" },
    { label: "Dashboard",   href: "dashboard.html" },
    { label: "Gigs",        href: "gigs.html" },
    { label: "Gig Detail",  href: "gig-detail.html" },
    { label: "Post Gig",    href: "post-gig.html" },
    { label: "Sponsor Gig", href: "sponsor-gig.html" },
    { label: "Profile",     href: "profile.html" },
    { label: "Account",     href: "account.html" },
    { label: "Join",        href: "join.html" },
    { label: "FAQ",         href: "faq.html" },
    { label: "Help",        href: "help.html" },
  ];

  const ROLES = {
    visitor:    { label: "Visitor",    icon: "👤", color: "#888888", access: ["index.html", "faq.html", "join.html"] },
    sponsor:    { label: "Sponsor",    icon: "🏢", color: "#c8ff00", access: ["index.html", "dashboard.html", "post-gig.html", "sponsor-gig.html", "gig-detail.html", "profile.html", "account.html", "faq.html", "help.html"] },
    contractor: { label: "Contractor", icon: "🎓", color: "#82b4ff", access: ["index.html", "gigs.html", "gig-detail.html", "dashboard.html", "profile.html", "account.html", "faq.html"] },
  };

  function getRole() {
    try { return localStorage.getItem("ee_role") || "visitor"; } catch (e) { return "visitor"; }
  }

  const current = window.location.pathname.split("/").pop() || "index.html";

  // ── Bar ──────────────────────────────────────────────────────────────────
  const bar = document.createElement("div");
  bar.id = "__dev-nav__";
  bar.style.cssText = [
    "position:fixed",
    "bottom:0",
    "left:0",
    "right:0",
    "z-index:999999",
    "background:#1a1a2e",
    "border-top:2px solid #e94560",
    "display:flex",
    "align-items:center",
    "gap:4px",
    "padding:6px 12px",
    "font-family:monospace",
    "font-size:12px",
    "flex-wrap:wrap",
    "box-shadow:0 -2px 12px rgba(0,0,0,0.4)",
  ].join(";");

  // ── "DEV" label ──────────────────────────────────────────────────────────
  const devLabel = document.createElement("span");
  devLabel.textContent = "🛠 DEV";
  devLabel.style.cssText = "color:#e94560;font-weight:bold;margin-right:8px;white-space:nowrap;flex-shrink:0;";
  bar.appendChild(devLabel);

  // ── Page links (dynamic per role) ────────────────────────────────────────
  const linksContainer = document.createElement("span");
  linksContainer.id = "__dev-nav-links__";
  linksContainer.style.cssText = "display:contents;";
  bar.appendChild(linksContainer);

  function renderPageLinks() {
    linksContainer.innerHTML = "";
    const role = getRole();
    const access = (ROLES[role] || ROLES.visitor).access;
    pages
      .filter(({ href }) => access.includes(href))
      .forEach(({ label: text, href }) => {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = text;
        const isCurrent = href === current;
        a.style.cssText = [
          "color:" + (isCurrent ? "#1a1a2e" : "#a8b2d8"),
          "background:" + (isCurrent ? "#e94560" : "transparent"),
          "border:1px solid " + (isCurrent ? "#e94560" : "#333"),
          "border-radius:4px",
          "padding:2px 8px",
          "text-decoration:none",
          "white-space:nowrap",
          "transition:background 0.15s,color 0.15s",
        ].join(";");
        a.onmouseenter = () => { if (!isCurrent) { a.style.background = "#2a2a4e"; a.style.color = "#fff"; } };
        a.onmouseleave = () => { if (!isCurrent) { a.style.background = "transparent"; a.style.color = "#a8b2d8"; } };
        linksContainer.appendChild(a);
      });
  }

  // ── Divider ──────────────────────────────────────────────────────────────
  const divider = document.createElement("span");
  divider.style.cssText = "margin-left:auto;width:1px;height:16px;background:rgba(255,255,255,0.15);flex-shrink:0;";
  bar.appendChild(divider);

  // ── Role switcher dropdown ────────────────────────────────────────────────
  const roleWrap = document.createElement("div");
  roleWrap.id = "__dev-role-wrap__";
  roleWrap.style.cssText = "position:relative;display:flex;align-items:center;margin-left:8px;";

  // Dropdown panel (opens upward)
  const drop = document.createElement("div");
  drop.style.cssText = [
    "display:none",
    "position:absolute",
    "bottom:calc(100% + 8px)",
    "right:0",
    "background:#1c1c1c",
    "border:1px solid rgba(255,255,255,0.12)",
    "border-radius:12px",
    "padding:6px",
    "min-width:160px",
    "z-index:1000000",
    "box-shadow:0 -8px 32px rgba(0,0,0,0.6)",
  ].join(";");

  const dropHeading = document.createElement("span");
  dropHeading.textContent = "Switch view";
  dropHeading.style.cssText = "display:block;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);padding:4px 8px 6px;";
  drop.appendChild(dropHeading);

  function renderRoleOptions() {
    // Remove old option buttons
    Array.from(drop.querySelectorAll(".__dev-role-opt__")).forEach(el => el.remove());
    const role = getRole();
    Object.entries(ROLES).forEach(([key, r]) => {
      const btn = document.createElement("button");
      btn.className = "__dev-role-opt__";
      const isActive = key === role;
      btn.style.cssText = [
        "display:flex",
        "align-items:center",
        "gap:6px",
        "width:100%",
        "text-align:left",
        "background:" + (isActive ? "rgba(255,255,255,0.06)" : "none"),
        "border:none",
        "color:" + (isActive ? "#fff" : "rgba(255,255,255,0.55)"),
        "font-family:monospace",
        "font-size:12px",
        "font-weight:" + (isActive ? "700" : "500"),
        "padding:6px 8px",
        "border-radius:8px",
        "cursor:pointer",
      ].join(";");
      btn.innerHTML =
        '<span style="width:7px;height:7px;border-radius:50%;background:' + r.color + ';flex-shrink:0;display:inline-block;"></span>' +
        r.icon + " " + r.label +
        (isActive ? '<span style="margin-left:auto;color:var(--accent,#c8ff00);font-size:11px;">✓</span>' : "");
      btn.onmouseenter = () => { if (!isActive) btn.style.background = "rgba(255,255,255,0.06)"; };
      btn.onmouseleave = () => { if (!isActive) btn.style.background = "none"; };
      btn.onclick = (e) => {
        e.stopPropagation();
        if (window.__eeSetRole) window.__eeSetRole(key);
        drop.style.display = "none";
      };
      drop.appendChild(btn);
    });
  }

  function renderRoleBtn() {
    const role = getRole();
    const r = ROLES[role] || ROLES.visitor;
    roleBtn.innerHTML =
      '<span style="width:7px;height:7px;border-radius:50%;background:' + r.color + ';display:inline-block;margin-right:5px;"></span>' +
      r.icon + " " + r.label +
      ' <svg style="margin-left:4px;opacity:0.45;" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  const roleBtn = document.createElement("button");
  roleBtn.style.cssText = [
    "display:flex",
    "align-items:center",
    "background:rgba(255,255,255,0.07)",
    "border:1px solid rgba(255,255,255,0.13)",
    "border-radius:50px",
    "padding:3px 10px",
    "color:rgba(255,255,255,0.8)",
    "font-family:monospace",
    "font-size:12px",
    "font-weight:600",
    "cursor:pointer",
    "white-space:nowrap",
  ].join(";");
  roleBtn.onmouseenter = () => { roleBtn.style.background = "rgba(255,255,255,0.13)"; };
  roleBtn.onmouseleave = () => { roleBtn.style.background = "rgba(255,255,255,0.07)"; };
  roleBtn.onclick = (e) => {
    e.stopPropagation();
    const isOpen = drop.style.display === "block";
    drop.style.display = isOpen ? "none" : "block";
    if (!isOpen) renderRoleOptions();
  };

  renderRoleBtn();
  roleWrap.appendChild(roleBtn);
  roleWrap.appendChild(drop);
  bar.appendChild(roleWrap);

  // Close dropdown on outside click
  document.addEventListener("click", () => { drop.style.display = "none"; });

  // ── Keep in sync when nav.js calls __eeSetRole ────────────────────────────
  // Patch after DOM ready so nav.js has had a chance to define it first
  function patchSetRole() {
    const original = window.__eeSetRole;
    window.__eeSetRole = function (role) {
      if (original) original(role);
      renderRoleBtn();
      renderPageLinks();
    };
  }

  // ── Mount ─────────────────────────────────────────────────────────────────
  const spacer = document.createElement("div");
  spacer.id = "__dev-nav-spacer__";
  spacer.style.cssText = "height:44px;";

  function mount() {
    renderPageLinks();
    document.body.appendChild(bar);
    document.body.appendChild(spacer);
    patchSetRole();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();

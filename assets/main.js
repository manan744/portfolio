/* ============================================================
   Manan Jain — portfolio behaviour
   chrome (nav/footer) · motion · terminal · palette · filters
   ============================================================ */

/* ---------- shared config ---------- */
const SITE = {
  LI: "https://www.linkedin.com/in/manan-jain-91616a184/",
  EMAIL: "jainmanan1804@gmail.com",
  RM: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  P: /\/(work|blog)\//.test(location.pathname) ? "../" : "",
  page: (location.pathname.split("/").pop() || "index.html"),
};

/* ============ 1. chrome: skip link, nav, footer (single source) ============ */
(function () {
  const P = SITE.P;
  const links = [
    ["work.html", "work"],
    ["blog.html", "blog"],
    ["ventures.html", "ventures"],
    ["resume.html", "resume"],
    ["about.html", "about"],
  ];
  const inWork = /\/work\//.test(location.pathname);
  const inBlog = /\/blog\//.test(location.pathname);
  const navLinks = links.map(([href, label]) => {
    const active =
      SITE.page === href ||
      (inWork && href === "work.html") ||
      (inBlog && href === "blog.html");
    return '<a href="' + P + href + '"' + (active ? ' class="active"' : "") + ">" + label + "</a>";
  }).join("\n      ");

  const menuLinks = links.map(([href, label]) => {
    const active = SITE.page === href || (inWork && href === "work.html") || (inBlog && href === "blog.html");
    return '<a href="' + P + href + '"' + (active ? ' class="active"' : "") + '><span class="mm-slash">./</span>' + label + "</a>";
  }).join("");

  document.body.insertAdjacentHTML(
    "afterbegin",
    '<a class="skip-link" href="#main-content">skip to content</a>' +
    '<nav><div class="nav-inner">' +
    '<a href="' + P + 'index.html" class="nav-logo"><span class="tilde">⎈ ~/</span>manan</a>' +
    '<button class="nav-burger" aria-label="open menu" aria-expanded="false">☰ menu</button>' +
    '<div class="nav-links">' + navLinks +
    '<a href="' + SITE.LI + '" target="_blank" rel="noopener">linkedin</a>' +
    '<a href="' + P + 'about.html#contact" class="nav-cta">contact</a>' +
    '<button class="kbd-hint" title="command palette (Ctrl/Cmd+K)">⌘K</button>' +
    "</div></div></nav>" +
    // full-screen mobile menu
    '<div class="mobile-menu" aria-hidden="true">' +
    '<button class="mm-close" aria-label="close menu">✕</button>' +
    '<div class="mm-links">' +
    '<a href="' + P + 'index.html"><span class="mm-slash">~/</span>home</a>' +
    menuLinks +
    '<a href="' + SITE.LI + '" target="_blank" rel="noopener"><span class="mm-slash">↗ </span>linkedin</a>' +
    '<a href="' + P + 'about.html#contact" class="mm-cta">✉ contact</a>' +
    "</div>" +
    '<div class="mm-foot mono">⎈ manan jain · bengaluru, IN</div>' +
    "</div>"
  );

  document.body.insertAdjacentHTML(
    "beforeend",
    "<footer>" +
    '<div class="status-bar">' +
    '<span class="pod-status">all systems operational</span>' +
    '<span class="mono faint">region: bengaluru, IN · tz: IST (GMT+5:30)</span>' +
    '<span class="mono faint">uptime: 4y8m and counting · response: &lt;24h</span>' +
    "</div>" +
    '<div class="foot-inner">' +
    '<span class="mono">© 2026 Manan Jain · built with caffeine and <span class="accent">terraform apply</span></span>' +
    '<div class="foot-social">' +
    '<a href="' + SITE.LI + '" target="_blank" rel="noopener">LinkedIn</a>' +
    '<a href="mailto:' + SITE.EMAIL + '">' + SITE.EMAIL + "</a>" +
    "</div></div></footer>"
  );

  // mobile menu toggle (full-screen overlay)
  const burger = document.querySelector(".nav-burger");
  const menu = document.querySelector(".mobile-menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.querySelector(".mm-close").addEventListener("click", () => setMenu(false));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // skip-link target: first content element after nav/aurora
  const mainEl = document.querySelector("header, section, .case-header");
  if (mainEl && !mainEl.id) mainEl.id = "main-content";

  // code-block copy buttons
  document.querySelectorAll(".code").forEach((block) => {
    const btn = block.querySelector(".code-copy");
    const pre = block.querySelector("pre");
    if (!btn || !pre) return;
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(pre.textContent).then(() => {
        btn.textContent = "copied ✓";
        setTimeout(() => (btn.textContent = "copy"), 1600);
      });
    });
  });
})();

/* ============ 2. motion: reveal, counters, card glow, pipeline, typing ============ */
(function () {
  // reveal on scroll
  if (SITE.RM) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("vis"));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("vis")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  // animated counters
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    if (SITE.RM) { el.textContent = target.toLocaleString(); return; }
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        const dur = 1400, t0 = performance.now();
        (function step(t) {
          const k = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(target * eased).toLocaleString();
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.4 });
    cio.observe(el);
  });

  // card cursor glow
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // pipeline animation
  const pipe = document.querySelector(".pipeline");
  if (pipe && !SITE.RM) {
    const stages = pipe.querySelectorAll(".pl-stage");
    let i = 0;
    setInterval(() => {
      stages.forEach((s, idx) => {
        s.classList.toggle("done", idx < i);
        s.classList.toggle("active", idx === i);
      });
      i = (i + 1) % (stages.length + 3);
    }, 900);
  } else if (pipe) {
    pipe.querySelectorAll(".pl-stage").forEach((s) => s.classList.add("done"));
  }

  // typing effect
  const typeEl = document.querySelector("[data-type]");
  if (typeEl) {
    const phrases = JSON.parse(typeEl.getAttribute("data-type"));
    if (SITE.RM) { typeEl.textContent = phrases[0]; return; }
    let p = 0, c = 0, del = false;
    (function tick() {
      const cur = phrases[p];
      typeEl.textContent = cur.slice(0, c);
      if (!del && c < cur.length) { c++; setTimeout(tick, 55); }
      else if (!del) { del = true; setTimeout(tick, 1900); }
      else if (c > 0) { c--; setTimeout(tick, 22); }
      else { del = false; p = (p + 1) % phrases.length; setTimeout(tick, 350); }
    })();
  }
})();

/* ============ 3. interactive terminal ============ */
(function () {
  const termIn = document.getElementById("term-input");
  const termOut = document.getElementById("term-output");
  if (!termIn || !termOut) return;

  const PODS = [
    "NAME                          READY   STATUS    RESTARTS   AGE",
    "gpu-llm-inference-platform    1/1     Running   0          1y",
    "ecs-cicd-platform-module      1/1     Running   0          2y",
    "eks-fleet-upgrader            1/1     Running   0          1y",
    "gitops-addon-platform         1/1     Running   0          1y",
    "fleet-health-suite            1/1     Running   0          1y",
    "bulk-cicd-modernizer          1/1     Running   0          8mo",
    "self-service-onboarder        1/1     Running   0          6mo",
    "k8s-agent                     1/1     Running   0          2mo",
    "k8lens-health-radar           1/1     Running   0          5mo",
    "manual-toil                   0/1     Evicted   ∞          <none>",
  ].join("\n");

  const CMDS = {
    help: [
      "available commands:",
      "  whoami               → who is this guy",
      "  work                 → featured projects",
      "  blog                 → field notes",
      "  ventures             → builder mindset",
      "  skills               → tech stack",
      "  services             → what I'm good at",
      "  contact              → get in touch",
      "  linkedin             → open my LinkedIn",
      "  kubectl get pods     → my projects, as pods",
      "  kubectl describe manan",
      "  helm install manan   → say hello",
      "  terraform apply      → make it official",
      "  uptime | clear | sudo",
    ].join("\n"),
    whoami: "manan jain — senior platform & cloud engineer.\nI've run large-scale kubernetes on AWS — 150+ EKS clusters,\n~1,000 nodes, 30K+ pods, 40+ teams — and built an LLM\ninference platform on 500+ spot GPUs.\nnow: building AI infrastructure @ aivar-innovation.",
    work: "featured work → ./work.html\n\n  [0] LLM inference platform on 500+ GPUs (~60% cheaper)\n  [1] terraform ECS multi-service CI/CD module\n  [2] EKS fleet upgrade orchestrator (150+ clusters)\n  [3] GitOps addon platform on ArgoCD (120+ apps)\n  [4] fleet health & observability (2,500+ endpoints)\n  [5] bulk CI/CD modernization (500+ pipelines)\n  [6] self-service onboarding & multi-tenancy\n  [7] k8sAgent — AI agent that speaks kubectl\n  [8] k8lens — in-cluster health radar",
    blog: "field notes → ./blog.html\n\n  [1] kro — custom k8s APIs without controllers (talk)\n  [2] the 4-layer GPU optimization stack\n  [3] the interruption-native GPU platform\n  [4] a doctrine for kubernetes fleet upgrades\n  [5] inventory-driven gitops\n  [6] the grounded agent — LLMs that operate infra\n  [7] probe-native observability",
    ventures: "the builder mindset → ./ventures.html\n\n  GlassMic        modernizing decorative & packaging glass mfg\n  AI Smart Insole iPhone TrueDepth scan → custom insole platform",
    skills: "languages   : python · hcl (terraform) · js/node · bash · yaml (too much yaml)\ncloud       : aws — eks, ecs, emr, ec2, s3, iam, vpc\nkubernetes  : argocd · helm · applicationsets · cilium · karpenter\nobservability: prometheus/amp · grafana · splunk · datadog\npractices   : gitops · blue/green & canary · iac modules ·\n              cross-account automation · fleet operations",
    services: "what I've gotten good at:\n\n  → platform engineering — reusable IaC modules your teams actually use\n  → kubernetes fleet ops — upgrades, addons, health at 150-cluster scale\n  → gpu/ai infrastructure — spot-backed, utilization-first, ~60% cheaper\n  → ci/cd & release engineering — blue/green, canary, zero-downtime\n  → reliability & observability — monitoring that finds issues before users do\n\nfull details → ./about.html",
    contact: "email    : jainmanan1804@gmail.com\nlinkedin : " + SITE.LI + "\nstatus   : heads-down @ aivar innovation — not job hunting\n\ntip: the fastest way is email. I reply.",
    linkedin: "__LINKEDIN__",
    "kubectl get pods": PODS,
    "kubectl get pods -a": PODS,
    "kubectl get nodes": "NAME             STATUS   ROLES            AGE   VERSION\nmanan-jain       Ready    platform,devops  4y8m  v2026.7-stable",
    "kubectl describe manan": "Name:         manan-jain\nKind:         PlatformEngineer\nStatus:       Running\nScale:        150+ eks clusters · 30K+ pods · 500+ gpus\nStrengths:    gpu/llm infra, gitops at scale, terraform modules\nEvents:\n  Type    Reason     Message\n  ----    ------     -------\n  Normal  Scheduled  running platform & AI infra @ aivar-innovation\n  Normal  Pulled     coffee successfully pulled\n  Normal  Started    ready to ship",
    "helm install manan": "NAME: manan\nSTATUS: deployed (at aivar-innovation)\nNOTES:\n  1. not on the market — but good conversations always install\n  2. email jainmanan1804@gmail.com · or run: linkedin",
    "terraform apply": "Plan: 1 connection to add, 0 to change, 0 to destroy.\n\nDo you want to perform these actions? yes\n\nconnection.manan: Creating...\nconnection.manan: Creation complete after 1s\n\nApply complete! Resources: 1 connection added, 0 destroyed.",
    "docker ps": "CONTAINER ID   IMAGE           STATUS        NAMES\nc0ffee1        manan:latest    Up 4y8m       caffeinated_turing",
    uptime: "up 4y8m, 150+ clusters served, load average: manageable",
    ls: "work.html   blog.html   ventures.html   resume.html   about.html   .secrets (permission denied)",
    sudo: "nice try. this incident will be reported.",
    exit: "there is no exit. only kubectl.",
  };

  function print(cmd) {
    const line = document.createElement("div");
    line.className = "prompt-line";
    line.innerHTML = '<span class="p">manan@prod-cluster</span><span class="faint">:</span><span class="path">~</span><span class="faint">$</span> ' + cmd.replace(/</g, "&lt;");
    termOut.appendChild(line);
    const key = cmd.trim().toLowerCase();
    if (key === "") return scrollBottom();
    if (key === "clear") { termOut.innerHTML = ""; return; }
    if (key === "linkedin") { window.open(SITE.LI, "_blank"); return appendOut("opening linkedin…"); }
    const res = CMDS[key];
    if (res !== undefined) return appendOut(res);
    if (key.startsWith("kubectl")) return appendOut("error: unknown command\ntry: kubectl get pods · kubectl get nodes · kubectl describe manan");
    if (key.startsWith("helm")) return appendOut("try: helm install manan");
    appendOut("command not found: " + key + "\ntry: help");
  }
  function appendOut(text) {
    const out = document.createElement("div");
    out.className = "out";
    out.textContent = text;
    termOut.appendChild(out);
    scrollBottom();
  }
  function scrollBottom() {
    const body = termOut.closest(".term-body");
    if (body) body.scrollTop = body.scrollHeight;
  }
  termIn.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { print(termIn.value); termIn.value = ""; }
  });
  termOut.closest(".term").addEventListener("click", () => termIn.focus());
  setTimeout(() => print("help"), 900);
})();

/* ============ 4. command palette + work filters ============ */
(function () {
  const P = SITE.P;
  const ITEMS = [
    { t: "⌂ home", d: "hero · terminal · engineer.yaml", u: P + "index.html" },
    { t: "▣ work — all case studies", d: "9 deep dives", u: P + "work.html" },
    { t: "✎ blog — field notes", d: "7 posts from fleet scale", u: P + "blog.html" },
    { t: "◆ ventures — builder mindset", d: "GlassMic · AI Smart Insole", u: P + "ventures.html" },
    { t: "≡ resume", d: "career rollout history · download CV", u: P + "resume.html" },
    { t: "● about", d: "story · toolbox · expertise", u: P + "about.html" },
    { t: "✉ contact", d: "email + linkedin", u: P + "about.html#contact" },
    { t: "⚡ GPU/LLM inference platform", d: "500+ spot GPUs · ~60% cost cut", u: P + "work/gpu-llm-platform.html" },
    { t: "⚙ ECS multi-service CI/CD module", d: "terraform · blue/green", u: P + "work/ecs-cicd-module.html" },
    { t: "⎈ EKS fleet upgrade orchestrator", d: "150+ clusters · 4-phase", u: P + "work/eks-fleet-upgrades.html" },
    { t: "⎈ GitOps addon delivery platform", d: "argocd · applicationsets", u: P + "work/gitops-addon-platform.html" },
    { t: "◉ fleet health & observability", d: "2,500+ endpoints · async", u: P + "work/fleet-observability.html" },
    { t: "⟳ bulk CI/CD modernization", d: "500+ pipelines in parallel", u: P + "work/bulk-cicd-modernization.html" },
    { t: "▶ self-service onboarding", d: "node + react · terraform gen", u: P + "work/onboarding-multitenancy.html" },
    { t: "🤖 k8sAgent — agentic SRE copilot", d: "convergence loop · MCP · langfuse", u: P + "work/k8s-agent.html" },
    { t: "◉ k8lens — in-cluster health radar", d: "asyncio · prometheus · helm", u: P + "work/k8lens.html" },
    { t: "✎ post: kro — APIs without controllers", d: "talk write-up · RGDs · CEL DAGs", u: P + "blog/kro-resource-orchestrator.html" },
    { t: "✎ post: 4-layer GPU optimization stack", d: "MIG+DRA · Kueue · Karpenter+KEDA · DCGM", u: P + "blog/gpu-optimization-stack.html" },
    { t: "✎ post: interruption-native GPU platform", d: "spot LLM inference architecture", u: P + "blog/spot-gpus-llm-inference.html" },
    { t: "✎ post: fleet upgrade doctrine", d: "rings · phases · proofs", u: P + "blog/upgrading-150-eks-clusters.html" },
    { t: "✎ post: inventory-driven GitOps", d: "the fleet as a directory tree", u: P + "blog/gitops-at-fleet-scale.html" },
    { t: "✎ post: the grounded agent", d: "LLMs that operate infrastructure", u: P + "blog/building-k8s-ai-agent.html" },
    { t: "✎ post: probe-native observability", d: "measuring what kubernetes cannot tell you", u: P + "blog/k8lens-async-health.html" },
    { t: "⬇ download CV (pdf)", d: "Manan-Jain-Resume.pdf", u: P + "assets/Manan-Jain-Resume-2026.pdf" },
    { t: "⧉ LinkedIn", d: "connect", u: SITE.LI },
    { t: "✉ email manan", d: SITE.EMAIL, u: "mailto:" + SITE.EMAIL },
  ];

  const pal = document.createElement("div");
  pal.className = "palette-overlay";
  pal.innerHTML =
    '<div class="palette"><div class="palette-head"><span class="mono faint">$</span>' +
    '<input class="palette-input" placeholder="jump to… (type to filter)" autocomplete="off" spellcheck="false">' +
    '<span class="palette-esc">esc</span></div><div class="palette-list"></div></div>';
  document.body.appendChild(pal);
  const input = pal.querySelector(".palette-input");
  const list = pal.querySelector(".palette-list");
  let sel = 0, shown = ITEMS;

  function render() {
    list.innerHTML = shown.map((it, i) =>
      '<a class="palette-item' + (i === sel ? " sel" : "") + '" href="' + it.u + '"' +
      (it.u.startsWith("http") ? ' target="_blank" rel="noopener"' : "") +
      '><span class="pi-t">' + it.t + '</span><span class="pi-d">' + it.d + "</span></a>"
    ).join("") || '<div class="palette-empty">no matches — try "work" or "resume"</div>';
  }
  function open() { pal.classList.add("show"); input.value = ""; shown = ITEMS; sel = 0; render(); setTimeout(() => input.focus(), 30); }
  function close() { pal.classList.remove("show"); }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.classList.contains("show") ? close() : open(); }
    else if (e.key === "Escape") close();
    else if (pal.classList.contains("show")) {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); render(); }
      if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
      if (e.key === "Enter" && shown[sel]) { const it = shown[sel]; it.u.startsWith("http") ? window.open(it.u, "_blank") : (location.href = it.u); close(); }
    }
  });
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    shown = ITEMS.filter((it) => (it.t + " " + it.d).toLowerCase().includes(q));
    sel = 0; render();
  });
  pal.addEventListener("click", (e) => { if (e.target === pal) close(); });
  document.querySelector(".kbd-hint").addEventListener("click", open);

  // work grid filters
  const tabs = document.querySelector("[data-filter-tabs]");
  if (tabs) {
    const cards = document.querySelectorAll("[data-cat]");
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-f]");
      if (!btn) return;
      tabs.querySelectorAll("[data-f]").forEach((b) => b.classList.toggle("on", b === btn));
      const f = btn.getAttribute("data-f");
      cards.forEach((c) => { c.style.display = (f === "all" || c.getAttribute("data-cat") === f) ? "" : "none"; });
    });
  }
})();

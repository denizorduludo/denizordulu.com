/* GSAP animasyonları: hero girişi, kaçan chip'ler, scroll-reveal
   — prefers-reduced-motion'a gsap.matchMedia ile saygı duyar. */
(function () {
  if (!window.gsap) return;
  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  document.addEventListener("DOMContentLoaded", function () {
    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", function () {
      /* ---------- HERO GİRİŞİ ---------- */
      if (document.querySelector(".hero__name")) {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".hero__name", { yPercent: 14, autoAlpha: 0, duration: 0.8 })
          .from(".hero__role", { y: 26, autoAlpha: 0, duration: 0.6 }, "-=0.45")
          .from(".hero__photo", { scale: 0.86, autoAlpha: 0, duration: 0.8, ease: "back.out(1.4)" }, "-=0.5")
          .from(".scatter .chip", {
            scale: 0.4, autoAlpha: 0, duration: 0.5, ease: "back.out(2)",
            stagger: { each: 0.07, from: "random" }
          }, "-=0.45")
          .from(".spin-badge", { scale: 0, rotate: -90, autoAlpha: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3");
      }

      /* ---------- KAÇAN CHIP'LER ---------- */
      var chips = gsap.utils.toArray(".scatter .chip");
      var rotMap = { c1: -4, c2: 3, c3: 2, c4: -2, c5: -3 };
      var RADIUS = 115;   // imlecin chip'i ittiği etki alanı (px)
      var movers = chips.map(function (chip) {
        var rk = Object.keys(rotMap).filter(function (k) { return chip.classList.contains(k); })[0];
        gsap.set(chip, { rotation: rk ? rotMap[rk] : 0 });
        return {
          el: chip,
          xTo: gsap.quickTo(chip, "x", { duration: 0.45, ease: "power3.out" }),
          yTo: gsap.quickTo(chip, "y", { duration: 0.45, ease: "power3.out" })
        };
      });

      function onMove(e) {
        var px = e.clientX, py = e.clientY;
        for (var i = 0; i < movers.length; i++) {
          var m = movers[i];
          var tx = gsap.getProperty(m.el, "x");
          var ty = gsap.getProperty(m.el, "y");
          var r = m.el.getBoundingClientRect();
          var cx = r.left + r.width / 2;
          var cy = r.top + r.height / 2;
          var dx = cx - px, dy = cy - py;
          var dist = Math.hypot(dx, dy) || 0.001;
          if (dist < RADIUS) {
            // chip'i imlecten RADIUS uzağa it (ev konumu = mevcut merkez - mevcut öteleme)
            var homeX = cx - tx, homeY = cy - ty;
            var ux = dx / dist, uy = dy / dist;
            m.xTo(px + ux * RADIUS - homeX);
            m.yTo(py + uy * RADIUS - homeY);
          } else {
            m.xTo(0);
            m.yTo(0);
          }
        }
      }
      if (movers.length) window.addEventListener("pointermove", onMove);

      /* ---------- SCROLL REVEAL ---------- */
      var triggers = [];
      if (window.ScrollTrigger) {
        var items = gsap.utils.toArray(
          ".lead, .work-card, .cta, .marquee, .fact, .tl-item, .gallery .shot, " +
          ".proj-summary, .proj-body, .contact-lines, .skills, .timeline"
        );
        items.forEach(function (el) {
          var t = gsap.from(el, {
            y: 42, autoAlpha: 0, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true }
          });
          if (t.scrollTrigger) triggers.push(t.scrollTrigger);
        });
      }

      /* ---------- temizlik (reduced-motion'a geçişte) ---------- */
      return function () {
        if (movers.length) window.removeEventListener("pointermove", onMove);
        movers.forEach(function (m) { gsap.set(m.el, { clearProps: "x,y" }); });
        triggers.forEach(function (t) { t.kill(); });
      };
    });
  });
})();

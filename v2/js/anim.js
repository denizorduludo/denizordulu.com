/* v2 — GSAP: scroll-reveal + mouse-proximity reveal
   prefers-reduced-motion'a gsap.matchMedia ile saygı duyar. */
(function () {
  if (!window.gsap) return;
  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  document.addEventListener("DOMContentLoaded", function () {
    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", function () {

      /* ---------- HERO GİRİŞİ (clip-reveal) — sadece ana sayfada ---------- */
      if (document.querySelector(".hero__name")) {
        gsap.timeline({ defaults: { ease: "power4.out" } })
          .from(".hero__name .ln i", { yPercent: 125, duration: 1.0, stagger: 0.12 })
          .from(".hero__featured .label", { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.08 }, "-=0.6")
          .from(".hero__counter", { autoAlpha: 0, y: 14, duration: 0.6 }, "<")
          .from(".hero__role", { autoAlpha: 0, y: 18, duration: 0.7 }, "-=0.45");
      }
      /* proje detay sayfasında büyük başlık clip-reveal */
      if (document.querySelector(".proj__name")) {
        gsap.from(".proj__name", { yPercent: 18, autoAlpha: 0, duration: 0.9, ease: "power4.out" });
      }

      /* ---------- SCROLL REVEAL ---------- */
      var triggers = [];
      if (window.ScrollTrigger) {
        gsap.utils.toArray(".reveal").forEach(function (el) {
          var t = gsap.from(el, {
            y: 36, autoAlpha: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true }
          });
          if (t.scrollTrigger) triggers.push(t.scrollTrigger);
        });
        window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
      }

      /* ---------- MOUSE PROXIMITY: mikro etiketler belirir ---------- */
      var plabels = gsap.utils.toArray(".plabel").map(function (el) {
        return {
          el: el,
          o: gsap.quickTo(el, "opacity", { duration: 0.4, ease: "power2" }),
          y: gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" })
        };
      });
      var PR = 240; // yakınlık yarıçapı

      /* ---------- imleç takip noktası ---------- */
      var dot = document.querySelector(".cursor-dot");
      var dx, dy;
      if (dot) {
        gsap.set(dot, { xPercent: -50, yPercent: -50 });
        dx = gsap.quickTo(dot, "x", { duration: 0.22, ease: "power3" });
        dy = gsap.quickTo(dot, "y", { duration: 0.22, ease: "power3" });
        document.querySelectorAll("a, button, .work-row").forEach(function (el) {
          el.addEventListener("pointerenter", function () { gsap.to(dot, { scale: 4, duration: 0.3, ease: "power2" }); });
          el.addEventListener("pointerleave", function () { gsap.to(dot, { scale: 1, duration: 0.3, ease: "power2" }); });
        });
      }

      function onMove(e) {
        if (dot) { dx(e.clientX); dy(e.clientY); gsap.to(dot, { opacity: 1, duration: 0.2, overwrite: "auto" }); }
        for (var i = 0; i < plabels.length; i++) {
          var p = plabels[i];
          var r = p.el.getBoundingClientRect();
          var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          var d = Math.hypot(cx - e.clientX, cy - e.clientY);
          var t = Math.max(0, 1 - d / PR);      // 0..1 (yakınlık)
          p.o(t);
          p.y((1 - t) * 12);                    // uzaktayken hafif aşağıda, yaklaşınca yukarı süzülür
        }
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerleave", function () {
        if (dot) gsap.to(dot, { opacity: 0, duration: 0.3 });
        plabels.forEach(function (p) { p.o(0); });
      });

      /* ---------- temizlik ---------- */
      return function () {
        window.removeEventListener("pointermove", onMove);
        triggers.forEach(function (t) { t.kill(); });
        gsap.set(".plabel", { clearProps: "opacity,transform" });
      };
    });
  });
})();

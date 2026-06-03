/* Nav + küçük etkileşimler */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // Mobil menü
    const burger = document.querySelector(".nav__burger");
    const links = document.querySelector(".nav__links");
    if (burger && links) {
      burger.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => links.classList.remove("open"))
      );
    }

    // Aktif sayfa işaretle
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__links a").forEach((a) => {
      const target = a.getAttribute("href").split("/").pop();
      if (target === here) a.setAttribute("aria-current", "page");
    });

    // Hafif parallax: hero chip'leri pointer'a göre çok az kayar (reduced-motion'da kapalı)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scatter = document.querySelector(".scatter");
    if (scatter && !reduce && window.matchMedia("(min-width: 861px)").matches) {
      const chips = Array.from(scatter.querySelectorAll(".chip"));
      const base = chips.map((c) => getComputedStyle(c).transform);
      window.addEventListener("pointermove", (e) => {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;
        chips.forEach((c, i) => {
          const depth = (i % 3) + 1;
          c.style.transform = `${base[i] === "none" ? "" : base[i]} translate(${cx * depth * 4}px, ${cy * depth * 4}px)`;
        });
      });
    }

    // Scroll reveal — öğeler görünüme girince yukarı süzülerek belirir
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!rm && "IntersectionObserver" in window) {
      const revealEls = document.querySelectorAll(
        ".section, .work-card, .cta, .marquee, .fact, .tl-item, .about-hero, .proj-head, .gallery .shot"
      );
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
    }
  });
})();

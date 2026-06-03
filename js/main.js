/* Nav + küçük etkileşimler (animasyonlar js/anim.js içinde, GSAP ile) */
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
  });
})();

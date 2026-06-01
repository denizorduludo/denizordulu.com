/* TR/EN dil geçişi — data-tr / data-en attribute'larını okur, localStorage'da saklar */
(function () {
  const STORAGE_KEY = "do-lang";
  const supported = ["tr", "en"];

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return supported.includes(saved) ? saved : "tr";
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;

    // Metin içerikleri
    document.querySelectorAll("[data-tr]").forEach((el) => {
      const val = el.getAttribute("data-" + lang);
      if (val !== null) el.innerHTML = val;
    });

    // Attribute çevirileri: data-tr-attr-<attr> / data-en-attr-<attr>
    document.querySelectorAll("[data-tr-attr-aria-label], [data-tr-attr-placeholder], [data-tr-attr-title]").forEach((el) => {
      ["aria-label", "placeholder", "title"].forEach((attr) => {
        const v = el.getAttribute("data-" + lang + "-attr-" + attr);
        if (v !== null) el.setAttribute(attr, v);
      });
    });

    // Toggle butonları
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-btn") === lang ? "true" : "false");
    });
  }

  function setLang(lang) {
    if (!supported.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyLang(getLang());
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-btn")));
    });
  });

  window.DOLang = { setLang, getLang };
})();

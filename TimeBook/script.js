(function () {
  "use strict";

  /* ── DOM refs ── */
  const $ = (id) => document.getElementById(id);

  const sH = $("startHour");
  const sM = $("startMin");
  const sP = $("startPer");
  const eH = $("endHour");
  const eM = $("endMin");
  const eP = $("endPer");
  const brk = $("breakVal");
  const err = $("errorMsg");
  const calcBtn = $("calcBtn");
  const copyBtn = $("copyBtn");
  const resetBtn = $("resetBtn");
  const themeBtn = $("themeBtn");
  const toast = $("toast");
  const resHm = $("resHm");
  const resDec = $("resDec");
  const resMin = $("resMin");
  const resBreak = $("resBreak");
  const barFill = $("barFill");
  const statsWrap = $("statsWrap");
  const barWrap = $("barWrap");
  const actionsWrap = $("actionsWrap");

  const OT_HOURS = 8;

  /* ── Populate selects ── */
  function populate(sel, n, start) {
    start = start || 1;
    for (let i = start; i <= n; i++) {
      const v = String(i).padStart(2, "0");
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      sel.appendChild(o);
    }
  }
  populate(sH, 12);
  populate(eH, 12);
  populate(sM, 59, 0);
  populate(eM, 59, 0);

  /* ── Theme ── */
  function getTheme() {
    return document.body.classList.contains("dark") ? "dark" : "light";
  }

  function setTheme(t) {
    document.body.classList.toggle("dark", t === "dark");
    themeBtn.innerHTML = t === "dark" ? "&#9790;" : "&#9788;";
    try {
      localStorage.setItem("wh-theme", t);
    } catch (_) {}
  }

  themeBtn.addEventListener("click", function () {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });

  try {
    var saved = localStorage.getItem("wh-theme");
    if (saved) setTheme(saved);
  } catch (_) {}

  /* ── Toast ── */
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 2000);
  }

  /* ── Validation helpers ── */
  function clsErr() {
    err.textContent = "";
    [sH, sM, eH, eM, brk].forEach(function (el) {
      el.classList.remove("input-err");
    });
  }

  function mark(el, msg) {
    el.classList.add("input-err");
    err.textContent = msg;
  }

  /* ── Calculate ── */
  function calculate() {
    clsErr();

    var sh = parseInt(sH.value, 10);
    var sm = parseInt(sM.value, 10);
    var sp = sP.value;
    var eh = parseInt(eH.value, 10);
    var em = parseInt(eM.value, 10);
    var ep = eP.value;
    var br = parseInt(brk.value, 10) || 0;

    var ok = true;
    if (isNaN(sh) || sh < 1 || sh > 12) {
      mark(sH, "Select start hour");
      ok = false;
    }
    if (isNaN(sm) || sm < 0 || sm > 59) {
      mark(sM, "Select start minute");
      ok = false;
    }
    if (isNaN(eh) || eh < 1 || eh > 12) {
      mark(eH, "Select end hour");
      ok = false;
    }
    if (isNaN(em) || em < 0 || em > 59) {
      mark(eM, "Select end minute");
      ok = false;
    }
    if (br < 0 || br > 1440) {
      mark(brk, "Break 0–1440 min");
      ok = false;
    }

    if (!ok) {
      hideResults();
      return;
    }

    function to24(h, m, p) {
      var dec = h + m / 60;
      if (p === "AM") return h === 12 ? m / 60 : dec;
      return h === 12 ? 12 + m / 60 : h + 12 + m / 60;
    }

    var sDec = to24(sh, sm, sp);
    var eDec = to24(eh, em, ep);

    if (eDec <= sDec) eDec += 24;

    var rawMin = (eDec - sDec) * 60;
    var netMin = Math.max(0, Math.round(rawMin * 100) / 100 - br);
    var netH = Math.floor(netMin / 60);
    var netM = Math.round(netMin % 60);

    resHm.textContent = netMin > 0 ? netH + "h " + netM + "m" : "0h 0m";
    resDec.textContent = (netMin / 60).toFixed(2);
    resMin.textContent = Math.round(netMin);
    resBreak.textContent = br + " min";

    var pct = Math.min(100, (netMin / (12 * 60)) * 100);
    barFill.style.width = pct + "%";

    showResults();
  }

  function showResults() {
    statsWrap.style.display = "grid";
    barWrap.style.display = "block";
    actionsWrap.style.display = "flex";
  }

  function hideResults() {
    statsWrap.style.display = "none";
    barWrap.style.display = "none";
    actionsWrap.style.display = "none";
  }

  /* ── Auto calculate ── */
  function autoCalc() {
    if (sH.value && sM.value && eH.value && eM.value) {
      calculate();
    }
  }

  var inputs = [sH, sM, sP, eH, eM, eP, brk];
  inputs.forEach(function (el) {
    el.addEventListener("change", autoCalc);
    el.addEventListener("input", autoCalc);
  });

  /* ── Calculate button ── */
  calcBtn.addEventListener("click", function (e) {
    e.preventDefault();
    calculate();
  });

  /* ── Reset ── */
  resetBtn.addEventListener("click", function () {
    sH.value = "";
    sM.value = "";
    sP.value = "AM";
    eH.value = "";
    eM.value = "";
    eP.value = "PM";
    brk.value = "30";
    clsErr();
    hideResults();
    showToast("Reset");
  });

  /* ── Copy ── */
  copyBtn.addEventListener("click", function () {
    var lines = [
      "Worked: " + resHm.textContent,
      "Decimal: " + resDec.textContent,
      "Minutes: " + resMin.textContent,
      "Break: " + resBreak.textContent,
    ];
    var text = lines.join("\n");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          showToast("Copied");
        },
        function () {
          fallback(text);
        }
      );
    } else {
      fallback(text);
    }
  });

  function fallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("Copied");
    } catch (_) {
      showToast("Copy failed");
    }
    document.body.removeChild(ta);
  }

  /* ── Keyboard ── */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.closest(".card")) {
      calculate();
    }
  });
})();

(function () {
  "use strict";

  var modal = document.getElementById("demo-modal");
  var openers = document.querySelectorAll("[data-open-demo]");
  var closers = document.querySelectorAll("[data-close-demo]");
  var mobileSticky = document.getElementById("mobile-demo-sticky");
  var exitHint = document.getElementById("exit-text-hint");
  var audioEl = document.getElementById("sample-audio");
  var postPlayCta = document.getElementById("post-play-cta");
  var demoError = document.getElementById("demo-error-fallback");
  var demoMain = document.getElementById("demo-modal-main");
  var fallbackPlay = document.getElementById("demo-fallback-play");
  var playSampleBtn = document.getElementById("play-sample-btn");
  var demoInteracted = false;

  function markDemoInteraction() {
    demoInteracted = true;
    document.body.classList.add("demo-interacted");
  }

  function openDemoModal() {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var params = new URLSearchParams(window.location.search);
    var showErr = params.get("demo_error") === "1";
    if (demoError) demoError.hidden = !showErr;
    if (demoMain) demoMain.hidden = showErr;
    var first = modal.querySelector(
      'button, [href], input, audio, [tabindex]:not([tabindex="-1"])'
    );
    if (first) first.focus();
    markDemoInteraction();
  }

  function closeDemoModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (demoError) demoError.hidden = true;
  }

  openers.forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openDemoModal();
    });
  });

  closers.forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      closeDemoModal();
    });
  });

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeDemoModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeDemoModal();
    });
  }

  function playSample() {
    if (audioEl) {
      audioEl.play().catch(function () {});
    }
  }

  if (fallbackPlay) {
    fallbackPlay.addEventListener("click", function () {
      if (demoError) demoError.hidden = true;
      if (demoMain) demoMain.hidden = false;
      playSample();
    });
  }

  if (playSampleBtn) {
    playSampleBtn.addEventListener("click", function () {
      playSample();
      if (audioEl) audioEl.focus();
    });
  }

  var maxScroll = 0;
  var scrollPct = 0;
  window.addEventListener("scroll", function () {
    var doc = document.documentElement;
    var total = doc.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    var y = window.scrollY || doc.scrollTop;
    maxScroll = Math.max(maxScroll, y);
    scrollPct = y / total;

    if (mobileSticky) {
      var showBar = scrollPct >= 0.5;
      mobileSticky.hidden = !showBar;
      document.body.classList.toggle("has-mobile-sticky", showBar);
    }

    if (exitHint && !demoInteracted && maxScroll > window.innerHeight * 0.4) {
      if (y < 120 && maxScroll > 300) {
        exitHint.hidden = false;
      }
    }
  });

  if (audioEl) {
    audioEl.addEventListener("ended", function () {
      window.setTimeout(function () {
        if (postPlayCta) postPlayCta.hidden = false;
      }, 400);
    });
    audioEl.addEventListener("play", function () {
      markDemoInteraction();
      if (postPlayCta) postPlayCta.hidden = true;
    });
  }

  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener("click", markDemoInteraction);
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1 && id.indexOf("#") === 0) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
})();

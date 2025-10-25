// content.js
(function () {
  "use strict";

  // inject css immediately before anything else loads
  injectCSS();

  // block ai overview
  chrome.storage.sync.get(["block_ai_enabled"], function (result) {
    const block_ai_enabled = result.block_ai_enabled !== false;

    if (block_ai_enabled) {
      blockAIOverview();
      setTimeout(blockAIOverview, 100);
      setTimeout(blockAIOverview, 500);
    }
  });

  // block navbar items
  chrome.storage.sync.get(["block_navbar_enabled"], function (result) {
    const block_navbar_enabled = result.block_navbar_enabled !== false;

    if (block_navbar_enabled) {
      blockNavbar();
      setTimeout(blockNavbar, 100);
      setTimeout(blockNavbar, 500);
    }
  });

  function injectCSS() {
    if (!document.getElementById("google-classic-style")) {
      const style = document.createElement("style");
      style.id = "google-classic-style";
      style.textContent = `
        /* hide ai overview immediately */
        .YzCcne,
        [data-mg-cp="YzCcne"],
        div[jsname="ZLxsqf"][data-lhcontainer="1"] {
          display: none !important;
        }
        
        /* fix tools and save button positioning on images tab */
        #hdtb-tls,
        .hdtb-tl-sel,
        .filter-link-selected,
        [role="button"][aria-haspopup="true"],
        .qs-ic {
          margin-left: 0 !important;
          margin-right: 8px !important;
        }
        
        /* fix top toolbar alignment */
        .hdtb-mitem,
        div[role="listitem"] {
          margin-right: 15px !important;
        }
        
        /* prevent layout shift */
        #top_nav,
        .hdtb-msel,
        .hdtb-mitem {
          float: left !important;
        }
        
        /* keep tools button aligned properly */
        #hdtb-more-mn {
          margin-left: auto !important;
        }
      `;
      document.head.appendChild(style);
      console.log("injected instant css fixes");
    }
  }

  function blockAIOverview() {
    console.log("running ai overview blocker...");
    let blocked = false;

    // target the yzccne class that wraps ai overview
    const aiContainers = document.querySelectorAll(".YzCcne");
    aiContainers.forEach((container) => {
      if (
        container.textContent.includes("AI Overview") ||
        container.textContent.includes("AI overview")
      ) {
        container.style.display = "none";
        console.log("blocked ai overview via yzccne class");
        blocked = true;
      }
    });

    // target by the specific heading structure
    const headings = document.querySelectorAll("h1");
    headings.forEach((h1) => {
      if (h1.textContent.trim() === "AI Overview") {
        let parent =
          h1.closest(".YzCcne") ||
          h1.closest("[data-mg-cp]") ||
          h1.closest(".EyBRub");

        if (parent) {
          parent.style.display = "none";
          console.log("blocked ai overview via h1 heading");
          blocked = true;
        }
      }
    });

    // target by data attributes
    const dataElements = document.querySelectorAll('[data-mg-cp="YzCcne"]');
    dataElements.forEach((el) => {
      el.style.display = "none";
      console.log("blocked ai overview via data-mg-cp");
      blocked = true;
    });

    // target the container with jsname
    const jsNameElements = document.querySelectorAll('[jsname="dEwkXc"]');
    jsNameElements.forEach((el) => {
      if (el.textContent.includes("AI Overview")) {
        let container =
          el.closest(".YzCcne") ||
          el.closest("[data-hveid]") ||
          el.parentElement;

        if (container) {
          container.style.display = "none";
          console.log("blocked ai overview via jsname");
          blocked = true;
        }
      }
    });

    // remove from dom entirely
    const nuclearTargets = document.querySelectorAll(
      '.YzCcne, [data-mg-cp="YzCcne"], div[jsname="ZLxsqf"]'
    );
    nuclearTargets.forEach((el) => {
      if (el.textContent.includes("AI Overview")) {
        el.remove();
        console.log("removed ai overview from dom");
        blocked = true;
      }
    });

    if (blocked) {
      console.log("ai overview successfully blocked");
    }
  }

  function blockNavbar() {
    console.log("cleaning navbar...");

    // remove by text content
    document.querySelectorAll('div[role="listitem"]').forEach((el) => {
      const text = el.textContent.trim();
      if (
        text.includes("AI Mode") ||
        text.includes("Short videos") ||
        text.includes("Forums") ||
        text.includes("Shopping")
      ) {
        console.log("removed navbar item:", text);
        el.remove();
      }
    });
  }

  // watch for dynamic changes but throttle it
  let timeoutId;
  const observer = new MutationObserver(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      chrome.storage.sync.get(
        ["block_ai_enabled", "block_navbar_enabled"],
        function (result) {
          if (result.block_ai_enabled !== false) {
            blockAIOverview();
          }
          if (result.block_navbar_enabled !== false) {
            blockNavbar();
          }
        }
      );
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

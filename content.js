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

  // move personalization notice to top
  movePersonalizationNotice();
  setTimeout(movePersonalizationNotice, 100);
  setTimeout(movePersonalizationNotice, 500);

  // enable website previews on hover
  enableWebsitePreviews();
  setTimeout(enableWebsitePreviews, 500);
  setTimeout(enableWebsitePreviews, 1000);

  function injectCSS() {
    if (!document.getElementById("google-classic-style")) {
      const style = document.createElement("style");
      style.id = "google-classic-style";
      style.textContent = `
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

        /* style for moved personalization notice */
        #personalization-notice-top {
          padding: 12px 16px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #dadce0;
          font-size: 13px;
          color: #5f6368;
          margin-bottom: 12px;
        }

        /* dark mode support for personalization notice */
        @media (prefers-color-scheme: dark) {
          #personalization-notice-top {
            background-color: #303134;
            border-bottom: 1px solid #5f6368;
            color: #bdc1c6;
          }
        }

        /* also support Google's dark mode class if present */
        html[data-color-scheme="dark"] #personalization-notice-top,
        body.dark #personalization-notice-top {
          background-color: #303134;
          border-bottom: 1px solid #5f6368;
          color: #bdc1c6;
        }

        /* website preview tooltip */
        #website-preview-tooltip {
          position: fixed;
          width: 400px;
          max-height: 300px;
          background: white;
          border: 1px solid #dadce0;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          z-index: 10000;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          overflow: hidden;
          padding: 12px;
        }

        #website-preview-tooltip.show {
          opacity: 1;
        }

        #website-preview-tooltip img {
          width: 100%;
          height: auto;
          border-radius: 4px;
          display: block;
        }

        #website-preview-tooltip .preview-info {
          margin-top: 8px;
        }

        #website-preview-tooltip .preview-title {
          font-size: 14px;
          font-weight: 500;
          color: #202124;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        #website-preview-tooltip .preview-url {
          font-size: 12px;
          color: #5f6368;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        #website-preview-tooltip .preview-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #5f6368;
          font-size: 14px;
        }

        /* dark mode for preview tooltip */
        @media (prefers-color-scheme: dark) {
          #website-preview-tooltip {
            background: #303134;
            border: 1px solid #5f6368;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
          }
          #website-preview-tooltip .preview-title {
            color: #e8eaed;
          }
          #website-preview-tooltip .preview-url,
          #website-preview-tooltip .preview-loading {
            color: #bdc1c6;
          }
        }

        html[data-color-scheme="dark"] #website-preview-tooltip,
        body.dark #website-preview-tooltip {
          background: #303134;
          border: 1px solid #5f6368;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        html[data-color-scheme="dark"] #website-preview-tooltip .preview-title,
        body.dark #website-preview-tooltip .preview-title {
          color: #e8eaed;
        }

        html[data-color-scheme="dark"] #website-preview-tooltip .preview-url,
        html[data-color-scheme="dark"] #website-preview-tooltip .preview-loading,
        body.dark #website-preview-tooltip .preview-url,
        body.dark #website-preview-tooltip .preview-loading {
          color: #bdc1c6;
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

  function enableWebsitePreviews() {
    console.log("enabling website previews...");

    // create tooltip element if it doesn't exist
    if (!document.getElementById("website-preview-tooltip")) {
      const tooltip = document.createElement("div");
      tooltip.id = "website-preview-tooltip";
      tooltip.innerHTML =
        '<div class="preview-loading">Loading preview...</div>';
      document.body.appendChild(tooltip);
    }

    const tooltip = document.getElementById("website-preview-tooltip");
    let hoverTimeout;

    // find all search result links
    const searchLinks = document.querySelectorAll("a[href]");

    searchLinks.forEach((link) => {
      // only target main result links with h3 headings
      const heading = link.querySelector("h3");
      if (!heading) return;

      // skip if already has event listeners
      if (link.dataset.previewEnabled) return;
      link.dataset.previewEnabled = "true";

      link.addEventListener("mouseenter", (e) => {
        const url = link.href;

        // skip google URLs and non-http(s) URLs
        if (!url || url.includes("google.com") || !url.startsWith("http")) {
          return;
        }

        // store mouse position for better tooltip placement
        const updatePosition = (event) => {
          if (tooltip.classList.contains("show")) {
            const tooltipX = Math.min(
              event.clientX + 15,
              window.innerWidth - 420
            );
            const tooltipY = Math.min(
              event.clientY + 15,
              window.innerHeight - 320
            );
            tooltip.style.left = tooltipX + "px";
            tooltip.style.top = tooltipY + "px";
          }
        };

        // delay showing preview by 300ms
        hoverTimeout = setTimeout(() => {
          // position tooltip near cursor
          const tooltipX = Math.min(e.clientX + 15, window.innerWidth - 420);
          const tooltipY = Math.min(e.clientY + 15, window.innerHeight - 320);

          tooltip.style.left = tooltipX + "px";
          tooltip.style.top = tooltipY + "px";

          // extract domain and title
          const urlObj = new URL(url);
          const domain = urlObj.hostname;
          const title = heading.textContent.trim();

          // use multiple screenshot services as fallbacks
          const thumbnailUrl1 = `https://api.thumbnail.ws/api/API_KEY/thumbnail/get?url=${encodeURIComponent(
            url
          )}&width=800`;
          const thumbnailUrl2 = `https://shot.screenshotapi.net/screenshot?token=YOUR_TOKEN&url=${encodeURIComponent(
            url
          )}&width=800&file_type=png&wait_for_event=load`;
          const thumbnailUrl3 = `https://mini.s-shot.ru/1024x768/JPEG/800/Z100/?${encodeURIComponent(
            url
          )}`;

          // create preview content with fallback to simple info card
          tooltip.innerHTML = `
            <img src="${thumbnailUrl3}" alt="Preview" onerror="this.parentElement.querySelector('.preview-error').style.display='block'; this.style.display='none';">
            <div class="preview-error" style="display:none; padding: 40px 20px; text-align: center; color: #5f6368; font-size: 13px;">
              <div style="font-size: 32px; margin-bottom: 10px;">🌐</div>
              <div>Preview unavailable</div>
            </div>
            <div class="preview-info">
              <div class="preview-title">${title}</div>
              <div class="preview-url">${domain}</div>
            </div>
          `;

          tooltip.classList.add("show");

          // track mouse movement while hovering
          link.addEventListener("mousemove", updatePosition);

          console.log("showing preview for:", url);
        }, 300);
      });

      link.addEventListener("mouseleave", () => {
        clearTimeout(hoverTimeout);
        tooltip.classList.remove("show");

        // clear content after fade out
        setTimeout(() => {
          tooltip.innerHTML =
            '<div class="preview-loading">Loading preview...</div>';
        }, 200);
      });
    });
  }

  function movePersonalizationNotice() {
    console.log("looking for personalization notice...");

    // check if already moved
    if (document.getElementById("personalization-notice-top")) {
      return;
    }

    // find the personalization notice
    const allElements = document.querySelectorAll("*");
    let personalizationElement = null;

    for (const el of allElements) {
      const text = el.textContent;
      if (
        text.includes("Results are personalized") &&
        text.includes("Try without personalization")
      ) {
        // make sure we get the actual container, not a parent with lots of content
        if (el.textContent.length < 200) {
          personalizationElement = el;
          break;
        }
      }
    }

    if (personalizationElement) {
      // find the main search results container
      const searchContainer =
        document.getElementById("search") ||
        document.getElementById("center_col") ||
        document.querySelector("#rcnt");

      if (searchContainer) {
        // create wrapper div
        const wrapper = document.createElement("div");
        wrapper.id = "personalization-notice-top";
        wrapper.innerHTML = personalizationElement.innerHTML;

        // insert at the top of search results
        searchContainer.insertBefore(wrapper, searchContainer.firstChild);

        // hide the original
        personalizationElement.style.display = "none";

        console.log("moved personalization notice to top");
      }
    }
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
          // also check for personalization notice on changes
          movePersonalizationNotice();
          // re-enable previews for new elements
          enableWebsitePreviews();
        }
      );
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

(function () {
  "use strict";

  // GLOBAL STATE - checked synchronously
  window.PREVIEW_ENABLED = true; // default to enabled

  // inject css immediately before anything else loads
  injectCSS();

  // Check if chrome.storage is available (extension context is valid)
  if (!chrome.storage) {
    console.log("Extension context invalidated, skipping initialization");
    return;
  }

  // block ai overview
  chrome.storage.sync.get(["block_ai_enabled"], function (result) {
    if (chrome.runtime.lastError) return;
    const block_ai_enabled = result.block_ai_enabled !== false;

    if (block_ai_enabled) {
      blockAIOverview();
      setTimeout(blockAIOverview, 100);
      setTimeout(blockAIOverview, 500);
    }
  });

  // block navbar items
  chrome.storage.sync.get(["block_navbar_enabled"], function (result) {
    if (chrome.runtime.lastError) return;
    const block_navbar_enabled = result.block_navbar_enabled !== false;

    if (block_navbar_enabled) {
      blockNavbar();
      setTimeout(blockNavbar, 100);
      setTimeout(blockNavbar, 500);
    }
  });

  // Initialize preview state
  chrome.storage.sync.get(["preview_enabled"], function (result) {
    if (chrome.runtime.lastError) return;
    window.PREVIEW_ENABLED = result.preview_enabled !== false;
    console.log("Initial preview state:", window.PREVIEW_ENABLED);

    // Always initialize previews, but they'll check the flag
    initializeWebsitePreviews();
    setTimeout(() => initializeWebsitePreviews(), 500);
    setTimeout(() => initializeWebsitePreviews(), 1000);
  });

  // Listen for storage changes - update global flag
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.preview_enabled) {
      window.PREVIEW_ENABLED = changes.preview_enabled.newValue;
      console.log("Preview state changed to:", window.PREVIEW_ENABLED);

      // Hide tooltip if disabling
      if (!window.PREVIEW_ENABLED) {
        const tooltip = document.getElementById("website-preview-tooltip");
        if (tooltip) {
          tooltip.classList.remove("show");
        }
      }
    }
  });

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

        /* enhanced website preview tooltip - apple-inspired design */
        #website-preview-tooltip {
          position: fixed;
          min-width: 380px;
          max-width: 450px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
          z-index: 10000;
          pointer-events: none;
          opacity: 0;
          transform: translateY(-8px) scale(0.96);
          transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          padding: 0;
        }

        #website-preview-tooltip.show {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        #website-preview-tooltip .preview-header {
          padding: 16px 18px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        #website-preview-tooltip .preview-favicon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          flex-shrink: 0;
          background: #f5f5f7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        #website-preview-tooltip .preview-favicon img {
          width: 24px;
          height: 24px;
          border-radius: 4px;
        }

        #website-preview-tooltip .preview-header-text {
          flex: 1;
          min-width: 0;
        }

        #website-preview-tooltip .preview-title {
          font-size: 15px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 3px;
          line-height: 1.3;
          max-height: 2.6em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          letter-spacing: -0.01em;
        }

        #website-preview-tooltip .preview-url {
          font-size: 12px;
          color: #86868b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #website-preview-tooltip .preview-body {
          padding: 16px 18px;
        }

        #website-preview-tooltip .preview-description {
          font-size: 13px;
          color: #424245;
          line-height: 1.6;
          max-height: 6em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          margin-bottom: 12px;
        }

        #website-preview-tooltip .preview-screenshot {
          width: 100%;
          height: 180px;
          border-radius: 8px;
          object-fit: cover;
          margin-bottom: 12px;
          background: #f5f5f7;
        }

        #website-preview-tooltip .preview-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }

        #website-preview-tooltip .preview-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 12px;
          letter-spacing: 0.01em;
        }

        #website-preview-tooltip .preview-tag.visited {
          background: rgba(0, 122, 255, 0.1);
          color: #0071e3;
        }

        #website-preview-tooltip .preview-tag.secure {
          background: rgba(52, 199, 89, 0.1);
          color: #30b560;
        }

        #website-preview-tooltip .preview-tag.warning {
          background: rgba(255, 149, 0, 0.1);
          color: #f5a623;
        }

        #website-preview-tooltip .preview-tag.info {
          background: rgba(88, 86, 214, 0.1);
          color: #5856d6;
        }

        #website-preview-tooltip .preview-tag.bias {
          background: rgba(175, 82, 222, 0.1);
          color: #af52de;
        }

        #website-preview-tooltip .preview-loading {
          padding: 24px;
          text-align: center;
          color: #86868b;
          font-size: 13px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        #website-preview-tooltip .preview-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(0, 113, 227, 0.2);
          border-top-color: #0071e3;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* dark mode for preview tooltip */
        @media (prefers-color-scheme: dark) {
          #website-preview-tooltip {
            background: rgba(44, 44, 46, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
          }
          #website-preview-tooltip .preview-header {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          #website-preview-tooltip .preview-favicon {
            background: #3a3a3c;
          }
          #website-preview-tooltip .preview-title {
            color: #f5f5f7;
          }
          #website-preview-tooltip .preview-url {
            color: #98989d;
          }
          #website-preview-tooltip .preview-description {
            color: #d1d1d6;
          }
          #website-preview-tooltip .preview-screenshot {
            background: #3a3a3c;
          }
          #website-preview-tooltip .preview-tag.visited {
            background: rgba(10, 132, 255, 0.2);
            color: #0a84ff;
          }
          #website-preview-tooltip .preview-tag.secure {
            background: rgba(48, 209, 88, 0.2);
            color: #30d158;
          }
          #website-preview-tooltip .preview-tag.warning {
            background: rgba(255, 159, 10, 0.2);
            color: #ff9f0a;
          }
          #website-preview-tooltip .preview-tag.info {
            background: rgba(94, 92, 230, 0.2);
            color: #bf5af2;
          }
          #website-preview-tooltip .preview-tag.bias {
            background: rgba(191, 90, 242, 0.2);
            color: #bf5af2;
          }
        }
      `;
      document.head.appendChild(style);
      console.log("injected instant css fixes");
    }
  }

  function blockAIOverview() {
    console.log("running ai overview blocker...");
    let blocked = false;

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

    const dataElements = document.querySelectorAll('[data-mg-cp="YzCcne"]');
    dataElements.forEach((el) => {
      el.style.display = "none";
      console.log("blocked ai overview via data-mg-cp");
      blocked = true;
    });

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

  // Cache for API responses to avoid duplicate requests
  const metadataCache = new Map();

  async function fetchWebsiteMetadata(url) {
    // Check cache first
    if (metadataCache.has(url)) {
      return metadataCache.get(url);
    }

    try {
      // Using microlink.io API - free tier allows 50 requests/day per IP
      const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(
        url
      )}&screenshot=true&meta=false&video=false`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === "success" && data.data) {
        const metadata = {
          title: data.data.title || null,
          description: data.data.description || null,
          image: data.data.screenshot?.url || data.data.image?.url || null,
          logo: data.data.logo?.url || null,
          url: data.data.url || url,
          lang: data.data.lang || null,
        };

        // Cache the result
        metadataCache.set(url, metadata);
        return metadata;
      }
    } catch (error) {
      console.log("Error fetching metadata:", error);
    }

    return null;
  }

  function initializeWebsitePreviews() {
    console.log("initializing website previews system...");

    if (!document.getElementById("website-preview-tooltip")) {
      const tooltip = document.createElement("div");
      tooltip.id = "website-preview-tooltip";
      document.body.appendChild(tooltip);
    }

    const tooltip = document.getElementById("website-preview-tooltip");
    let hoverTimeout;
    let hideTimeout;
    let currentLink = null;
    let isLoading = false;
    let isHoveringTooltip = false;
    let isHoveringLink = false;

    // Add hover listeners to tooltip itself
    tooltip.addEventListener("mouseenter", () => {
      isHoveringTooltip = true;
      clearTimeout(hideTimeout);
    });

    tooltip.addEventListener("mouseleave", () => {
      isHoveringTooltip = false;
      hideTimeout = setTimeout(() => {
        if (!isHoveringLink && !isHoveringTooltip) {
          tooltip.classList.remove("show");
          isLoading = false;
        }
      }, 100);
    });

    const searchLinks = document.querySelectorAll("a[href]");

    searchLinks.forEach((link) => {
      const heading = link.querySelector("h3");
      if (!heading) return;

      if (link.dataset.previewInitialized) return;
      link.dataset.previewInitialized = "true";

      link.addEventListener("mouseenter", async (e) => {
        // CRITICAL: Check global flag FIRST - synchronous check
        if (!window.PREVIEW_ENABLED) {
          console.log("Previews disabled, skipping");
          return;
        }

        const url = link.href;
        currentLink = link;
        isHoveringLink = true;
        clearTimeout(hideTimeout);

        if (!url || url.includes("google.com") || !url.startsWith("http")) {
          return;
        }

        hoverTimeout = setTimeout(async () => {
          // Double-check flag hasn't changed
          if (!window.PREVIEW_ENABLED) return;

          const padding = 20;
          const tooltipWidth = 450;
          const tooltipHeight = 300;

          let tooltipX = e.clientX + 15;
          let tooltipY = e.clientY + 15;

          if (tooltipX + tooltipWidth > window.innerWidth - padding) {
            tooltipX = e.clientX - tooltipWidth - 15;
          }
          if (tooltipY + tooltipHeight > window.innerHeight - padding) {
            tooltipY = e.clientY - tooltipHeight - 15;
          }

          tooltip.style.left = tooltipX + "px";
          tooltip.style.top = tooltipY + "px";

          // Show loading state
          tooltip.innerHTML = `
            <div class="preview-loading">
              <div class="preview-spinner"></div>
              <div>Loading preview...</div>
            </div>
          `;
          tooltip.classList.add("show");
          isLoading = true;

          // Fetch metadata from API
          const metadata = await fetchWebsiteMetadata(url);

          // Check if user is still hovering over the same link AND preview is still enabled
          if (currentLink !== link || !isLoading || !window.PREVIEW_ENABLED)
            return;

          const urlObj = new URL(url);
          const domain = urlObj.hostname.replace("www.", "");
          const isSecure = urlObj.protocol === "https:";

          // Use API data or fallback to Google search snippet
          const title = metadata?.title || heading.textContent.trim();
          let description = metadata?.description || "";

          // Fallback to Google's snippet if API didn't return description
          if (!description) {
            const resultContainer = link.closest(".g, .MjjYud");
            if (resultContainer) {
              const snippetEl = resultContainer.querySelector(
                '.VwiC3b, .lEBKkf, [data-sncf="1"]'
              );
              if (snippetEl) {
                description = snippetEl.textContent.trim();
              }
            }
          }

          const isVisited =
            link.matches(":visited") ||
            getComputedStyle(link).color !==
              getComputedStyle(link, ":link").color;

          const faviconUrl =
            metadata?.logo ||
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
          const screenshotUrl = metadata?.image;

          const tags = [];

          // Security status
          if (isSecure) {
            tags.push({ type: "secure", text: "Secure (HTTPS)", icon: "🔒" });
          } else {
            tags.push({ type: "warning", text: "Not Secure", icon: "⚠️" });
          }

          // Reliability & bias detection based on domain
          const knownReliable = [
            "wikipedia.org",
            "bbc.com",
            "reuters.com",
            "apnews.com",
            "nature.com",
            "science.org",
            "ncbi.nlm.nih.gov",
            "edu",
          ];

          const leftBias = [
            "huffpost.com",
            "msnbc.com",
            "cnn.com",
            "nytimes.com",
            "washingtonpost.com",
            "theguardian.com",
            "vox.com",
          ];

          const rightBias = [
            "foxnews.com",
            "breitbart.com",
            "dailywire.com",
            "newsmax.com",
            "oann.com",
            "nypost.com",
            "washingtontimes.com",
          ];

          // Check for reliability
          if (knownReliable.some((d) => domain.includes(d))) {
            tags.push({ type: "info", text: "High Reliability", icon: "✓" });
          }

          // Check for political bias
          if (leftBias.some((d) => domain.includes(d))) {
            tags.push({ type: "bias", text: "Left-Leaning", icon: "⬅️" });
          } else if (rightBias.some((d) => domain.includes(d))) {
            tags.push({ type: "bias", text: "Right-Leaning", icon: "➡️" });
          }

          // Site type detection
          if (domain.includes("wikipedia.org"))
            tags.push({ type: "info", text: "Encyclopedia", icon: "📚" });
          if (domain.includes("github.com"))
            tags.push({ type: "info", text: "Code", icon: "💻" });
          if (domain.includes("stackoverflow.com"))
            tags.push({ type: "info", text: "Q&A", icon: "❓" });
          if (domain.includes("reddit.com"))
            tags.push({ type: "info", text: "Forum", icon: "💬" });
          if (domain.includes("youtube.com") || domain.includes("vimeo.com"))
            tags.push({ type: "info", text: "Video", icon: "🎥" });
          if (domain.includes("twitter.com") || domain.includes("x.com"))
            tags.push({ type: "info", text: "Social", icon: "🐦" });
          if (domain.includes("linkedin.com"))
            tags.push({ type: "info", text: "Professional", icon: "💼" });

          tooltip.innerHTML = `
            <div class="preview-header">
              <div class="preview-favicon">
                <img src="${faviconUrl}" alt="" onerror="this.parentElement.innerHTML='🌐'">
              </div>
              <div class="preview-header-text">
                <div class="preview-title">${title}</div>
                <div class="preview-url">${domain}</div>
              </div>
            </div>
            <div class="preview-body">
              ${
                screenshotUrl
                  ? `<img class="preview-screenshot" src="${screenshotUrl}" alt="Site preview" onerror="this.style.display='none'">`
                  : ""
              }
              ${
                description
                  ? `<div class="preview-description">${description}</div>`
                  : ""
              }
              ${
                tags.length > 0
                  ? `
                <div class="preview-tags">
                  ${tags
                    .map(
                      (tag) => `
                    <span class="preview-tag ${tag.type}">${tag.icon} ${tag.text}</span>
                  `
                    )
                    .join("")}
                </div>
              `
                  : ""
              }
            </div>
          `;

          console.log("showing enhanced preview for:", url);
        }, 300);
      });

      link.addEventListener("mouseleave", () => {
        isHoveringLink = false;
        clearTimeout(hoverTimeout);

        hideTimeout = setTimeout(() => {
          if (!isHoveringLink && !isHoveringTooltip) {
            tooltip.classList.remove("show");
            currentLink = null;
            isLoading = false;
          }
        }, 100);
      });
    });
  }

  let timeoutId;
  const observer = new MutationObserver(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // Check if extension context is still valid
      if (!chrome.storage) return;

      chrome.storage.sync.get(
        ["block_ai_enabled", "block_navbar_enabled", "preview_enabled"],
        function (result) {
          if (chrome.runtime.lastError) return;

          if (result.block_ai_enabled !== false) {
            blockAIOverview();
          }
          if (result.block_navbar_enabled !== false) {
            blockNavbar();
          }
          // Always initialize previews for new elements - they'll check the flag
          initializeWebsitePreviews();
        }
      );
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

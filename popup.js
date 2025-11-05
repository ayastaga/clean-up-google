document.addEventListener("DOMContentLoaded", function () {
  const aiToggle = document.getElementById("toggleAIOverview");
  const navbarToggle = document.getElementById("toggleNavbar");
  const previewToggle = document.getElementById("togglePreview");
  const aiStatus = document.getElementById("aiStatus");
  const navbarStatus = document.getElementById("navbarStatus");
  const previewStatus = document.getElementById("previewStatus");

  // handle navbar toggling
  chrome.storage.sync.get(["block_navbar_enabled"], function (resultNavbar) {
    const isEnabled = resultNavbar.block_navbar_enabled !== false;
    navbarToggle.checked = isEnabled;
    updateNavbarStatus(isEnabled);
  });

  navbarToggle.addEventListener("change", function () {
    const enabled = navbarToggle.checked;
    chrome.storage.sync.set({ block_navbar_enabled: enabled }, function () {
      console.log("Navbar setting saved:", enabled);
      updateNavbarStatus(enabled);

      // Add delay to let storage sync complete
      setTimeout(() => {
        chrome.tabs.query({ url: "*://*.google.com/search*" }, function (tabs) {
          tabs.forEach((tab) => chrome.tabs.reload(tab.id));
        });
      }, 100);
    });
  });

  function updateNavbarStatus(enabled) {
    navbarStatus.textContent = enabled
      ? "Navbar is cleaned up"
      : "No changes made to navbar";
  }

  // handle ai overview toggling
  chrome.storage.sync.get(["block_ai_enabled"], function (resultAI) {
    const isEnabled = resultAI.block_ai_enabled !== false;
    aiToggle.checked = isEnabled;
    updateAIStatus(isEnabled);
  });

  aiToggle.addEventListener("change", function () {
    const enabled = aiToggle.checked;
    chrome.storage.sync.set({ block_ai_enabled: enabled }, function () {
      console.log("AI blocking setting saved:", enabled);
      updateAIStatus(enabled);

      // Add delay to let storage sync complete
      setTimeout(() => {
        chrome.tabs.query({ url: "*://*.google.com/search*" }, function (tabs) {
          tabs.forEach((tab) => chrome.tabs.reload(tab.id));
        });
      }, 100);
    });
  });

  function updateAIStatus(enabled) {
    aiStatus.textContent = enabled
      ? "AI Overview is blocked"
      : "AI Overview is visible";
  }

  // handle preview toggling - NO AUTO RELOAD for this one
  chrome.storage.sync.get(["preview_enabled"], function (resultPreview) {
    // Default to true if not set
    const isEnabled = resultPreview.preview_enabled !== false;
    previewToggle.checked = isEnabled;
    console.log("Preview initial state loaded:", isEnabled);
    updatePreviewStatus(isEnabled);
  });

  previewToggle.addEventListener("change", function () {
    const enabled = previewToggle.checked;
    chrome.storage.sync.set({ preview_enabled: enabled }, function () {
      console.log("Preview setting saved:", enabled);
      updatePreviewStatus(enabled);

      console.log(
        "Preview toggled - change will apply on next hover (no reload needed)"
      );
    });
  });

  function updatePreviewStatus(enabled) {
    previewStatus.textContent = enabled
      ? "Smart previews enabled"
      : "Previews disabled";
  }
});

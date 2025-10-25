document.addEventListener("DOMContentLoaded", function () {
  const aiToggle = document.getElementById("toggleAIOverview");
  const navbarToggle = document.getElementById("toggleNavbar");
  const aiStatus = document.getElementById("aiStatus");
  const navbarStatus = document.getElementById("navbarStatus");

  // handle navbar toggling
  chrome.storage.sync.get(["block_navbar_enabled"], function (resultNavbar) {
    navbarToggle.checked = resultNavbar.block_navbar_enabled !== false;
    updateNavbarStatus(navbarToggle.checked);
  });

  navbarToggle.addEventListener("change", function () {
    const enabled = navbarToggle.checked;
    chrome.storage.sync.set({ block_navbar_enabled: enabled }, function () {
      updateNavbarStatus(enabled);
      chrome.tabs.query({ url: "*://*.google.com/search*" }, function (tabs) {
        tabs.forEach((tab) => chrome.tabs.reload(tab.id));
      });
    });
  });

  function updateNavbarStatus(enabled) {
    navbarStatus.textContent = enabled
      ? "Navbar is cleaned up"
      : "No changes made to navbar";
  }

  // handle ai overview toggling
  chrome.storage.sync.get(["block_ai_enabled"], function (resultAI) {
    aiToggle.checked = resultAI.block_ai_enabled !== false;
    updateAIStatus(aiToggle.checked);
  });

  aiToggle.addEventListener("change", function () {
    const enabled = aiToggle.checked;
    chrome.storage.sync.set({ block_ai_enabled: enabled }, function () {
      updateAIStatus(enabled);
      chrome.tabs.query({ url: "*://*.google.com/search*" }, function (tabs) {
        tabs.forEach((tab) => chrome.tabs.reload(tab.id));
      });
    });
  });

  function updateAIStatus(enabled) {
    aiStatus.textContent = enabled
      ? "AI Overview is blocked"
      : "AI Overview is visible";
  }
});

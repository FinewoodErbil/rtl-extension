// scripts/background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.language) {
      // Optional: Add any background processing or logging for language change
      console.log('Language direction changed:', request.language);
    }
  });
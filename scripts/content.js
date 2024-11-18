// Content Script Implementation
import { rtlProcessor } from './rtl-processor.js';

let isRTLEnabled = false;

function toggleRTL() {
  isRTLEnabled = !isRTLEnabled;
  
  if (isRTLEnabled) {
    document.documentElement.setAttribute('dir', 'rtl');
    rtlProcessor.init();
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    rtlProcessor.cleanup();
    removeRTLProcessing();
  }
}

function removeRTLProcessing() {
  document.querySelectorAll('[data-rtl-processed]').forEach(element => {
    element.removeAttribute('data-rtl-processed');
    element.removeAttribute('data-original-center');
    element.removeAttribute('data-original-justify-center');
    element.classList.remove('rtl-flex', 'rtl-grid');
    
    // Reset inline styles
    element.style.removeProperty('--original-direction');
    element.style.removeProperty('--original-textAlign');
    element.style.removeProperty('--original-marginInlineStart');
    element.style.removeProperty('--original-marginInlineEnd');
    element.style.removeProperty('--original-paddingInlineStart');
    element.style.removeProperty('--original-paddingInlineEnd');
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleRTL') {
    toggleRTL();
    sendResponse({ success: true });
  }
});
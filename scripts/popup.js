document.getElementById('toggleRTL').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: toggleRTL
    });
  });
});

function toggleRTL() {
  const isCurrentlyRTL = document.documentElement.getAttribute('dir') === 'rtl';

  if (isCurrentlyRTL) {
    document.documentElement.setAttribute('dir', 'ltr');
    // Remove RTL styles and processing
    document.querySelectorAll('[data-rtl-processed]').forEach(el => {
      el.removeAttribute('data-rtl-processed');
      el.removeAttribute('data-original-center');
      el.removeAttribute('data-original-justify-center');
      el.removeAttribute('data-original-align-center');
      el.classList.remove('rtl-flex', 'rtl-grid');
    });
  } else {
    document.documentElement.setAttribute('dir', 'rtl');
    // Apply RTL processing
    document.querySelectorAll('*').forEach(el => {
      if (!el.hasAttribute('data-rtl-processed')) {
        const style = getComputedStyle(el);

        el.style.setProperty('--original-margin-start', style.marginInlineStart);
        el.style.setProperty('--original-margin-end', style.marginInlineEnd);
        el.style.setProperty('--original-padding-start', style.paddingInlineStart);
        el.style.setProperty('--original-padding-end', style.paddingInlineEnd);

        if (style.textAlign === 'center') {
          el.setAttribute('data-original-center', 'true');
        }

        el.setAttribute('data-rtl-processed', 'true');
      }
    });
  }
}
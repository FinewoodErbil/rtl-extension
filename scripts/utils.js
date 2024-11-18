// utils.js
const RTLUtils = {
  originalStyles: new WeakMap(),

  saveOriginalStyles(element) {
    if (this.originalStyles.has(element)) return;

    const style = getComputedStyle(element);
    this.originalStyles.set(element, {
      marginInlineStart: style.marginInlineStart,
      marginInlineEnd: style.marginInlineEnd,
      paddingInlineStart: style.paddingInlineStart,
      paddingInlineEnd: style.paddingInlineEnd,
      textAlign: style.textAlign,
      direction: style.direction,
      justifyContent: style.justifyContent,
      alignItems: style.alignItems
    });
  },

  processElement(element) {
    if (!element.hasAttribute('data-rtl-processed')) {
      this.saveOriginalStyles(element);
      const original = this.originalStyles.get(element);

      if (original) {
        element.style.setProperty('--original-margin-start', original.marginInlineStart);
        element.style.setProperty('--original-margin-end', original.marginInlineEnd);
        element.style.setProperty('--original-padding-start', original.paddingInlineStart);
        element.style.setProperty('--original-padding-end', original.paddingInlineEnd);

        // Preserve original centering
        if (original.textAlign === 'center') {
          element.setAttribute('data-original-center', 'true');
        }
        if (original.justifyContent === 'center') {
          element.setAttribute('data-original-justify-center', 'true');
        }
        if (original.alignItems === 'center') {
          element.setAttribute('data-original-align-center', 'true');
        }

        element.setAttribute('data-rtl-processed', 'true');
      }
    }
  },

  sendLanguageMessage(direction, backgroundColor) {
    try {
      chrome.runtime.sendMessage({
        language: { direction, backgroundColor }
      }).catch(err => console.debug(`${direction} message failed:`, err));
    } catch (err) {
      console.debug(`Error sending ${direction} message:`, err);
    }
  }
};
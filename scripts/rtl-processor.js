// Modern RTL Processing Implementation
class RTLProcessor {
    constructor() {
      this.originalStyles = new WeakMap();
      this.observer = null;
      this.processingQueue = new Set();
      this.initialized = false;
    }
  
    init() {
      if (this.initialized) return;
      this.setupMutationObserver();
      this.initialized = true;
    }
  
    setupMutationObserver() {
      this.observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.queueElementForProcessing(node);
              }
            });
          }
        }
        this.processQueue();
      });
  
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  
    queueElementForProcessing(element) {
      if (!this.processingQueue.has(element)) {
        this.processingQueue.add(element);
        requestAnimationFrame(() => this.processQueue());
      }
    }
  
    processQueue() {
      for (const element of this.processingQueue) {
        this.processElement(element);
      }
      this.processingQueue.clear();
    }
  
    processElement(element) {
      if (element.hasAttribute('data-rtl-processed')) return;
  
      const style = getComputedStyle(element);
      this.saveOriginalStyles(element, style);
      this.applyRTLStyles(element, style);
      
      // Process children
      element.querySelectorAll('*').forEach(child => {
        if (!child.hasAttribute('data-rtl-processed')) {
          this.queueElementForProcessing(child);
        }
      });
    }
  
    saveOriginalStyles(element, style) {
      this.originalStyles.set(element, {
        direction: style.direction,
        textAlign: style.textAlign,
        marginInlineStart: style.marginInlineStart,
        marginInlineEnd: style.marginInlineEnd,
        paddingInlineStart: style.paddingInlineStart,
        paddingInlineEnd: style.paddingInlineEnd,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems
      });
    }
  
    applyRTLStyles(element, style) {
      const original = this.originalStyles.get(element);
      
      element.setAttribute('data-rtl-processed', 'true');
      
      // Set CSS custom properties for margins and paddings
      Object.entries(original).forEach(([prop, value]) => {
        element.style.setProperty(`--original-${prop}`, value);
      });
  
      // Handle special alignments
      if (original.textAlign === 'center') {
        element.setAttribute('data-original-center', 'true');
      }
      if (original.justifyContent === 'center') {
        element.setAttribute('data-original-justify-center', 'true');
      }
  
      // Handle flex containers
      if (style.display === 'flex') {
        element.classList.add('rtl-flex');
      }
  
      // Handle grid containers
      if (style.display === 'grid') {
        element.classList.add('rtl-grid');
      }
    }
  
    cleanup() {
      if (this.observer) {
        this.observer.disconnect();
      }
      this.processingQueue.clear();
      this.originalStyles = new WeakMap();
      this.initialized = false;
    }
  }
  
  // Export for use in other modules
  export const rtlProcessor = new RTLProcessor();
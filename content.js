// Content script for injecting the text formatter into web pages
let formatterWidget = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openFormatter') {
    createFormatterWidget(request.text);
  }
});

// Create keyboard shortcut listener
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Shift + F to toggle formatter
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    if (formatterWidget) {
      removeFormatterWidget();
    } else {
      createFormatterWidget();
    }
  }
});

function createFormatterWidget(initialText = '') {
  if (formatterWidget) {
    removeFormatterWidget();
  }

  // Create the widget container
  formatterWidget = document.createElement('div');
  formatterWidget.id = 'text-alchemy-widget';
  formatterWidget.innerHTML = `
    <div class="tf-widget-overlay">
      <div class="tf-widget-container">
        <div class="tf-widget-header">
          <h3>TextAlchemy</h3>
          <div class="tf-widget-controls">
            <button id="tf-minimize" title="Minimize">−</button>
            <button id="tf-close" title="Close">×</button>
          </div>
        </div>
        <div class="tf-widget-content">
          <div class="tf-input-section">
            <textarea id="tf-input" placeholder="Type your text here..." rows="3">${initialText}</textarea>
          </div>
          <div class="tf-results-section">
            <div id="tf-results" class="tf-results-container"></div>
            <div class="tf-more-section">
              <button id="tf-show-more" class="tf-more-button">Show More Styles</button>
            </div>
            <div id="tf-more-results" class="tf-more-results" style="display: none;"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add to page
  document.body.appendChild(formatterWidget);

  // Initialize functionality
  initializeWidget();
}

function initializeWidget() {
  const input = document.getElementById('tf-input');
  const results = document.getElementById('tf-results');
  const moreResults = document.getElementById('tf-more-results');
  const showMoreBtn = document.getElementById('tf-show-more');
  const closeBtn = document.getElementById('tf-close');
  const minimizeBtn = document.getElementById('tf-minimize');

  let isMinimized = false;
  let showingMore = false;

  // Event listeners
  input.addEventListener('input', updateResults);
  showMoreBtn.addEventListener('click', toggleMoreStyles);
  closeBtn.addEventListener('click', removeFormatterWidget);
  minimizeBtn.addEventListener('click', toggleMinimize);

  // Initialize results
  updateResults();

  function updateResults() {
    const text = input.value;
    const top10Styles = window.TextFormatter.getTop10();
    const moreStyles = window.TextFormatter.getMoreStyles();

    // Update top 10 results
    results.innerHTML = top10Styles.map(style => {
      const formattedText = text ? window.TextFormatter.format(text, style.key) : '';
      return createStyleItem(style, formattedText);
    }).join('');

    // Update more results if showing
    if (showingMore) {
      moreResults.innerHTML = moreStyles.map(style => {
        const formattedText = text ? window.TextFormatter.format(text, style.key) : '';
        return createStyleItem(style, formattedText);
      }).join('');
    }

    // Add copy event listeners
    addCopyListeners();
  }

  function createStyleItem(style, formattedText) {
    return `
      <div class="tf-style-item">
        <div class="tf-style-content">
          <div class="tf-style-name">${style.name}</div>
          <div class="tf-style-result">${formattedText || 'Type something to see the result...'}</div>
        </div>
        <button class="tf-copy-btn" data-text="${encodeURIComponent(formattedText)}" ${!formattedText ? 'disabled' : ''}>
          Copy
        </button>
      </div>
    `;
  }

  function addCopyListeners() {
    document.querySelectorAll('.tf-copy-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const text = decodeURIComponent(e.target.dataset.text);
        if (!text) return;

        try {
          await navigator.clipboard.writeText(text);
          e.target.textContent = '✓';
          e.target.classList.add('tf-copied');
          setTimeout(() => {
            e.target.textContent = 'Copy';
            e.target.classList.remove('tf-copied');
          }, 1000);
        } catch (err) {
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          e.target.textContent = '✓';
          setTimeout(() => e.target.textContent = 'Copy', 1000);
        }
      });
    });
  }

  function toggleMoreStyles() {
    showingMore = !showingMore;
    if (showingMore) {
      moreResults.style.display = 'block';
      showMoreBtn.textContent = 'Show Less';
      updateResults();
    } else {
      moreResults.style.display = 'none';
      showMoreBtn.textContent = 'Show More Styles';
    }
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
    const content = document.querySelector('.tf-widget-content');
    const container = document.querySelector('.tf-widget-container');
    
    if (isMinimized) {
      content.style.display = 'none';
      container.style.height = 'auto';
      minimizeBtn.textContent = '+';
    } else {
      content.style.display = 'block';
      container.style.height = '600px';
      minimizeBtn.textContent = '−';
    }
  }
}

function removeFormatterWidget() {
  if (formatterWidget) {
    formatterWidget.remove();
    formatterWidget = null;
  }
}

// Make TextFormatter available if not already loaded
if (!window.TextFormatter) {
  // Load the text formatter utilities
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('textFormatter.js');
  document.head.appendChild(script);
}
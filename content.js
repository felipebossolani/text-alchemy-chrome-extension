// TextAlchemy Content Script
// This is the standalone JavaScript version for content script injection

// Global variable to store the widget reference
let formatterWidget = null;

// Text formatting functions
const textStyles = {
  bold: (text) => text.split('').map(char => {
    const boldMap = {
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
      '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };
    return boldMap[char] || char;
  }).join(''),
  
  italic: (text) => text.split('').map(char => {
    const italicMap = {
      'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧',
      'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
    };
    return italicMap[char] || char;
  }).join('')
};

function showCopySuccess(button) {
  const btn = button;
  const originalText = btn.textContent;
  btn.textContent = '✓';
  btn.classList.add('tf-copied');
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove('tf-copied');
  }, 1000);
}

function createStyleItem(style, formattedText) {
  const item = document.createElement('div');
  item.className = 'tf-style-item';
  item.innerHTML = `
    <div class="tf-style-content">
      <div class="tf-style-name">${style.name}</div>
      <div class="tf-style-result">${formattedText || 'Type something to see the result...'}</div>
    </div>
    <button class="tf-copy-btn" data-text="${encodeURIComponent(formattedText)}" ${!formattedText ? 'disabled' : ''}>
      Copy
    </button>
  `;
  return item;
}

function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopySuccess(button);
  } catch (err) {
    console.error('Unable to copy text: ', err);
  }
  
  document.body.removeChild(textArea);
}

function addCopyListeners() {
  const copyButtons = document.querySelectorAll('.tf-copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const encodedText = this.getAttribute('data-text');
      const text = decodeURIComponent(encodedText);
      
      if (!text) return;
      
      // Try to copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showCopySuccess(this);
        }).catch(() => {
          fallbackCopyTextToClipboard(text, this);
        });
      } else {
        fallbackCopyTextToClipboard(text, this);
      }
    });
  });
}

function removeFormatterWidget() {
  if (formatterWidget) {
    formatterWidget.remove();
    formatterWidget = null;
  }
}

function initializeWidget() {
  const input = document.getElementById('tf-input');
  const results = document.getElementById('tf-results');
  const moreResults = document.getElementById('tf-more-results');
  const showMoreBtn = document.getElementById('tf-show-more');
  const closeBtn = document.getElementById('tf-close');
  const clearBtn = document.getElementById('tf-clear');
  const charCount = document.querySelector('.tf-char-count');
  const emptyState = document.getElementById('tf-empty-state');

  let showingMore = false;

  function updateResults() {
    const text = input.value;
    const textLength = text.length;
    
    // Update character count
    charCount.textContent = `${textLength}/500`;
    
    // Show/hide clear button
    if (text.length > 0) {
      clearBtn.style.display = 'block';
    } else {
      clearBtn.style.display = 'none';
    }
    
    // Show/hide empty state
    if (text.trim().length === 0) {
      emptyState.style.display = 'flex';
      results.style.display = 'none';
      showMoreBtn.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      results.style.display = 'flex';
      showMoreBtn.style.display = 'block';
      
      const basicStyles = [
        { name: 'Bold', func: textStyles.bold },
        { name: 'Italic', func: textStyles.italic }
      ];

      // Update results
      results.innerHTML = basicStyles.map(style => {
        const formattedText = style.func(text);
        return createStyleItem(style, formattedText).outerHTML;
      }).join('');
      
      // Update more results if showing
      if (showingMore) {
        const moreStyles = [
          { name: 'Cursive', func: (t) => `𝒞𝓊𝓇𝓈𝒾𝓋𝑒 ${t}` },
          { name: 'Bubble', func: (t) => `ⓑⓤⓑⓑⓛⓔ ${t}` }
        ];
        
        moreResults.innerHTML = moreStyles.map(style => {
          const formattedText = style.func(text);
          return createStyleItem(style, formattedText).outerHTML;
        }).join('');
        moreResults.style.display = 'block';
      }
      
      // Add copy event listeners
      addCopyListeners();
    }
  }

  function clearInput() {
    input.value = '';
    updateResults();
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

  // Event listeners
  input.addEventListener('input', updateResults);
  showMoreBtn.addEventListener('click', toggleMoreStyles);
  closeBtn.addEventListener('click', removeFormatterWidget);
  clearBtn.addEventListener('click', clearInput);

  // Initialize results
  updateResults();
}

function createFormatterWidget(initialText = '') {
  // Create the widget container
  formatterWidget = document.createElement('div');
  formatterWidget.id = 'text-alchemy-widget';
  formatterWidget.innerHTML = `
    <div class="tf-widget-overlay">
      <div class="tf-widget-container">
        <!-- Header with gradient background -->
        <div class="tf-widget-header">
          <div class="tf-header-content">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="TextAlchemy" class="tf-icon" style="display: none;">
            <h1 class="tf-title">TextAlchemy</h1>
            <p class="tf-subtitle">Transform your text with magical styles</p>
          </div>
          <div class="tf-widget-controls">
            <button id="tf-close" title="Close">×</button>
          </div>
        </div>
        
        <!-- Input Section -->
        <div class="tf-input-section">
          <textarea id="tf-input" placeholder="Type your text here..." maxlength="500">${initialText}</textarea>
          <div class="tf-input-footer">
            <span class="tf-char-count">0/500</span>
            <button id="tf-clear" class="tf-clear-btn" style="display: none;">Clear</button>
          </div>
        </div>
        
        <!-- Styles Section -->
        <div class="tf-styles-section">
          <div class="tf-styles-header">
            <h2 class="tf-styles-title">Text Styles</h2>
          </div>
          <div class="tf-results-container">
            <div id="tf-results" class="tf-results"></div>
            <div id="tf-empty-state" class="tf-empty-state">
              <div class="tf-empty-icon">✨</div>
              <div class="tf-empty-text">Type something to see magical styles</div>
            </div>
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

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'openTextFormatter') {
    // Remove existing widget if any
    removeFormatterWidget();
    
    // Create new widget with selected text
    createFormatterWidget(request.text || '');
  }
});

// Check if widget already exists and create if not
if (document.getElementById('tf-widget-container')) {
  console.log('TextAlchemy widget already exists');
} else {
  // Create and inject the widget
  createFormatterWidget();
}
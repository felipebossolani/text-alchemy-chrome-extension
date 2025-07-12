import React, { useState, useEffect, useCallback } from 'react';
import { textFormatter, TextStyle } from '@utils/textFormatter';

interface FormattedText {
  key: string;
  style: TextStyle;
  text: string;
}

export default function Popup(): React.JSX.Element {
  const [inputText, setInputText] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [copiedStyle, setCopiedStyle] = useState<string | null>(null);
  const [formattedTexts, setFormattedTexts] = useState<FormattedText[]>([]);

  // Update formatted texts when input changes
  useEffect(() => {
    if (!inputText.trim()) {
      setFormattedTexts([]);
      return;
    }

    const styles = showMore ? textFormatter.getAllStyles() : textFormatter.getTop10();
    const formatted = styles.map(style => ({
      key: style.name.toLowerCase().replace(/\s+/g, ''),
      style,
      text: style.convert(inputText)
    }));
    setFormattedTexts(formatted);
  }, [inputText, showMore]);

  // Copy text to clipboard
  const copyToClipboard = useCallback(async (text: string, styleKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStyle(styleKey);
      setTimeout(() => setCopiedStyle(null), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedStyle(styleKey);
      setTimeout(() => setCopiedStyle(null), 2000);
    }
  }, []);

  // Clear input
  const clearText = useCallback(() => {
    setInputText('');
  }, []);

  // Open in page (send message to content script)
  const openInPage = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, {
          action: 'openFormatter',
          text: inputText
        });
        window.close();
      }
    });
  }, [inputText]);

  return (
    <div className="w-96 bg-base-100 p-4" data-theme="light">
      {/* Header */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-content font-bold text-lg">T</span>
          </div>
          <h1 className="text-xl font-bold text-primary">TextAlchemy</h1>
        </div>
        <p className="text-sm text-base-content/70">Transform your text with magical styles</p>
      </div>

      {/* Input Section */}
      <div className="mb-4">
        <div className="form-control">
          <textarea
            className="textarea textarea-bordered h-20 resize-none"
            placeholder="Type your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-base-content/60">
              {inputText.length}/500
            </span>
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={clearText}
                disabled={!inputText}
              >
                Clear
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={openInPage}
              >
                Open in Page
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {formattedTexts.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Text Styles</h3>
            <span className="text-sm text-base-content/60">
              {formattedTexts.length} styles
            </span>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {formattedTexts.map(({ key, style, text }) => (
              <div key={key} className="card bg-base-200 p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-base-content/70 mb-1">
                      {style.name}
                    </div>
                    <div className="text-sm break-all font-mono">
                      {text}
                    </div>
                  </div>
                  <button
                    className={`btn btn-xs ${copiedStyle === key ? 'btn-success' : 'btn-outline'}`}
                    onClick={() => copyToClipboard(text, key)}
                  >
                    {copiedStyle === key ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          <div className="mt-3 text-center">
            <button
              className="btn btn-outline btn-sm w-full"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? 'Show Less' : 'Show More Styles'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-base-content/50">
        <span>TextAlchemy v1.0.0</span>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-xs">⚙️</button>
          <button className="btn btn-ghost btn-xs">❓</button>
        </div>
      </div>
    </div>
  );
}

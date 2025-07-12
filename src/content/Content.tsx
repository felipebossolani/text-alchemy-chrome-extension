import React, { useState, useEffect, useCallback, useRef } from 'react';
import { textFormatter, TextStyle } from '@utils/textFormatter';

interface FormattedText {
  key: string;
  style: TextStyle;
  text: string;
}

interface ContentProps {
  initialText?: string;
}

export default function Content({ initialText = '' }: ContentProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(initialText);
  const [showMore, setShowMore] = useState(false);
  const [copiedStyle, setCopiedStyle] = useState<string | null>(null);
  const [formattedTexts, setFormattedTexts] = useState<FormattedText[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

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

  // Clear text
  const clearText = useCallback(() => {
    setInputText('');
  }, []);

  // Close widget
  const closeWidget = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Minimize widget
  const minimizeWidget = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      const rect = widgetRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  }, []);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closeWidget();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeWidget]);

  // Listen for messages from popup
  useEffect(() => {
    const handleMessage = (request: any) => {
      if (request.action === 'openFormatter') {
        setIsOpen(true);
        if (request.text) {
          setInputText(request.text);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  if (!isOpen) {
    return <></>;
  }

  return (
    <div
      ref={widgetRef}
      className="fixed z-[999999] select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div
        className={`bg-base-100 border border-base-300 rounded-lg shadow-xl transition-all duration-300 ${
          isMinimized ? 'w-64 h-12' : 'w-96'
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-base-300 bg-base-200 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-content font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-sm">TextAlchemy</span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={minimizeWidget}
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? '□' : '−'}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={closeWidget}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4">
            {/* Input Section */}
            <div className="mb-4">
              <div className="form-control">
                <textarea
                  className="textarea textarea-bordered h-20 resize-none text-sm"
                  placeholder="Type your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-base-content/60">
                    {inputText.length}/500
                  </span>
                  <button
                    type="button"
                    className="btn btn-xs btn-outline"
                    onClick={clearText}
                    disabled={!inputText}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {formattedTexts.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-sm">Text Styles</h3>
                  <span className="text-xs text-base-content/60">
                    {formattedTexts.length} styles
                  </span>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formattedTexts.map(({ key, style, text }) => (
                    <div key={key} className="card bg-base-200 p-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-base-content/70 mb-1">
                            {style.name}
                          </div>
                          <div className="text-xs break-all font-mono">
                            {text}
                          </div>
                        </div>
                        <button
                          type="button"
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
                    type="button"
                    className="btn btn-outline btn-xs w-full"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? 'Show Less' : 'Show More Styles'}
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center text-xs text-base-content/50">
              <span>v1.0.0</span>
              <div className="flex gap-1">
                <button type="button" className="btn btn-ghost btn-xs">⚙️</button>
                <button type="button" className="btn btn-ghost btn-xs">❓</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

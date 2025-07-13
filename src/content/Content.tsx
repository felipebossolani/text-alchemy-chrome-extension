import React, { useState, useEffect, useCallback, useRef } from 'react';
import { textFormatter, TextStyle } from '@utils/textFormatter';

interface FormattedText {
  key: string;
  style: TextStyle;
  text: string;
}

// eslint-disable-next-line react/require-default-props
interface ContentProps {
  initialText?: string;
}

interface BackgroundMessage {
  action: string;
  text?: string;
}

export default function Content({ initialText = '' }: ContentProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(initialText);
  const [showMore, setShowMore] = useState(false);
  const [copiedStyle, setCopiedStyle] = useState<string | null>(null);
  const [formattedTexts, setFormattedTexts] = useState<FormattedText[]>([]);
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

  // Close widget
  const closeWidget = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  // Handle mouse movement for dragging
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
      if (e.key === 'Escape') {
        closeWidget();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeWidget]);

  // Handle messages from background script
  useEffect(() => {
    const handleMessage = (request: BackgroundMessage) => {
      if (request.action === 'openTextFormatter') {
        setInputText(request.text || '');
        setIsOpen(true);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  if (!isOpen) return <div />;

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
      <div className="bg-base-100 border border-base-300 rounded-lg shadow-xl transition-all duration-300 w-96">
        {/* Header */}
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 border-b border-base-300 bg-base-200 rounded-t-lg cursor-move hover:bg-base-300 transition-colors"
          onMouseDown={handleMouseDown}
          aria-label="Drag to move window"
        >
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
              onClick={(e) => {
                e.stopPropagation();
                closeWidget();
              }}
              title="Close"
            >
              ×
            </button>
          </div>
        </button>

        {/* Content */}
        <div className="p-4">
          {/* Input Section */}
          <div className="mb-4">
            <textarea
              className="textarea textarea-bordered w-full h-24 text-sm resize-none"
              placeholder="Type your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-base-content/60">
                {inputText.length}/500
              </span>
              {inputText && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setInputText('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          {formattedTexts.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs text-base-content/60 mb-2">
                Formatted Results
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {formattedTexts.map(({ key, style, text }) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 p-2 hover:bg-base-200 rounded cursor-pointer group"
                    onClick={() => copyToClipboard(text, key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        copyToClipboard(text, key);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Copy ${style.name} formatted text: ${text}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-base-content/60 mb-1">
                        {style.name}
                      </div>
                      <div className="text-sm break-all font-mono">
                        {text}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {copiedStyle === key ? (
                        <span className="text-xs text-success">Copied!</span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show More/Less Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-base-content/60 text-sm py-8">
              Type some text to see formatted results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

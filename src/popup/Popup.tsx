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

  const copyToClipboard = useCallback(async (text: string, styleKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStyle(styleKey);
      setTimeout(() => setCopiedStyle(null), 1500);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedStyle(styleKey);
      setTimeout(() => setCopiedStyle(null), 1500);
    }
  }, []);

  const clearText = useCallback(() => {
    setInputText('');
  }, []);

  const openGitHub = useCallback(() => {
    chrome.tabs.create({ url: 'https://github.com/felipebossolani/text-alchemy-chrome-extension' });
  }, []);

  const openLinkedIn = useCallback(() => {
    chrome.tabs.create({ url: 'https://www.linkedin.com/in/felipebossolani/' });
  }, []);

  const openMyGitHub = useCallback(() => {
    chrome.tabs.create({ url: 'https://github.com/felipebossolani' });
  }, []);

  return (
    <div className="w-[500px] min-h-[600px] bg-base-100 shadow-xl overflow-hidden flex flex-col" data-theme="light">
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-4 px-2 bg-gradient-to-br from-[#6C3EF4] to-[#A259F7] relative">
        <img
          src="/icon48.png"
          alt="TextAlchemy Icon"
          className="w-14 h-14 mb-2 drop-shadow-[0_0_12px_rgba(162,89,247,0.7)]"
        />
        <h1 className="text-2xl font-extrabold text-white tracking-tight">TextAlchemy</h1>
        <p className="text-base text-violet-100 font-medium mt-1">Transform your text with magical styles</p>
      </div>

      {/* Input Section */}
      <div className="px-5 pt-5 pb-2">
        <textarea
          className="textarea textarea-bordered w-full h-20 border-2 border-[#A259F7] focus:border-[#6C3EF4] bg-white text-base shadow-md resize-none"
          placeholder="Type your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-400">{inputText.length}/500</span>
          {inputText && (
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-sm bg-gradient-to-r from-[#6C3EF4] to-[#A259F7] text-white border-0 shadow hover:from-[#7d4ffb] hover:to-[#b07cff]"
                onClick={clearText}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Styles Section */}
      <div className="flex-1 px-5 pb-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="flex justify-between items-center mt-2 mb-2">
          <h2 className="text-lg font-bold text-[#6C3EF4]">Text Styles</h2>
        </div>
        <div className="space-y-2 min-h-[200px]">
          {formattedTexts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="text-center">
                <div className="text-lg mb-2">✨</div>
                <div className="text-sm">Type something to see magical styles</div>
              </div>
            </div>
          ) : (
            <>
              {formattedTexts.map(({ key, style, text }) => (
                <div key={key} className="bg-white shadow flex items-center px-4 py-3 gap-3 border border-gray-100">
                  {/* Style Type Title */}
                  <div className="w-20 flex-shrink-0">
                    <div className="text-sm font-semibold text-[#6C3EF4]">
                      {style.name}
                    </div>
                  </div>
                  
                  {/* Transformed Text Result */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono break-all text-gray-800">{text}</div>
                  </div>
                  
                  {/* Copy Button */}
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      className={`btn btn-xs px-3 transition-colors duration-200 ${copiedStyle === key ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-[#6C3EF4] to-[#A259F7] text-white hover:from-[#7d4ffb] hover:to-[#b07cff]'}`}
                      onClick={() => copyToClipboard(text, key)}
                    >
                      {copiedStyle === key ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="btn btn-outline btn-sm border-[#A259F7] text-[#6C3EF4] hover:bg-violet-50"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? 'Show Less Styles' : 'Show More Styles'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-gray-100 bg-base-100 text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Created by Felipe Bossolani</span>
          <button 
            type="button" 
            className="btn btn-ghost btn-xs hover:bg-violet-50 p-1"
            onClick={openLinkedIn}
            title="LinkedIn Profile"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
          <button 
            type="button" 
            className="btn btn-ghost btn-xs hover:bg-violet-50 p-1"
            onClick={openMyGitHub}
            title="GitHub Profile"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            type="button" 
            className="btn btn-ghost btn-xs text-[#A259F7] hover:bg-violet-50"
            onClick={openGitHub}
          >
            About TextAlchemy
          </button>
        </div>
      </div>
    </div>
  );
}

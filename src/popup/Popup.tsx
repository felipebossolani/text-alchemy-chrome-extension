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

  return (
    <div className="w-96 min-h-[600px] bg-base-100 shadow-xl overflow-hidden flex flex-col" data-theme="light">
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
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-sm bg-gradient-to-r from-[#6C3EF4] to-[#A259F7] text-white border-0 shadow hover:from-[#7d4ffb] hover:to-[#b07cff]"
              onClick={clearText}
              disabled={!inputText}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Styles Section */}
      <div className="flex-1 px-5 pb-2 overflow-y-auto">
        <div className="flex justify-between items-center mt-2 mb-2">
          <h2 className="text-lg font-bold text-[#6C3EF4]">Text Styles</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {formattedTexts.map(({ key, style, text }) => (
            <div key={key} className="bg-white shadow flex flex-col px-3 py-2 gap-2 border border-gray-100">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#6C3EF4] mb-1">
                  {style.name}
                </div>
                <div className="text-xs font-mono break-all text-gray-800 line-clamp-3">{text}</div>
              </div>
              <button
                type="button"
                className={`btn btn-xs px-2 transition-colors duration-200 ${copiedStyle === key ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-[#6C3EF4] to-[#A259F7] text-white hover:from-[#7d4ffb] hover:to-[#b07cff]'}`}
                onClick={() => copyToClipboard(text, key)}
              >
                {copiedStyle === key ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
        {formattedTexts.length > 0 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              className="btn btn-outline btn-sm border-[#A259F7] text-[#6C3EF4] hover:bg-violet-50"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? 'Show Less Styles' : 'Show More Styles'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-gray-100 bg-base-100 text-xs text-gray-400">
        <span>v1.0.0</span>
        <div className="flex gap-2">
          <button 
            type="button" 
            className="btn btn-ghost btn-xs text-[#A259F7]"
            onClick={openGitHub}
          >
            ❓
          </button>
        </div>
      </div>
    </div>
  );
}

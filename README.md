# TextAlchemy - Chrome Extension

Transform your plain text into magical Unicode styles! Perfect for social media posts, messages, and anywhere you want your text to stand out.

## What is TextAlchemy?

TextAlchemy is a powerful Chrome extension that transforms ordinary text into eye-catching Unicode styles. Whether you're posting on social media, writing messages, or creating content, TextAlchemy gives you 25+ unique text formatting options with just one click.

## Features

- **25+ Text Styles**: Bold, Italic, Cursive, Bubble, Upside Down, and many more
- **Dual Mode**: Works as popup or floating widget on any webpage
- **One-Click Copy**: Instantly copy any formatted text
- **Keyboard Shortcut**: `Ctrl/Cmd + Shift + F` to open anywhere
- **Real-Time Preview**: See formatting as you type
- **No Sign-Up Required**: Works offline, no accounts needed
- **Context Menu Integration**: Right-click selected text for quick formatting

## Technology Stack

- **Vite**: Lightning-fast development and hot module replacement
- **TypeScript**: Type safety and enhanced productivity
- **React 19**: Modern React with latest features
- **CRX**: Easy packaging and distribution
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Beautiful and customizable UI components

## How to Use

### Popup Mode
1. Click the TextAlchemy icon in Chrome toolbar
2. Type your text in the input field
3. See real-time formatting in all styles
4. Click "Copy" next to any style to copy to clipboard
5. Click "Show More" to see additional formatting options
6. Click "Open in Page" to switch to webpage mode

### Webpage Mode
1. Use keyboard shortcut `Ctrl/Cmd + Shift + F` on any webpage
2. OR click "Open in Page" from the popup
3. A floating widget appears over the current page
4. Type and format text as needed
5. Click minimize (-) to collapse or close (×) to remove
6. Use `Ctrl/Cmd + Shift + F` again to toggle off

### Context Menu
1. Select any text on a webpage
2. Right-click and choose "TextAlchemy"
3. Select a quick style or "Open TextAlchemy" for full options

## Available Text Styles

### Top 10 (Always Visible)
1. **Bold** - 𝐁𝐨𝐥𝐝 𝐭𝐞𝐱𝐭
2. **Italic** - 𝐼𝑡𝑎𝑙𝑖𝑐 𝑡𝑒𝑥𝑡  
3. **Cursive** - 𝒞𝓊𝓇𝓈𝒾𝓋ℯ 𝓉ℯ𝓍𝓉
4. **Strikethrough** - S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶
5. **Monospace** - 𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎
6. **Bubble Text** - Ⓑⓤⓑⓑⓛⓔ ⓣⓔⓧⓣ
7. **Square Text** - 🅂🅀🅄🄰🅁🄴 🅃🄴🅇🅃
8. **Upside Down** - ʇxǝʇ uʍop ǝpᴉsd∩
9. **Small Caps** - sᴍᴀʟʟ ᴄᴀᴘs
10. **Tiny Text** - ᵗⁱⁿʸ ᵗᵉˣᵗ

### Additional Styles (Show More)
- **Fraktur** - 𝔉𝔯𝔞𝔨𝔱𝔲𝔯
- **Double Struck** - 𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜
- **Underline** - U̲n̲d̲e̲r̲l̲i̲n̲e̲
- **Slashthrough** - S̸l̸a̸s̸h̸t̸h̸r̸o̸u̸g̸h̸
- **Sans Serif** - 𝖲𝖺𝗇𝗌 𝖲𝖾𝗋𝗂𝖿
- **Fullwidth** - Ｆｕｌｌｗｉｄｔｈ
- **Squiggles** - Ѕզմìցցӏҽʂ
- **Hearts** - H♡e♡a♡r♡t♡s♡
- **Lightning** - L⚡i⚡g⚡h⚡t⚡n⚡i⚡n⚡g⚡
- **Diamonds** - D💎i💎a💎m💎o💎n💎d💎s💎
- **Clapback** - Clap 👏 back 👏 text
- **Air Quotes** - "Air quotes"
- **Ransom Note** - rAnSoM nOtE

## Development

### Prerequisites
- Node.js >= 20.x
- pnpm >= 8.15.0

### Setup
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`
4. Build for production: `pnpm build`

### Load Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `dist` folder after building
5. The extension should now appear in your toolbar

## Installation

### Method 1: Download from GitHub
1. Go to the [Releases page](../../releases) 
2. Download the latest `text-alchemy-extension.zip`
3. Extract the zip file
4. Follow the "Load as Unpacked Extension" steps above

### Method 2: Build from Source
```bash
git clone https://github.com/YOUR_USERNAME/text-alchemy-chrome-extension.git
cd text-alchemy-chrome-extension
pnpm install
pnpm build
```

## Technical Details

- **Framework**: React 19 + TypeScript + Tailwind CSS
- **Manifest Version**: 3 (latest Chrome extension format)
- **Permissions**: `activeTab`, `storage`, `contextMenus`, `notifications`
- **Unicode**: Uses Mathematical Alphanumeric Symbols and other Unicode blocks
- **Compatibility**: Works on all websites, no external dependencies
- **Storage**: Settings sync across devices, usage stats stored locally

## Troubleshooting

### Extension Not Loading
- Ensure all files are in the correct folder structure
- Check that manifest.json is valid JSON
- Verify Developer mode is enabled in Chrome extensions

### Styles Not Working
- Some Unicode characters may not display on all devices/browsers
- Older systems might show replacement characters (□ or ?)
- This is normal behavior for Unicode text formatting

### Keyboard Shortcut Not Working
- Make sure you're pressing Ctrl/Cmd + Shift + F (not just Ctrl + F)
- Try refreshing the page if the content script didn't load
- Check if another extension is using the same shortcut

### Copy Function Issues
- Modern browsers require HTTPS for clipboard API
- Extension falls back to legacy copy method automatically
- Try clicking copy again if it doesn't work the first time

## Contributing

We welcome contributions to improve TextAlchemy! Whether you'd like to:
- Fix a bug
- Add new text styles
- Improve the UI/UX
- Enhance documentation

Your contributions are highly valued!

## License

This extension is provided as-is for educational and personal use. The Unicode transformations are based on standard Unicode character mappings.

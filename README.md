# TextAlchemy Chrome Extension

Transform your plain text into magical Unicode styles! A modern Chrome extension built with React, TypeScript, and Vite.

## Features

- 🎨 **25+ Text Styles** - Bold, Italic, Cursive, Bubble, Upside Down, and many more
- ⚡ **One-Click Copy** - Instantly copy any formatted text to your clipboard
- 🔧 **Easy to Use** - Simple popup interface with real-time preview
- 🌐 **Works Everywhere** - Perfect for social media, messages, emails
- ⌨️ **Keyboard Shortcuts** - Use Ctrl/Cmd + Shift + F to open the formatter
- 🎯 **Context Menu** - Right-click selected text for quick formatting

## Installation

### Method 1: Chrome Web Store (Recommended)
Coming soon! The extension will be available on the Chrome Web Store.

### Method 2: Manual Installation (Developer Mode)
1. Clone the repository:
   ```bash
   git clone https://github.com/felipebossolani/text-alchemy-chrome-extension.git
   cd text-alchemy-chrome-extension
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the extension:
   ```bash
   pnpm build:all
   ```

4. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from the project

## Development

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

### Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build:all
```

### Build Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build extension only
- `pnpm build:all` - Build extension and popup CSS
- `pnpm build:website` - Build documentation website
- `pnpm build:everything` - Build extension and website

## Website

The project includes a documentation website built with VitePress, available in both English and Portuguese.

### Website Development
```bash
# Start website development server
pnpm docs:dev

# Build website for production
pnpm docs:build

# Preview built website
pnpm docs:preview
```

### Website Features
- 🌍 **Multi-language** - English and Portuguese support
- 🎨 **Consistent Theme** - Same purple theme as the extension
- 📱 **Responsive Design** - Works on all devices
- 🔍 **Search** - Find information quickly
- 📚 **Comprehensive Docs** - Installation, usage, FAQ, and more

### Deployment
The website is configured for GitHub Pages deployment. The built files are in the `dist-docs` folder and should be deployed from the `docs` folder in your repository settings.

## Project Structure

```
text-alchemy-chrome-extension/
├── src/                    # Extension source code
│   ├── background/         # Background scripts
│   ├── content/           # Content scripts
│   ├── popup/             # Popup interface
│   └── manifest.ts        # Extension manifest
├── docs/                  # Documentation website
│   ├── .vitepress/        # VitePress configuration
│   ├── public/            # Static assets
│   ├── index.md           # English homepage
│   └── pt/                # Portuguese pages
├── dist/                  # Built extension
├── dist-docs/             # Built website
└── public/                # Extension icons
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Felipe Bossolani**
- GitHub: [@felipebossolani](https://github.com/felipebossolani)
- LinkedIn: [Felipe Bossolani](https://www.linkedin.com/in/felipebossolani/)

## Support

- 📖 [Documentation](https://felipebossolani.github.io/text-alchemy-chrome-extension/)
- 🐛 [Report Issues](https://github.com/felipebossolani/text-alchemy-chrome-extension/issues)
- 💡 [Feature Requests](https://github.com/felipebossolani/text-alchemy-chrome-extension/issues)

---

Made with ❤️ by Felipe Bossolani

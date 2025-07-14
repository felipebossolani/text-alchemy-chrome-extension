# TextAlchemy Chrome Extension

Transform your plain text into magical Unicode styles! A modern Chrome extension built with React, TypeScript, and Vite.

## Features

- 🎨 **25+ Text Styles** - Bold, Italic, Cursive, Bubble, Upside Down, and many more
- ⚡ **One-Click Copy** - Instantly copy any formatted text to your clipboard
- 🔧 **Easy to Use** - Simple popup interface with real-time preview
- 🌐 **Works Everywhere** - Perfect for social media, messages, emails
- 🎯 **Context Menu** - Right-click selected text for quick formatting

## Tech Stack

This project was built using modern web technologies and tools:

- **React 19** - Modern UI library with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **[chrome-ext-starter](https://github.com/rezasohrabi/chrome-ext-starter)** - Chrome Extension development boilerplate with React, TypeScript, Vite, and Tailwind CSS
- **@crxjs/vite-plugin** - Chrome Extension Vite plugin for seamless development
- **Tailwind CSS + DaisyUI** - Utility-first CSS framework with beautiful UI components
- **Chrome Extension APIs** - Native browser integration
- **VitePress** - Documentation website generator

## Installation

### Method 1: Chrome Web Store (Recommended)
The extension is available on the Chrome Web Store! [Install TextAlchemy](https://chrome.google.com/webstore/detail/textalchemy) (link coming soon)

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

## Chrome Web Store Deployment

This guide explains how to deploy your Chrome extension to the Chrome Web Store.

### Prerequisites

1. **Google Developer Account**: $5 one-time registration fee
   - Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Pay the registration fee and complete account setup

2. **Extension Package**: Ready for submission
   - Built extension: `text-alchemy-chrome-extension.zip`
   - Icons: 16x16, 32x32, 48x48, 128x128 (included in dist folder)

### Step-by-Step Deployment Process

#### Step 1: Prepare Your Extension
```bash
# Build the extension for production
pnpm build:all

# Create zip file for submission
cd dist && zip -r ../text-alchemy-chrome-extension.zip . && cd ..
```

#### Step 2: Access Developer Dashboard
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Click "Add new item"

#### Step 3: Upload Extension
1. **Upload Package**: Upload `text-alchemy-chrome-extension.zip`
2. **Package Type**: Select "Extension"
3. **Privacy Practices**: Complete the privacy declaration

#### Step 4: Store Listing Information

**Basic Information:**
- **Extension Name**: `TextAlchemy`
- **Short Description**: `Transform your plain text into magical Unicode styles!`
- **Category**: `Productivity`
- **Language**: `English`

**Detailed Description:**
```
Transform your plain text into magical Unicode styles with TextAlchemy!

🎨 25+ Text Styles
Transform any text into bold, italic, cursive, bubble, upside down, and many more unique Unicode styles.

⚡ One-Click Copy
Instantly copy any formatted text to your clipboard with a single click.

🔧 Easy to Use
Simple popup interface with real-time preview. No sign-up required, works offline.

🌐 Works Everywhere
Perfect for social media posts, messages, emails, and anywhere you want your text to stand out.



🎯 Context Menu
Right-click selected text for quick formatting options.

Perfect for:
• Social Media Users - Make your posts stand out
• Content Creators - Add visual appeal to your content
• Students - Make your notes more memorable
• Professionals - Add personality to your communications

The extension uses Unicode characters to create beautiful text styles that work across all platforms and devices.

Try it now and transform your text into something magical! ✨
```

#### Step 5: Images & Media
- **Icon**: Use `icon128.png` from the dist folder
- **Screenshots**: Create 3-5 screenshots showing:
  1. Popup interface with text styles
  2. Context menu integration
  3. Context menu options
  4. Before/after text transformation examples

**Screenshot Requirements:**
- **Size**: 1280x800px or 640x400px
- **Format**: PNG or JPEG
- **Quality**: High quality, clear text
- **Content**: Show real functionality, not mockups

#### Step 6: Privacy & Security
**Permissions Used:**
- `activeTab` - To access the current tab for context menu
- `storage` - To save user preferences
- `contextMenus` - To add right-click menu options
- `notifications` - To show copy confirmations

**Privacy Policy:**
Create a simple privacy policy stating:
- No data collection
- No user tracking
- All processing happens locally
- No external API calls

#### Step 7: Content Rating
- **Content Rating**: Complete the content rating questionnaire
- **Target Audience**: General audience (all ages)

#### Step 8: Review & Submit
1. Review all information
2. Submit for review
3. Wait for Google's review process (typically 1-3 business days)

### Post-Publication

#### Monitor Performance
- Track installs and ratings
- Monitor user reviews
- Respond to user feedback
- Update based on user suggestions

#### Updates
- Regular updates improve visibility
- Add new features based on feedback
- Fix bugs promptly
- Keep description current

### Useful Resources

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Extension Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program_policies/)

### Deployment Checklist

- [ ] Google Developer Account created ($5 fee paid)
- [ ] Extension built and tested (`pnpm build:all`)
- [ ] Zip file created (`text-alchemy-chrome-extension.zip`)
- [ ] Screenshots created (3-5 high-quality images)
- [ ] Store listing information prepared
- [ ] Privacy policy created
- [ ] Content rating questionnaire completed
- [ ] Extension uploaded and submitted for review

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

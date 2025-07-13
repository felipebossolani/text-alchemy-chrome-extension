# Installation Guide

## Method 1: Chrome Web Store (Recommended)

The easiest way to install TextAlchemy is through the Chrome Web Store:

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link coming soon)
2. Search for "TextAlchemy"
3. Click "Add to Chrome"
4. Confirm the installation
5. The extension will appear in your toolbar

## Method 2: Manual Installation (Developer Mode)

If you want to install the latest development version:

### Prerequisites
- Google Chrome browser
- Node.js (for building from source)

### Step 1: Clone the Repository
```bash
git clone https://github.com/felipebossolani/text-alchemy-chrome-extension.git
cd text-alchemy-chrome-extension
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Build the Extension
```bash
pnpm build:all
```

### Step 4: Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from the project
5. The extension should now appear in your toolbar

## Method 3: Download Pre-built Version

1. Go to the [Releases page](https://github.com/felipebossolani/text-alchemy-chrome-extension/releases)
2. Download the latest `text-alchemy-extension.zip`
3. Extract the zip file
4. Follow the "Load as Unpacked Extension" steps above

## Verification

After installation, you should see:

1. **Toolbar Icon**: The purple TextAlchemy icon in your Chrome toolbar
2. **Popup**: Click the icon to open the text formatter
3. **Context Menu**: Right-click on any text to see "TextAlchemy" options

## Troubleshooting

### Extension Not Loading
- Ensure all files are in the correct folder structure
- Check that `manifest.json` is valid JSON
- Verify Developer mode is enabled in Chrome extensions

### Build Errors
- Make sure you have Node.js 20+ installed
- Try running `pnpm install` again
- Check the console for specific error messages

### Extension Not Working
- Try refreshing the page
- Check if the extension is enabled in `chrome://extensions/`
- Look for any error messages in the browser console

## Next Steps

Once installed, check out the [Quick Start Guide](/quick-start) to learn how to use TextAlchemy effectively!

## Support

If you encounter any issues:

1. Check the [FAQ](/faq) for common solutions
2. Search existing [GitHub Issues](https://github.com/felipebossolani/text-alchemy-chrome-extension/issues)
3. Create a new issue with detailed information about your problem 
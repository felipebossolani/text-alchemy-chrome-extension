// TextAlchemy Background Service Worker
import { textFormatter } from '@utils/textFormatter';

interface ExtensionMessage {
  action: string;
  data?: any;
  text?: string;
  style?: string;
  settings?: any;
}

class TextAlchemyBackground {
  private injectedTabs: Set<number> = new Set();
  
  constructor() {
    this.init();
  }

  init(): void {
    this.setupEventListeners();
    this.setupContextMenus();
    this.handleInstallation();
  }

  // Setup event listeners
  setupEventListeners(): void {
    // Extension installation/update
    chrome.runtime.onInstalled.addListener(this.handleInstalled.bind(this));
    
    // Message handling
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    // Action (icon) click
    chrome.action.onClicked.addListener(this.handleActionClick.bind(this));
    
    // Context menu clicks
    chrome.contextMenus.onClicked.addListener(this.handleContextMenuClick.bind(this));
    
    // Tab removal (cleanup injected tabs)
    chrome.tabs.onRemoved.addListener(this.handleTabRemoved.bind(this));
    
    // Startup
    chrome.runtime.onStartup.addListener(this.handleStartup.bind(this));
  }

  // Handle extension installation
  handleInstalled(details: chrome.runtime.InstalledDetails): void {
    console.log('TextAlchemy installed:', details.reason);
    
    if (details.reason === 'install') {
      // First time installation
      this.handleFirstInstall();
    } else if (details.reason === 'update') {
      // Extension update
      this.handleUpdate(details.previousVersion);
    }
  }

  // Handle first installation
  async handleFirstInstall(): Promise<void> {
    try {
      // Set default settings
      await chrome.storage.sync.set({
        firstInstall: true,
        installDate: Date.now(),
        version: chrome.runtime.getManifest().version,
        settings: {
          autoSave: true,
          showNotifications: true,
          defaultStyles: 'top10',
          keyboardShortcuts: true
        }
      });

      console.log('TextAlchemy: First install setup complete');
    } catch (error) {
      console.error('TextAlchemy: Error during first install:', error);
    }
  }

  // Handle extension update
  async handleUpdate(previousVersion: string | undefined): Promise<void> {
    try {
      const manifest = chrome.runtime.getManifest();
      await chrome.storage.sync.set({
        version: manifest.version,
        lastUpdate: Date.now(),
        previousVersion: previousVersion
      });

      console.log(`TextAlchemy updated from ${previousVersion} to ${manifest.version}`);
    } catch (error) {
      console.error('TextAlchemy: Error during update:', error);
    }
  }

  // Handle runtime startup
  handleStartup(): void {
    console.log('TextAlchemy: Extension started');
  }

  // Handle tab removal
  handleTabRemoved(tabId: number): void {
    this.injectedTabs.delete(tabId);
  }

  // Handle action (icon) click
  async handleActionClick(tab: chrome.tabs.Tab): Promise<void> {
    try {
      // Ensure content script is injected before sending message
      if (tab.id) {
        await this.injectContentScript(tab.id);
      }
      
      // Send message to popup that it was opened
      chrome.runtime.sendMessage({ action: 'popupOpened', tabId: tab.id });
    } catch (error) {
      console.log('Popup opened directly');
    }
  }

  // Handle messages from content scripts and popup
  handleMessage(request: ExtensionMessage, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean | void {
    switch (request.action) {
      case 'getSettings':
        this.getSettings().then(sendResponse);
        return true; // Will respond asynchronously

      case 'saveSettings':
        this.saveSettings(request.settings).then(sendResponse);
        return true;

      case 'formatText':
        this.formatText(request.text || '', request.style || '').then(sendResponse);
        return true;

      case 'getStats':
        this.getStats().then(sendResponse);
        return true;

      case 'trackUsage':
        this.trackUsage(request.data);
        break;

      case 'openOptionsPage':
        chrome.runtime.openOptionsPage();
        break;

      default:
        console.log('Unknown message action:', request.action);
    }
  }

  // Setup context menus
  async setupContextMenus(): Promise<void> {
    try {
      // Remove existing menus
      await chrome.contextMenus.removeAll();

      // Create main context menu
      chrome.contextMenus.create({
        id: 'textalchemy-main',
        title: 'TextAlchemy',
        contexts: ['selection']
      });

      // Create submenu for quick styles
      const quickStyles = ['bold', 'italic', 'cursive', 'strikethrough', 'bubble'];
      quickStyles.forEach(style => {
        chrome.contextMenus.create({
          id: `textalchemy-${style}`,
          parentId: 'textalchemy-main',
          title: this.getStyleDisplayName(style),
          contexts: ['selection']
        });
      });

      // Separator
      chrome.contextMenus.create({
        id: 'textalchemy-separator',
        parentId: 'textalchemy-main',
        type: 'separator',
        contexts: ['selection']
      });

      // Open full formatter
      chrome.contextMenus.create({
        id: 'textalchemy-open-full',
        parentId: 'textalchemy-main',
        title: 'Open TextAlchemy',
        contexts: ['selection']
      });

    } catch (error) {
      console.error('Error setting up context menus:', error);
    }
  }

  // Handle context menu clicks
  async handleContextMenuClick(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined): Promise<void> {
    if (!tab?.id) return;
    
    const selectedText = info.selectionText || '';
    
    if (info.menuItemId === 'textalchemy-open-full') {
      // Ensure content script is injected before sending message
      await this.injectContentScript(tab.id);
      
      // Send message to content script to open formatter
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'openFormatter',
          text: selectedText
        });
      } catch (error) {
        console.error('Error opening formatter:', error);
      }
    } else if (typeof info.menuItemId === 'string' && info.menuItemId.startsWith('textalchemy-')) {
      // Quick format
      const style = info.menuItemId.replace('textalchemy-', '');
      const formattedText = textFormatter.format(selectedText, style);
      
      // Copy to clipboard
      try {
        await this.copyToClipboard(formattedText);
        this.showNotification(`Copied ${this.getStyleDisplayName(style)} text!`);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  }

  // Inject content script programmatically
  async injectContentScript(tabId: number): Promise<void> {
    try {
      // Check if already injected
      if (this.injectedTabs.has(tabId)) {
        return;
      }

      // Get tab info to check if injection is allowed
      const tab = await chrome.tabs.get(tabId);
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        console.log('Cannot inject content script in this tab');
        return;
      }

      // Inject the content script
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });

      // Inject the content CSS
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: ['content.css']
      });

      // Mark as injected
      this.injectedTabs.add(tabId);
      
      console.log('Content script injected successfully');
    } catch (error) {
      console.error('Error injecting content script:', error);
    }
  }

  // Get settings
  async getSettings(): Promise<any> {
    try {
      const result = await chrome.storage.sync.get(['settings']);
      return result.settings || {
        autoSave: true,
        showNotifications: true,
        defaultStyles: 'top10',
        keyboardShortcuts: true
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }

  // Save settings
  async saveSettings(settings: any): Promise<{ success: boolean; error?: string }> {
    try {
      await chrome.storage.sync.set({ settings });
      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Format text
  async formatText(text: string, style: string): Promise<string> {
    return textFormatter.format(text, style);
  }

  // Get usage statistics
  async getStats(): Promise<any> {
    try {
      const result = await chrome.storage.local.get(['stats']);
      return result.stats || {
        totalUses: 0,
        stylesUsed: {},
        lastUsed: null
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {};
    }
  }

  // Track usage
  async trackUsage(data: any): Promise<void> {
    try {
      const stats = await this.getStats();
      stats.totalUses += 1;
      stats.lastUsed = Date.now();
      
      if (data.style) {
        stats.stylesUsed[data.style] = (stats.stylesUsed[data.style] || 0) + 1;
      }
      
      await chrome.storage.local.set({ stats });
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }

  // Copy to clipboard
  async copyToClipboard(text: string): Promise<void> {
    // Note: Background scripts can't directly access clipboard
    // This would need to be handled by content scripts
    console.log('Copy to clipboard requested:', text);
  }

  // Show notification
  showNotification(message: string, type: 'basic' | 'image' | 'list' | 'progress' = 'basic'): void {
    chrome.notifications.create({
      type,
      iconUrl: 'icon48.png',
      title: 'TextAlchemy',
      message
    });
  }

  // Get style display name
  getStyleDisplayName(style: string): string {
    const styleInfo = textFormatter.getStyleInfo(style);
    return styleInfo ? styleInfo.name : style;
  }

  // Handle installation
  handleInstallation(): void {
    console.log('TextAlchemy background service worker initialized');
  }
}

// Initialize the background service worker
new TextAlchemyBackground();

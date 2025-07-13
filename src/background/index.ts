// TextAlchemy Background Service Worker
import { textFormatter } from '@utils/textFormatter';

interface ExtensionMessage {
  action: string;
  data?: unknown;
  text?: string;
  style?: string;
  settings?: Record<string, unknown>;
}

interface TextTransformationResult {
  success: boolean;
  isInputField: boolean;
  error?: string;
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
  handleMessage(request: ExtensionMessage, _sender: chrome.runtime.MessageSender, sendResponse: (response?: unknown) => void): boolean | void {
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
        return false;

      case 'openOptionsPage':
        chrome.runtime.openOptionsPage();
        return false;

      default:
        console.log('Unknown message action:', request.action);
        return false;
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

      // Create submenu for quick styles (matching the screenshot)
      const quickStyles = [
        { id: 'bold', name: 'Bold' },
        { id: 'italic', name: 'Italic' },
        { id: 'cursive', name: 'Cursive' },
        { id: 'strikethrough', name: 'Strikethrough' },
        { id: 'bubble', name: 'Bubble Text' }
      ];
      
      quickStyles.forEach(style => {
        chrome.contextMenus.create({
          id: `textalchemy-${style.id}`,
          parentId: 'textalchemy-main',
          title: style.name,
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
      
      // Handle text replacement or clipboard copy based on context
      try {
        await this.handleTextTransformation(formattedText, style, tab.id);
      } catch (error) {
        console.error('Error handling text transformation:', error);
        // Still show notification even if transformation fails
        this.showNotification(`Failed to transform ${this.getStyleDisplayName(style)} text`);
      }
    }
  }

  // Handle text transformation - either replace in place or copy to clipboard
  async handleTextTransformation(formattedText: string, style: string, tabId: number): Promise<void> {
    try {
      // Inject script to detect selection context and handle transformation
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: async (textToTransform: string): Promise<TextTransformationResult> => {
          console.log('TextAlchemy: Starting text transformation with:', textToTransform);
          
          // First, check if the currently focused element is an input/textarea
          const activeElement = document.activeElement;
          console.log('TextAlchemy: Active element:', activeElement);
          
          if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            console.log('TextAlchemy: Active element is input/textarea');
            const inputElement = activeElement as HTMLInputElement | HTMLTextAreaElement;
            const { selectionStart, selectionEnd } = inputElement;
            const start = selectionStart || 0;
            const end = selectionEnd || 0;
            
            console.log('TextAlchemy: Input selection range:', start, end);
            
            if (start !== end) {
              // Replace selected text
              const currentValue = inputElement.value;
              const newValue = currentValue.substring(0, start) + textToTransform + currentValue.substring(end);
              inputElement.value = newValue;
              
              // Set cursor position after the transformed text
              const newCursorPos = start + textToTransform.length;
              inputElement.setSelectionRange(newCursorPos, newCursorPos);
              
              // Trigger input event for any listeners
              inputElement.dispatchEvent(new Event('input', { bubbles: true }));
              
              console.log('TextAlchemy: Text replaced in active input field');
              return { success: true, isInputField: true };
            } else {
              console.log('TextAlchemy: No text selected in input field');
            }
          }
          
          // Fall back to selection-based approach for contentEditable elements
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) {
            console.log('TextAlchemy: No selection found');
            return { success: false, isInputField: false, error: 'No selection found' };
          }

          const range = selection.getRangeAt(0);
          const commonAncestor = range.commonAncestorContainer;
          
          console.log('TextAlchemy: Selection found, common ancestor:', commonAncestor);
          
          // Find the target element for contentEditable
          let targetElement = commonAncestor.nodeType === Node.TEXT_NODE 
            ? commonAncestor.parentElement 
            : commonAncestor as Element;
          
          console.log('TextAlchemy: Target element:', targetElement);
          
          // Walk up the DOM to find contentEditable elements
          while (targetElement && targetElement !== document.body) {
            console.log('TextAlchemy: Checking element:', targetElement.tagName, targetElement);
            
            if ((targetElement as HTMLElement).contentEditable === 'true') {
              console.log('TextAlchemy: Found contentEditable element');
              // Handle contentEditable elements
              if (range.toString()) {
                range.deleteContents();
                const textNode = document.createTextNode(textToTransform);
                range.insertNode(textNode);
                
                // Move cursor to end of inserted text (collapse to single point)
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                range.collapse(true); // Collapse to start position (cursor, not selection)
                selection.removeAllRanges();
                selection.addRange(range);
                
                console.log('TextAlchemy: Text replaced in contentEditable');
                return { success: true, isInputField: true };
              }
            }
            
            targetElement = targetElement.parentElement;
          }
          
          console.log('TextAlchemy: No input field found, copying to clipboard');
          // If we get here, it's not an input field - copy to clipboard
          try {
            // Ensure the window is focused first
            window.focus();
            
            // Create a temporary textarea element to copy text
            const textarea = document.createElement('textarea');
            textarea.value = textToTransform;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.left = '-999px';
            textarea.style.top = '-999px';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            textarea.setSelectionRange(0, 99999); // For mobile devices
            
            let success = false;
            
            try {
              // Use execCommand which is more reliable for extensions
              success = document.execCommand('copy');
              console.log('TextAlchemy: execCommand copy result:', success);
              
              // If execCommand fails, try modern clipboard API as fallback
              if (!success && navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToTransform);
                success = true;
                console.log('TextAlchemy: Modern clipboard API used');
              }
            } catch (err) {
              console.error('TextAlchemy: Clipboard copy failed:', err);
              // Final fallback - try execCommand again
              success = document.execCommand('copy');
            } finally {
              document.body.removeChild(textarea);
            }
            
            console.log('TextAlchemy: Clipboard copy final result:', success);
            return { success, isInputField: false };
          } catch (clipboardError) {
            console.error('TextAlchemy: Clipboard error:', clipboardError);
            return { success: false, isInputField: false, error: clipboardError instanceof Error ? clipboardError.message : 'Unknown clipboard error' };
          }
        },
        args: [formattedText]
      });

      const result = results[0]?.result;
      console.log('TextAlchemy: Transformation result:', result);
      
      if (result?.success) {
        if (result.isInputField) {
          // Text was replaced in place - no notification needed
          console.log('TextAlchemy: Text replaced in input field');
        } else {
          // Text was copied to clipboard - show notification
          console.log('TextAlchemy: Text copied to clipboard, showing notification');
          this.showNotification(`Copied ${this.getStyleDisplayName(style)} text!`);
        }
      } else {
        throw new Error(result?.error || 'Unknown error');
      }
      
    } catch (error) {
      console.error('TextAlchemy: Error handling text transformation:', error);
      throw error;
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

      // Inject the textFormatter first (required by content script)
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['textFormatter.js']
      });

      // Then inject the content script
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
  async getSettings(): Promise<Record<string, unknown>> {
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
  async saveSettings(settings: Record<string, unknown> | undefined): Promise<{ success: boolean; error?: string }> {
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
  async copyToClipboard(text: string, tabId?: number): Promise<void> {
    try {
      if (tabId) {
        // Use chrome.scripting to execute clipboard copy in the active tab
        await chrome.scripting.executeScript({
          target: { tabId },
          func: (textToCopy: string) => {
            // Create a temporary textarea element to copy text
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, 99999); // For mobile devices
            
            try {
              // Try modern clipboard API first
              if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy);
              } else {
                // Fallback to execCommand
                document.execCommand('copy');
              }
            } catch (err) {
              console.error('Clipboard copy failed:', err);
              // Fallback to execCommand
              document.execCommand('copy');
            } finally {
              document.body.removeChild(textarea);
            }
          },
          args: [text]
        });
        console.log('Text copied to clipboard successfully');
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      throw error;
    }
  }

  // Show notification
  showNotification(message: string, type: 'basic' | 'image' | 'list' | 'progress' = 'basic'): void {
    const notificationId = `textalchemy-${Date.now()}`;
    chrome.notifications.create(notificationId, {
      type,
      iconUrl: 'icon48.png',
      title: 'TextAlchemy',
      message
    });
    
    // Auto-clear notification after 3 seconds
    setTimeout(() => {
      chrome.notifications.clear(notificationId);
    }, 3000);
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

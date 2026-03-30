const API = 'http://localhost:8147';

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'figney-suggest',
    title: 'Figney: 図式化',
    contexts: ['selection'],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'figney-suggest') return;

  const selectedText = info.selectionText;
  if (!selectedText) return;

  // Store data for popup
  await chrome.storage.session.set({
    pendingRequest: {
      context: tab.title || '',
      selected_text: selectedText,
      status: 'pending',
    },
  });

  // Open popup
  chrome.action.openPopup();
});

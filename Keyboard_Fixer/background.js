chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "flip-text-item",
    title: "הפוך טקסט (Hebrew ⇄ English)",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "flip-text-item" && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: "flipSelection",
      selectionText: info.selectionText
    });
  }
});
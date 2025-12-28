chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "flip-text-item",
    title: "הפוך טקסט (Hebrew ⇄ English)",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "flip-text-item" && tab.id) {
    
    // בדיקה שזו לא כתובת פנימית של כרום (כי שם אי אפשר להזריק קוד)
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
      console.warn("לא ניתן להפעיל תוספים בדפים פנימיים של הדפדפן");
      return;
    }

    // שליחת ההודעה עם טיפול בשגיאות
    chrome.tabs.sendMessage(tab.id, {
      action: "flipSelection",
      selectionText: info.selectionText
    }, (response) => {
      // אם יש שגיאה (למשל הדף לא רוענן), נתפוס אותה כאן כדי שלא תופיע בקונסול
      if (chrome.runtime.lastError) {
        console.log("הודעה לא התקבלה. ייתכן שיש לרענן את הדף.");
      }
    });
  }
});
// מפות המקשים
const hebrewKeyboard = "/'קראטוןםפ][שדגכעיחלךף,זסבהנמצתץ.";
const englishKeyboard = "qwertyuiop[]asdfghjkl;'zxcvbnm,./";

// פונקציות המרה
function swapLetterToEnglish(letter) {
  let index = hebrewKeyboard.indexOf(letter);
  return index !== -1 ? englishKeyboard[index] : letter;
}

function swapLetterToHebrew(letter) {
  // בדיקה רגילה
  let index = englishKeyboard.indexOf(letter);
  
  // אם לא מצאנו, ננסה לבדוק אם זו אות גדולה (למשל A במקום a)
  if (index === -1) {
    index = englishKeyboard.indexOf(letter.toLowerCase());
  }
  
  return index !== -1 ? hebrewKeyboard[index] : letter;
}

function swapText(text) {
  let countHebrew = 0;
  let countEnglish = 0;
  
  for (let char of text) {
    if (hebrewKeyboard.includes(char)) countHebrew++;
    // בדיקה גם לאותיות גדולות באנגלית כדי שהזיהוי יעבוד נכון
    if (englishKeyboard.includes(char.toLowerCase())) countEnglish++;
  }

  let newText = "";
  // אם זוהה שרוב הטקסט בעברית -> נהפוך לאנגלית
  if (countHebrew > countEnglish) {
    for (let char of text) newText += swapLetterToEnglish(char);
  } 
  // אחרת (רוב הטקסט אנגלית או מעורב) -> נהפוך לעברית
  else {
    for (let char of text) newText += swapLetterToHebrew(char);
  }
  return newText;
}

// פונקציה להצגת בועה (Toast)
function showToast(message) {
  const existingToast = document.getElementById("swapper-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.id = "swapper-toast";
  toast.innerText = message;
  
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "40px",
    left: "50%",
    transform: "translateX(-50%) translateY(20px)",
    backgroundColor: "#2d3436",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "50px",
    fontSize: "14px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    zIndex: "2147483647",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    opacity: "0",
    transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
    pointerEvents: "none"
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// האזנה להודעה מה-Background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "flipSelection") {
    let selection = window.getSelection();
    let textToSwap = request.selectionText || selection.toString();

    if (textToSwap) {
      const convertedText = swapText(textToSwap);
      
      if (document.execCommand("insertText", false, convertedText)) {
        showToast("הטקסט הוחלף בהצלחה! ✨");
      } else {
        navigator.clipboard.writeText(convertedText).then(() => {
          showToast("הטקסט המתוקן הועתק ללוח 📋");
        });
      }
    } else {
      showToast("לא נבחר טקסט ⚠️");
    }
  }
});
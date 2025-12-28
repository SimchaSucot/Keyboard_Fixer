// --- לוגיקת המרה ---
const hebrewKeyboard = "/'קראטוןםפ][שדגכעיחלךף,זסבהנמצתץ.";
const englishKeyboard = "qwertyuiop[]asdfghjkl;'zxcvbnm,./";

function swapLetterToEnglish(letter) {
  let index = hebrewKeyboard.indexOf(letter);
  return index !== -1 ? englishKeyboard[index] : letter;
}

function swapLetterToHebrew(letter) {
  let index = englishKeyboard.indexOf(letter);
  // תיקון לאותיות גדולות (Capital Letters)
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
    // ספירה גם של אותיות גדולות
    if (englishKeyboard.includes(char.toLowerCase())) countEnglish++;
  }

  let newText = "";
  if (countHebrew > countEnglish) {
    for (let char of text) newText += swapLetterToEnglish(char);
  } else {
    for (let char of text) newText += swapLetterToHebrew(char);
  }
  return newText;
}

// --- לוגיקת הממשק ---
document.getElementById("copy-text").addEventListener("click", readFromClipboard);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    readFromClipboard();
  }
});

async function readFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    const changText = swapText(text);
    
    const swapperDiv = document.getElementById("text-swapper");
    swapperDiv.textContent = changText;
    
    const copyButtonContainer = document.getElementById("copy-button");
    copyButtonContainer.innerHTML = ""; 
    
    const button = document.createElement("button");
    button.textContent = "העתק תוצאה";
    
    button.addEventListener("click", function () {
      navigator.clipboard.writeText(changText);
      const statusMessage = document.getElementById("copy-status");
      statusMessage.textContent = "הטקסט הועתק בהצלחה! 👍";
      setTimeout(() => { statusMessage.textContent = ""; }, 2000);
    });
    
    copyButtonContainer.appendChild(button);

  } catch (error) {
    document.getElementById("text-swapper").textContent = 
      "נדרשת הרשאת הדבקה או שהלוח ריק.";
  }
}
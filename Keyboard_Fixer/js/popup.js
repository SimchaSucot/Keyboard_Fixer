document
  .getElementById("copy-text")
  .addEventListener("click", readFromClipboard);
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    readFromClipboard();
  }
});
async function readFromClipboard() {
  const text = await navigator.clipboard.readText();
  try {
    const changText = swapText(text);
    document.getElementById("text-swapper").textContent = changText;
    const button = document.createElement("button");
    button.textContent = "העתק את הטקסט המתוקן ללוח";
    document.getElementById("copy-button").innerHTML = "";
    document.getElementById("copy-button").appendChild(button);
    document
      .getElementById("copy-button")
      .addEventListener("click", function () {
        navigator.clipboard.writeText(changText);
        const statusMessage = document.getElementById("copy-status");
        statusMessage.textContent = "הטקסט הועתק בהצלחה";
        setTimeout(function () {
          statusMessage.textContent = "";
        }, 1500);
      });
  } catch (error) {
    document.getElementById("text-to-copy").textContent =
      "שגיאה בקריאה: " + error;
  }
}

const hebrewKeyboard = "/'קראטוןםפ][שדגכעיחלךף,זסבהנמצתץ.";
const englishKeyboard = "qwertyuiop[]asdfghjkl;'zxcvbnm,./";

function swapLetterToEnglish(letter) {
  let index = hebrewKeyboard.indexOf(letter);
  if (index !== -1) {
    return englishKeyboard[index];
  }בג
  return letter;
}

function swapLetterToHebrew(letter) {
  let index = englishKeyboard.indexOf(letter);
  if (index !== -1) {
    return hebrewKeyboard[index];
  }
  return letter;
}

function swapText(text) {
  let countHebrew = 0;
  let countEnglish = 0;
  for (let char of text) {
    if (hebrewKeyboard.includes(char)) countHebrew++;
    if (englishKeyboard.includes(char)) countEnglish++;
  }
  let swappedText = "";
  if (countHebrew > countEnglish) {
    for (let letter of text) {
      swappedText += swapLetterToEnglish(letter);
    }
  } else {
    for (let letter of text) {
      swappedText += swapLetterToHebrew(letter);
    }
  }
  return swappedText;
}

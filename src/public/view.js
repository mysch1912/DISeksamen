// src/public/view.js

// DOM-elementer
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("spin");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupText = document.getElementById("popup-text");
const closePopupBtn = document.getElementById("close-popup");

// farver til felterne (gentages hvis der er flere præmier)
const colors = [
  "#3f51b5",
  "#ff9800",
  "#e91e63",
  "#4caf50",
  "#009688",
  "#795548",
  "#9c27b0",
  "#f44336",
];

let prizes = [];      // udfyldes fra backend
let deg = 0;
let spinning = false;

// ---------- popup-hjælpere ----------

function showPopup(title, text) {
  if (!popup || !popupTitle || !popupText) return;
  popupTitle.textContent = title;
  popupText.textContent = text;
  popup.style.display = "flex";
}

function hidePopup() {
  if (!popup) return;
  popup.style.display = "none";
}

// ---------- tegne-funktioner ----------

// Wrap tekst til max 2 linjer så det kan være på feltet
function wrapTwoLines(text) {
  ctx.font = "bold 13px Poppins";
  const maxWidth = canvas.width / 2 - 40;

  const words = text.split(" ");
  let line1 = "";
  let line2 = "";

  for (let i = 0; i < words.length; i++) {
    const test = (line1 ? line1 + " " : "") + words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      line1 = test;
    } else {
      line2 = words.slice(i).join(" ");
      break;
    }
  }

  if (!line2) {
    return [line1];
  }

  // klip linje 2 ned hvis den er for lang
  while (ctx.measureText(line2 + "…").width > maxWidth && line2.length > 0) {
    line2 = line2.slice(0, -1);
  }
  if (line2 && !line2.endsWith("…")) {
    line2 = line2 + "…";
  }

  return [line1, line2];
}

function drawWheel() {
  if (!canvas || !ctx || !prizes.length) return;

  const c = canvas.width / 2;
  const r = c;
  const arc = (2 * Math.PI) / prizes.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < prizes.length; i++) {
    const start = i * arc;

    // sektor
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(c, c);
    ctx.arc(c, c, r, start, start + arc);
    ctx.closePath();
    ctx.fill();

    // tekst
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Poppins";
    ctx.textAlign = "right";

    const lines = wrapTwoLines(prizes[i]);
    const lineHeight = 16;
    const totalHeight = lineHeight * lines.length;
    const startY = -(totalHeight / 2) + 4;

    for (let j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], r - 20, startY + j * lineHeight);
    }

    ctx.restore();
  }
}

// ---------- API-kald til backend ----------

// hent præmier fra /game/prizes
async function loadPrizes() {
  try {
    const res = await fetch("/game/prizes");
    if (!res.ok) {
      throw new Error("Could not fetch prizes");
    }

    const data = await res.json();

    // forventer et array af strings
    if (Array.isArray(data) && data.length > 0) {
      prizes = data;
    } else {
      throw new Error("Invalid prize list from server");
    }

    drawWheel();
  } catch (err) {
    console.error("Fejl ved loadPrizes:", err);
    showPopup("Error", "Could not load prizes from the server.");
    if (btn) btn.disabled = true;
  }
}

// tjek om brugeren må spinne i dag
async function checkCanSpin() {
  try {
    const res = await fetch("/game/check");
    const data = await res.json();

    if (!data.canSpin) {
      showPopup(
        "🔁 Come back tomorrow",
        data.message || "You have used your spin for today."
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error("Fejl ved checkCanSpin:", err);
    showPopup("Error", "Could not check if you are allowed to spin.");
    return false;
  }
}

// POST /game/spin – selve spin-kaldet
async function sendWinToServer() {
  try {
    const res = await fetch("/game/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    return await res.json();
  } catch (err) {
    console.error("Could not contact the server:", err);
    return null;
  }
}

// ---------- hovedlogik når man klikker SPIN ----------

async function handleSpinClick() {
  if (spinning) return;
  if (!canvas || !btn) return;

  if (!prizes.length) {
    showPopup("Error", "Prizes have not been loaded yet.");
    return;
  }

  const canSpin = await checkCanSpin();
  if (!canSpin) return;

  spinning = true;
  btn.disabled = true;
  hidePopup();

  const data = await sendWinToServer();

  if (!data) {
    showPopup("Error", "Could not contact the server. Try again.");
    spinning = false;
    btn.disabled = false;
    return;
  }

  if (!data.success && data.reason === "already_spun") {
    showPopup(
      "🔁 Come back tomorrow",
      data.message || "You have already spun today."
    );
    spinning = false;
    btn.disabled = false;
    return;
  }

  if (!data.success) {
    showPopup("Error", data.message || "Server error — please try again.");
    spinning = false;
    btn.disabled = false;
    return;
  }

const prizeIndex = data.prizeIndex;

// beregn hvilken vinkel vi skal stoppe på
const arc = 360 / prizes.length;
const extraTurns = 5; // ekstra omgange for dramatik

// midten af det felt, som backend har valgt (målt fra højre, med uret)
const sliceMiddleAngle = prizeIndex * arc + arc / 2;

// vores pil sidder foroven = 270° fra højre
const pointerAngle = 270;

// vi vil dreje hjulet så sliceMiddleAngle ender ved pointerAngle
const finalDeg = extraTurns * 360 + (pointerAngle - sliceMiddleAngle);

// DEBUG – tjek at backend & frontend er enige
console.log("Backend prizeIndex →", prizeIndex);
console.log("Backend prize name →", data.prize);
console.log("Frontend prize at that index →", prizes[prizeIndex]);
console.log("finalDeg →", finalDeg);

deg = finalDeg;
canvas.style.transform = `rotate(${deg}deg)`;


  // samme varighed som CSS-transition på hjulet (typisk 5s)
  setTimeout(() => {
    showPopup("🎉 You won!", `You won: ${data.prize}\nCode: ${data.code}`);
    spinning = false;
    btn.disabled = false;
  }, 5000);
}

// ---------- event listeners ----------

if (btn) {
  btn.addEventListener("click", handleSpinClick);
}

if (closePopupBtn) {
  closePopupBtn.addEventListener("click", hidePopup);
}

// hent præmier og tegn hjulet når siden loader
window.addEventListener("load", () => {
  loadPrizes();
});

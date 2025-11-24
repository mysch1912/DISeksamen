// wheel setup 
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("spin");

// Farver og præmier, som kun bruges til GRAFIK
const colors = [
  "#3f51b5", "#ff9800", "#e91e63", "#4caf50",
  "#009688", "#795548", "#9c27b0", "#f44336"
];

const prizes = [
  "10% rabat på en valgfri oplevelse",
  "Bedre held næste gang",
  "2 for 1 oplevelsespris",
  "ØV!",
  "15% rabat på en valgfri oplevelse",
  "Bedre held næste gang",
  "100 kr. rabat på en valgfri oplevelse",
  "ØV!"
];

//wheel tegning
function drawWheel() {
  const c = canvas.width / 2;
  const r = c;
  const arc = (2 * Math.PI) / prizes.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height); //ryd canvas

  for (let i = 0; i < prizes.length; i++) {
    const start = i * arc;

    // Sektor
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(c, c);
    ctx.arc(c, c, r, start, start + arc);
    ctx.closePath();
    ctx.fill();

    // Tekst
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Poppins";
    ctx.textAlign = "right";

    const maxWidth = 170;
    const lines = wrapTwoLines(prizes[i], maxWidth);
    const x = r - 24;

    if (lines.length === 1) {
      ctx.fillText(lines[0], x, 5);
    } else {
      ctx.fillText(lines[0], x, -8);
      ctx.fillText(lines[1], x, 13);
    }

    ctx.restore();
  }
}

function wrapTwoLines(text, maxWidth) {
  const words = text.split(" ");
  let line1 = "", line2 = "";

  for (let i = 0; i < words.length; i++) {
    const test = (line1 ? line1 + " " : "") + words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      line1 = test;
    } else {
      line2 = words.slice(i).join(" ");
      break;
    }
  }

  if (!line2) return [line1];

  while (ctx.measureText(line2).width > maxWidth && line2.includes(" ")) {
    line2 = line2.replace(/\s+\S+$/, "…");
  }

  return [line1, line2];
}

drawWheel();

//spin logik og server siden præmie
let deg = 0;
let spinning = false;

//spin knap
btn.addEventListener("click", async () => {
  if (spinning) return;

  spinning = true;
  btn.disabled = true;

  // Før spin: check at man må
  const canSpin = await checkCanSpin();

  if (!canSpin) {
    spinning = false;
    btn.disabled = false;
    return;
  }

  // Selve spinanimationen
  const extra = Math.floor(2000 + Math.random() * 3000);
  deg += extra;
  canvas.style.transform = `rotate(${deg}deg)`;

  // Når animationen er færdig
  setTimeout(() => {
    spinning = false;
    btn.disabled = false;

    // Åbn popup mens vi venter på backend
    const popup = document.getElementById("popup");
    const popupText = document.getElementById("popup-text");
    popupText.textContent = "Finder din præmie… 🔍";
    popup.style.display = "flex";

    // Backend vælger præmien
    sendWinToServer().then((data) => {
      if (!data) {
        popupText.textContent = "Der skete en fejl — prøv igen.";
        return;
      }

      if (!data.success && data.reason === "already_spun") {
        popupText.textContent =
          data.message || "Du har allerede spinnet i dag.";
        return;
      }

      if (!data.success) {
        popupText.textContent = "Serverfejl — prøv igen.";
        return;
      }

      // ✔ Vis præmien valgt af backend
      popupText.textContent = `🎉 Du vandt: ${data.prize} 🎁\nKode: ${data.code}`;
    });

    // Luk popup
    const closePopup = document.getElementById("close-popup");
    closePopup.onclick = () => {
      popup.style.display = "none";
    };

  }, 5000);
});

// Backend vælger præmie — ingen body
async function sendWinToServer() {
  try {
    const res = await fetch("/game/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    return await res.json();

  } catch (err) {
    console.error("Kunne ikke kontakte serveren:", err);
    return null;
  }
}

async function checkCanSpin() {
  try {
    const res = await fetch("/game/check");
    const data = await res.json();

    if (!data.canSpin) {
      const popup = document.getElementById("popup");
      const popupTitle = document.getElementById("popup-title");
      const popupText = document.getElementById("popup-text");

      popupTitle.textContent = "🔁 Kom tilbage i morgen";
      popupText.textContent =
        data.message || "Du har brugt dit spin for i dag.";

      popup.style.display = "flex";

      return false;
    }

    return true;

  } catch (err) {
    console.error("Fejl ved checkCanSpin:", err);
    return false;
  }
}



/*// ---- Dit eksisterende hjul-setup ----
const canvas = document.getElementById("wheel"); // hjul-canvas
const ctx = canvas.getContext("2d");
const btn = document.getElementById("spin");

//——— Farver og præmier ———
const colors = [
  "#3f51b5", "#ff9800", "#e91e63", "#4caf50",
  "#009688", "#795548", "#9c27b0", "#f44336"
];

//——— Præmier ———
const prizes = [
  "10% rabat på en valgfri oplevelse",
  "Bedre held næste gang",
  "2 for 1 oplevelsespris",
  "ØV!",
  "15% rabat på en valgfri oplevelse",
  "Bedre held næste gang",
  "100 kr. rabat på en valgfri oplevelse",
  "ØV!"
];

// ——— Tegn hjulet med tolinjers wrap ———
function drawWheel() {
  const c = canvas.width / 2;
  const r = c;
  const arc = (2 * Math.PI) / prizes.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // ryd canvas
  
  for (let i = 0; i < prizes.length; i++) {
    const start = i * arc;

    // sektoren
    ctx.beginPath();
    ctx.fillStyle = colors[i];
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

    const maxWidth = 170;          // hvor bred teksten må være
    const lines = wrapTwoLines(prizes[i], maxWidth);

    // tegn to (eller én) linjer langs radius
    const x = r - 24;              // rykket lidt ind fra kanten
    if (lines.length === 1) {
      ctx.fillText(lines[0], x, 5);
    } else {
      ctx.fillText(lines[0], x, -8);
      ctx.fillText(lines[1], x, 13);
    }
    ctx.restore();
  }
}

// simple two-line wrapper
function wrapTwoLines(text, maxWidth) {
  const words = text.split(" ");
  let line1 = "", line2 = "";

  // byg linje 1
  for (let i = 0; i < words.length; i++) {
    const test = (line1 ? line1 + " " : "") + words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      line1 = test;
    } else {
      line2 = words.slice(i).join(" ");
      break;
    }
  }
  if (!line2) return [line1];          // alt passede på én linje
  // hvis linje 2 stadig er for lang, forkort lidt (nødstop for meget lange tekster)
  while (ctx.measureText(line2).width > maxWidth && line2.includes(" ")) {
    line2 = line2.replace(/\s+\S+$/, "…");
  }
  return [line1, line2];
}

drawWheel();

// ——— Spin + korrekt vinder ift. pil øverst (nedad) ———
let deg = 0;
let spinning = false;

// spin-knap
btn.addEventListener("click", async () => {
  if (spinning) return;

  spinning = true;
  btn.disabled = true;

  // NYT: tjek med serveren først, om man må spinne i dag
  const canSpin = await checkCanSpin();
  
  if (!canSpin) {
    // Må ikke spinne → popup er allerede vist i checkCanSpin
    spinning = false;
    btn.disabled = false;
    return;
  }

  // Må gerne spinne → nu kører animationen som før
  const extra = Math.floor(2000 + Math.random() * 3000); 
  deg += extra;
  canvas.style.transform = `rotate(${deg}deg)`;

  setTimeout(() => { // efter spin er færdigt
    spinning = false;
    btn.disabled = false;

    // pilen øverst, peger NED -> pointer-vinkel = 270° i hjulets koordinater
    const actual = ((deg % 360) + 360) % 360;   // 0..359
    const slice = 360 / prizes.length;
    const pointerAngle = (270 - actual + 360) % 360; // 270° minus hjulrotation
    const index = Math.floor(pointerAngle / slice) % prizes.length;

    // vis popup i stedet for alert
    const popup = document.getElementById("popup");
    const popupText = document.getElementById("popup-text");
    const closePopup = document.getElementById("close-popup");

    const wonPrize = prizes[index];
    popupText.textContent = `Du landede på: ${wonPrize} 🎁`; 
    popup.style.display = "flex";

    // send resultat til server, som sender SMS
    sendWinToServer(wonPrize);

    closePopup.onclick = () => {
      popup.style.display = "none";
    };

  }, 5000);
});

// ---- kald backend /game/spin ----
async function sendWinToServer(prize) {
  try {
    const res = await fetch("/game/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("Kunne ikke kontakte serveren:", err);
    return null;
  }
}

// ---- NY: tjek med serveren, om man må spinne i dag ----
async function checkCanSpin() {
  try {
    const res = await fetch("/game/check");
    const data = await res.json();

    if (!data.canSpin) {
      const popup = document.getElementById("popup");
      const popupTitle = document.getElementById("popup-title");
      const popupText = document.getElementById("popup-text");

      popupTitle.textContent = "🔁 Kom tilbage i morgen";
      popupText.textContent =
        data.message || "Du har brugt dit spin for i dag, kom tilbage i morgen!";
      popup.style.display = "flex";

      return false;
    }

    return true;
  } catch (err) {
    console.error("Fejl ved checkCanSpin:", err);
    return false;
  }
}*/

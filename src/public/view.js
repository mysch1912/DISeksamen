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
  // hvis linje 2 stadig er for lang, forkort lidt (nødstop for meget lange tekster) som jeg har skrevet ind i prizes-arrayet
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
btn.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;
  btn.disabled = true;

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

    popupText.textContent = `Du landede på: ${prizes[index]} 🎁`; //har tilføjet denne emoji, men hvis i vil ændre den piger, så gør i bare det
    popup.style.display = "flex";

    closePopup.onclick = () => {
      popup.style.display = "none";
    };

  }, 5000);
});

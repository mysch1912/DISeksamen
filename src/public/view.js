// //wheel setup 
// const canvas = document.getElementById("wheel");
// const ctx = canvas.getContext("2d");
// const btn = document.getElementById("spin");

// //farver og præmier, som kun bruges til grafik
// const colors = [
//   "#3f51b5", "#ff9800", "#e91e63", "#4caf50",
//   "#009688", "#795548", "#9c27b0", "#f44336"
// ];

// //præmier
// const prizes = [
//   " 10% discount on a optional experience",
//   "Better luck next time",
//   "2 for 1 experience price",
//   "Too bad!",
//   "15% discount on a optional experience",
//   "Better luck next time",
//   "100 kr. discount on a optional experience",
//   "Too bad!"
// ];

// //hjul tegning
// function drawWheel() {
//   const c = canvas.width / 2;
//   const r = c;
//   const arc = (2 * Math.PI) / prizes.length;

//   ctx.clearRect(0, 0, canvas.width, canvas.height); //ryd canvas

//   //tegn sektorer
//   for (let i = 0; i < prizes.length; i++) {
//     const start = i * arc;

//     //sektor
//     ctx.beginPath();
//     ctx.fillStyle = colors[i];
//     ctx.moveTo(c, c);
//     ctx.arc(c, c, r, start, start + arc);
//     ctx.closePath();
//     ctx.fill();

//     //tekst
//     ctx.save();
//     ctx.translate(c, c);
//     ctx.rotate(start + arc / 2);
//     ctx.fillStyle = "#fff";
//     ctx.font = "bold 13px Poppins";
//     ctx.textAlign = "right";

//     const maxWidth = 170;
//     const lines = wrapTwoLines(prizes[i], maxWidth);
//     const x = r - 24;

//     //tegn linjer
//     if (lines.length === 1) {
//       ctx.fillText(lines[0], x, 5);
//     } else {
//       ctx.fillText(lines[0], x, -8);
//       ctx.fillText(lines[1], x, 13);
//     }

//     ctx.restore();
//   }
// }

// //hjælpefunktion til at dele tekst i to linjer
// function wrapTwoLines(text, maxWidth) {
//   const words = text.split(" ");
//   let line1 = "", line2 = "";

//   for (let i = 0; i < words.length; i++) {
//     const test = (line1 ? line1 + " " : "") + words[i];
//     if (ctx.measureText(test).width <= maxWidth) {
//       line1 = test;
//     } else {
//       line2 = words.slice(i).join(" ");
//       break;
//     }
//   }

//   if (!line2) return [line1];

//   while (ctx.measureText(line2).width > maxWidth && line2.includes(" ")) {
//     line2 = line2.replace(/\s+\S+$/, "…");
//   }

//   return [line1, line2];
// }

// drawWheel();

// //spin logik og server siden præmie
// let deg = 0;
// let spinning = false;

// //spin knap 
// btn.addEventListener("click", async () => {
//   if (spinning) return;

//   spinning = true;
//   btn.disabled = true;

//   //tjekker om man må spinne før der spinnes
//   const canSpin = await checkCanSpin();

//   if (!canSpin) {
//     spinning = false;
//     btn.disabled = false;
//     return;
//   }

//   //selve spinanimationen
//   const extra = Math.floor(2000 + Math.random() * 3000);
//   deg += extra;
//   canvas.style.transform = `rotate(${deg}deg)`;

//   //når animationen er færdig
//   setTimeout(() => {
//     spinning = false;
//     btn.disabled = false;

//     //åbn popup mens backend vælger præmie
//     const popup = document.getElementById("popup");
//     const popupText = document.getElementById("popup-text");
//     popupText.textContent = "Finding your prize… 🔍";
//     popup.style.display = "flex";

//     //backend vælger præmien
//     sendWinToServer().then((data) => {
//       if (!data) {
//         popupText.textContent = "An error occurred — please try again.";
//         return;
//       }

//       //håndterer allerede spinnet i dag
//       if (!data.success && data.reason === "already_spun") {
//         popupText.textContent =
//           data.message || "You have already spun today.";
//         return;
//       }

//       //håndterer andre fejl
//       if (!data.success) {
//         popupText.textContent = "Server error — please try again.";
//         return;
//       }

//       //viser præmien valgt af backend
//       popupText.textContent = `🎉 You won: ${data.prize} 🎁\nCode: ${data.code}`;
//     });

//     //luk popup
//     const closePopup = document.getElementById("close-popup");
//     closePopup.onclick = () => {
//       popup.style.display = "none";
//     };

//   }, 5000);
// });

// //sender spin request til serveren
// async function sendWinToServer() {
//   try {
//     const res = await fetch("/game/spin", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" }
//     });

//     return await res.json();

//   } catch (err) {
//     console.error("Could not contact the server:", err);
//     return null;
//   }
// }

// //tjekker om brugeren kan spinne i dag
// async function checkCanSpin() {
//   try {
//     const res = await fetch("/game/check");
//     const data = await res.json();

//     //popup hvis brugeren ikke kan spinne
//     if (!data.canSpin) {
//       const popup = document.getElementById("popup");
//       const popupTitle = document.getElementById("popup-title");
//       const popupText = document.getElementById("popup-text");

//       popupTitle.textContent = "🔁 Come back tomorrow";
//       popupText.textContent =
//         data.message || "You have used your spin for today.";

//       popup.style.display = "flex";

//       return false;
//     }

//     return true;

//   } catch (err) {
//     console.error("Fejl ved checkCanSpin:", err);
//     return false;
//   }
// }

//wheel setup 
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("spin");

//farver og præmier, som kun bruges til grafik
const colors = [
  "#3f51b5", "#ff9800", "#e91e63", "#4caf50",
  "#009688", "#795548", "#9c27b0", "#f44336"
];

//præmier – sørg for at rækkefølgen matcher PRIZES i backend!
const prizes = [
  "10% discount on a optional experience",
  "Better luck next time",
  "2 for 1 experience price",
  "Too bad!",
  "15% discount on a optional experience",
  "Better luck next time",
  "100 kr. discount on a optional experience",
  "Too bad!"
];

//hjul tegning
function drawWheel() {
  const c = canvas.width / 2;
  const r = c;
  const arc = (2 * Math.PI) / prizes.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height); //ryd canvas

  //tegn sektorer
  for (let i = 0; i < prizes.length; i++) {
    const start = i * arc;

    //sektor
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(c, c);
    ctx.arc(c, c, r, start, start + arc);
    ctx.closePath();
    ctx.fill();

    //tekst
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Poppins";
    ctx.textAlign = "right";

    const maxWidth = 170;
    const lines = wrapTwoLines(prizes[i], maxWidth);
    const x = r - 24;

    //tegn linjer
    if (lines.length === 1) {
      ctx.fillText(lines[0], x, 5);
    } else {
      ctx.fillText(lines[0], x, -8);
      ctx.fillText(lines[1], x, 13);
    }

    ctx.restore();
  }
}

//hjælpefunktion til at dele tekst i to linjer
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

//spin logik
let deg = 0;
let spinning = false;

//spin knap 
btn.addEventListener("click", async () => {
  if (spinning) return;

  spinning = true;
  btn.disabled = true;

  // 1) tjek om man må spinne
  const canSpin = await checkCanSpin();
  if (!canSpin) {
    spinning = false;
    btn.disabled = false;
    return;
  }

  // 2) lad backend vælge præmien FØR animation
  const data = await sendWinToServer();

  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupText = document.getElementById("popup-text");
  const closePopup = document.getElementById("close-popup");

  if (!data) {
    popupTitle.textContent = "Error";
    popupText.textContent = "An error occurred — please try again.";
    popup.style.display = "flex";
    spinning = false;
    btn.disabled = false;
    return;
  }

  if (!data.success && data.reason === "already_spun") {
    popupTitle.textContent = "🔁 Come back tomorrow";
    popupText.textContent = data.message || "You have already spun today.";
    popup.style.display = "flex";
    spinning = false;
    btn.disabled = false;
    return;
  }

  if (!data.success) {
    popupTitle.textContent = "Error";
    popupText.textContent = "Server error — please try again.";
    popup.style.display = "flex";
    spinning = false;
    btn.disabled = false;
    return;
  }

  const prizeIndex = data.prizeIndex;

  // 3) beregn hvilken vinkel hjulet skal ende på
  const arc = 360 / prizes.length;

  // lidt ekstra omgange for at det ser sejt ud
  const extraTurns = 5; // 5 fulde rotationer
  const targetAngleInSlice = prizeIndex * arc + arc / 2;

  // pilen står "øverst", så vi roterer så centeret på feltet rammer pilen
  const finalDeg = extraTurns * 360 + (360 - targetAngleInSlice);

  deg = finalDeg;
  canvas.style.transform = `rotate(${deg}deg)`;

  // 4) vis popup når CSS-transitionen er færdig (fx 5s)
  popupTitle.textContent = "🎉 You won!";
  popupText.textContent = `You won: ${data.prize}\nCode: ${data.code}`;

  // sørg for at transition-tid i CSS matcher (fx 5s)
  setTimeout(() => {
    popup.style.display = "flex";
    spinning = false;
    btn.disabled = false;
  }, 5000);

  closePopup.onclick = () => {
    popup.style.display = "none";
  };
});

//sender spin request til serveren
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

//tjekker om brugeren kan spinne i dag
async function checkCanSpin() {
  try {
    const res = await fetch("/game/check");
    const data = await res.json();

    //popup hvis brugeren ikke kan spinne
    if (!data.canSpin) {
      const popup = document.getElementById("popup");
      const popupTitle = document.getElementById("popup-title");
      const popupText = document.getElementById("popup-text");

      popupTitle.textContent = "🔁 Come back tomorrow";
      popupText.textContent =
        data.message || "You have used your spin for today.";

      popup.style.display = "flex";

      return false;
    }

    return true;
  } catch (err) {
    console.error("Fejl ved checkCanSpin:", err);
    return false;
  }
}

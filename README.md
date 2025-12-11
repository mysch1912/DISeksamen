# Spin & Win 

Spin & Win er en webapplikation, hvor brugere kan logge ind og spinne et hjul én gang om dagen. Backend bestemmer præmien og sender en SMS via Twilio. 

Applikationen kører i produktion på en DigitalOcean Droplet med Nginx, PM2 og HTTPS.

Live version: https://spins.games

## Miljøvariabler (.env)
Applikationen anvender en .env-fil, som er opgivet i rapportens bilag med koderne. Alle disse skal være udfyldte for at applikationen fungerer.

## Hvis det ønskes at køre applikationen lokalt
npm install
npm start

## Produktionsopsætning
Applikationen kører i produktion med følgende opsætning:
Nginx som reverse proxy
PM2 til at holde Node-processen kørende
Let’s Encrypt til SSL-certifikat
HTTPS som standardtrafik
Domæne: spins.games

## Login & Dagligt Spin
Brugeren opretter sig
Brugeren logger ind med telefonnummer og password
Der oprettes en session
Brugeren kan kun spinne én gang per dag
Backend håndhæver denne begrænsning 
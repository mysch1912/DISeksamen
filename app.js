const express = require('express');
const app = express();
const port = 3000;

app.use("/public", express.static("public"));

const viewRoute = require('./routes/viewRoute.js');

app.use('/', viewRoute);

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});
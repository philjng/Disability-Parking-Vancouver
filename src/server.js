const express = require('express');
const app = express();
const port = 5001;
const path = require('path');
const fs = require('fs');

app.get('/disabilityParkingRequest', (req, res) => {
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, './data/disability-parking.json'));
});

app.listen(port, () => console.log("listening on port ", port));

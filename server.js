const express = require('express');
const https = require('https');

const app = express();
const port = process.env.PORT || 5000;

const games = [];

//making the request to the API
https.get('https://api.rawg.io/api/games?page_size=5', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // Response has been received
    resp.on('end', () => {
        games.push(JSON.parse(data));
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});

//Sending data to the front
app.get('/api/games', (req, res) => {
    res.send({ games });
});

app.get('/api/games/next', (req, res) => {
    https.get(req.query.url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });


        // Response has been received
        resp.on('end', () => {
            games.push(JSON.parse(data));
        });

        res.send({ games });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
const express = require('express');
const app = express();
const PORT = 3000;

// Define a route for the home page
app.get('/', (req, res) => {
    res.send('Hello World! Express is successfully running on your PC.');
});
app.get('/newpage', (req, res) => {
    console.log("ye new page h");
    
    res.send("kya haal chaal h");
});
// Start the server
app.listen(3000);
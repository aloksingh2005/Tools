const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = 'TimeBook';

// Serve static files from the project root directory
app.use(express.static(path.join(__dirname, '..'), { index: false }));

// Redirect base path to the calculator page
app.get('/', (_req, res) => {
    res.redirect('/calculator.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`${APP_NAME} static server running on http://localhost:${PORT}`);
});

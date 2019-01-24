const path = require('path');
const express = require('express');

const PublicPath = path.join(__dirname, '../public');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(PublicPath));

app.listen(port, () => console.log(`App listening on port ${port}!`))
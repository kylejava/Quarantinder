const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
  req.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const index = require('./routes/index');
const config = require('./config/config.json');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/', index);

app.use(
  session({
    secret: config.telegram.secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: 'Strict', secure: true },
  })
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});

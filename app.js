const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send({ message: 'Hello CronSever is running!' });
});

module.exports = app;

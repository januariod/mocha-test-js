import express from 'express';

const app = express();

app.get("/hello", (req, res) => {
    res.status(200).json({ message: "Olá, NodeJS com express" })
})

app.listen(3000);

module.exports = app;
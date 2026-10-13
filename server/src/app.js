const express = require("express")
const cors = require("cors")
const helmet = require("helmet")

const app = express()

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({limit: '10kb'}));

app.get('/api/health', (req,res) => {
    res.json({status: 'ok', message: 'server is running..'});
});

module.exports = app;
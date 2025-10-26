const express = require('express');
const router = require("express").Router();
require('dotenv').config();

router.use(express.json());

const apiKey = process.env.OPENWEATHER_API_KEY;

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

router.post('/api/coordinates', async (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'request body is empty' });
      }

    const { coordinatesRequestUrl } = req.body;

    try {
      const response = await fetch(
        `${coordinatesRequestUrl}${apiKey}`
      );
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch coordinates data' });
    }
})

router.post('/api/weather', async (req, res) => {

    // this bit checks to make sure there is a request body, if not, it gets mad
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'request body is empty' });
        }

    const { weatherRequestUrl } = req.body;
  
    try {
      const response = await fetch(
        `${weatherRequestUrl}${apiKey}`
      );
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
})

module.exports = router;
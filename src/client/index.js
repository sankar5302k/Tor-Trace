// src/client/index.js
const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');

const PORT = parseInt(process.env.PORT || '4000', 10);
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/torlab';
const RELAY_COUNT = parseInt(process.env.RELAY_COUNT || '9', 10);
const MIN_ROUTE_HOPS = parseInt(process.env.MIN_ROUTE_HOPS || '3', 10);
const MAX_ROUTE_HOPS = parseInt(process.env.MAX_ROUTE_HOPS || '3', 10);

function randomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {
  const mongo = new MongoClient(MONGO_URL);
  await mongo.connect();
  const db = mongo.db('torlab');
  const nodesCol = db.collection('nodes');

  const relayMap = {};
  for (let i = 1; i <= RELAY_COUNT; i++) {
    relayMap[i] = `relay${i}:3000`;
  }

  const app = express();
  app.use(express.json());


app.get('/fetch', async (req, res) => {
  const targetUrl = req.query.url;
  const sourceIp = req.ip || "client";

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing ?url= parameter" });
  }

  // build a random route
  const hops = MIN_ROUTE_HOPS === MAX_ROUTE_HOPS
    ? MIN_ROUTE_HOPS
    : randomIntInclusive(MIN_ROUTE_HOPS, MAX_ROUTE_HOPS);

  const ids = [];
  while (ids.length < hops) {
    const candidate = randomIntInclusive(1, RELAY_COUNT);
    if (!ids.includes(candidate)) ids.push(candidate);
  }

  const payload = {
    route: ids,
    routeHosts: relayMap,
    path: [],
    sender_ip: sourceIp,
    target: targetUrl,
    meta: { ts: Date.now() }
  };

  const entryHost = relayMap[ids[0]];
  const url = `http://${entryHost}/relay`;

  try {
    const response = await axios.post(url, payload, { timeout: 60000 });

    return res.json({
      source: sourceIp,
      destination: targetUrl,
      route: ids,
      entryRelay: entryHost,
      exitRelay: ids[ids.length - 1],
      finalData: response.data
    });

  } catch (err) {
    console.error('Client fetch error:', err.message);
    return res.status(500).json({ error: 'send_failed', details: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Client running on port ${PORT}`);
});
})();

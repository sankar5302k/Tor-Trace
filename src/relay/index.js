// src/relay/index.js
const express = require('express');
const { MongoClient } = require('mongodb');
const axios = require('axios');

const NODE_ID = parseInt(process.env.NODE_ID || '0', 10);
const NODE_NAME = process.env.NODE_NAME || `relay${NODE_ID}`;
const PORT = parseInt(process.env.PORT || '3000', 10);
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/torlab';
const MIN_DELAY_MS = parseInt(process.env.MIN_DELAY_MS || '5', 10);
const MAX_DELAY_MS = parseInt(process.env.MAX_DELAY_MS || '100', 10);

function randDelay() {
  const diff = MAX_DELAY_MS - MIN_DELAY_MS;
  return MIN_DELAY_MS + Math.floor(Math.random() * (diff + 1));
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db('torlab');
  const nodesCol = db.collection('nodes');
  const connCol = db.collection('connections');

  // Validate our node exists in nodes collection
  const nodeDoc = await nodesCol.findOne({ nodeId: NODE_ID });
  if (!nodeDoc) {
    console.error(`Node ID ${NODE_ID} not found in nodes collection. Exiting.`);
    process.exit(1);
  }

  const app = express();
  app.use(express.json());

  app.post('/relay', async (req, res) => {
    const body = req.body || {};
    const route = Array.isArray(body.route) ? body.route : [];
    const routeHosts = body.routeHosts || {};
    const path = Array.isArray(body.path) ? body.path : [];
    const senderIp = body.sender_ip || null;
    const target = body.target || (body.meta && body.meta.target) || null;
    const incomingAt = Date.now();

    if (!route.length) {
      return res.status(400).json({ error: 'missing route' });
    }
    if (!route.includes(NODE_ID)) {
      return res.status(400).json({ error: `node ${NODE_ID} not in route` });
    }

    // Validate the node is recognised
    const exists = await nodesCol.findOne({ nodeId: NODE_ID });
    if (!exists) {
      return res.status(403).json({ error: 'node not recognised in db' });
    }

    // Append our hop record
    const hopRecord = {
      node: NODE_ID,
      recvTime: incomingAt,
      processDelayMs: null,
      forwardDelayMs: null,
      forwardTime: null
    };
    path.push(hopRecord);

    // Simulate processing
    const processDelay = randDelay();
    await sleep(processDelay);
    hopRecord.processDelayMs = processDelay;

    const idx = route.indexOf(NODE_ID);
    const isExit = (idx === route.length - 1);

   if (isExit) {
  const forwardTime = Date.now();
  hopRecord.forwardTime = forwardTime;
  hopRecord.forwardDelayMs = 0;

  const entryRecord = path[0] || {};
  const entryRecv = entryRecord.recvTime || incomingAt;
  const totalLatencyMs = forwardTime - entryRecv;

  let fetchResult;

  try {
    const resp = await axios.get(target, {
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 TorLab/1.0"
      }
    });

    fetchResult = {
      status: resp.status,
      headers: resp.headers,
      rawHtml: typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data)
    };

  } catch (e) {
    fetchResult = { error: "fetch_failed", message: e.message };
  }

  const connDoc = {
    route,
    path,
    sender_ip: senderIp,
    target,
    totalLatencyMs,
    fetched: fetchResult,
    exitNode: NODE_ID,
    createdAt: new Date()
  };

  await connCol.insertOne(connDoc);

  return res.json({
    delivered: true,
    exitRelay: NODE_ID,
    source: senderIp,
    destination: target,
    totalLatencyMs,
    hops: path,
    html: fetchResult.rawHtml
  });
} else {
      // Not exit: forward to next hop
      const nextNodeId = route[idx + 1];
      const nextHost = routeHosts[String(nextNodeId)];
      if (!nextHost) {
        return res.status(500).json({ error: 'missing next host mapping' });
      }

      const networkDelay = randDelay();
      await sleep(networkDelay);
      hopRecord.forwardDelayMs = networkDelay;
      hopRecord.forwardTime = Date.now();

      try {
        const url = `http://${nextHost}/relay`;
        const forwardBody = {
          route,
          routeHosts,
          path,
          sender_ip: senderIp,
          target
        };
        const resp = await axios.post(url, forwardBody, { timeout: 20000 });
        return res.json({ forwardedTo: nextHost, nextResponse: resp.data });
      } catch (err) {
        console.error(`Forward error from ${NODE_NAME} -> ${nextHost}:`, err.message || err);
        return res.status(502).json({ error: 'forward_failed', details: err.message });
      }
    }
  });

  app.get('/', (req, res) => {
    res.json({ node: NODE_ID, name: NODE_NAME });
  });

  app.listen(PORT, () => {
    console.log(`${NODE_NAME} listening on ${PORT} (NODE_ID=${NODE_ID})`);
  });
})();

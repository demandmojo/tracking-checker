const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ Tracking Checker is live. Use /check?url=https://example.com');
});

app.get('/check', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    const html = await response.text();

    const hasGTM = html.includes('www.googletagmanager.com');
    const hasGA4 = html.includes('G-');
    const hasMeta = html.includes('connect.facebook.net');

    res.json({
      url,
      tracking: {
        googleTagManager: hasGTM,
        googleAnalytics4: hasGA4,
        metaPixel: hasMeta,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch URL',
      details: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/check', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL in request body.' });
  }

  try {
    const response = await fetch(url);
    const body = await response.text();

    const hasGTM = body.includes('googletagmanager.com/gtm.js');
    const ga4Regex = /G-[A-Z0-9]{6,}/;
    const hasGA4 = ga4Regex.test(body);
    const hasMetaPixel = body.includes('connect.facebook.net') || body.includes('fbq(');

    res.json({
      url,
      tracking: {
        googleTagManager: hasGTM,
        googleAnalytics4: hasGA4,
        metaPixel: hasMetaPixel
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch URL.', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Tracking Checker API is running. Use POST /check with a JSON body.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

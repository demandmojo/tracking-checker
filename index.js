const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/check', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    const content = await page.content();

    const gtm = content.includes('www.googletagmanager.com/gtm.js');
    const ga4 = content.includes('gtag("config"') || content.includes("gtag('config'");
    const meta_pixel = content.includes('connect.facebook.net');

    await browser.close();

    res.json({
      url,
      tracking: {
        googleTagManager: gtm,
        googleAnalytics4: ga4,
        metaPixel: meta_pixel
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch or parse the page' });
  }
});

app.get('/', (req, res) => {
  res.send('Tracking Checker API is running. Use /check?url=https://example.com');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

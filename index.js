const express = require('express');
const { chromium } = require('playwright');

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.get('/check', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    const content = await page.content();

    const hasGTM = content.includes('googletagmanager.com/gtm.js');
    const ga4Regex = /G-[A-Z0-9]{6,}/;
    const hasGA4 = ga4Regex.test(content);
    const hasMetaPixel = content.includes('connect.facebook.net') || content.includes('fbq(');

    res.json({
      url,
      tracking: {
        googleTagManager: hasGTM,
        googleAnalytics4: hasGA4,
        metaPixel: hasMetaPixel
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check site.', details: err.message });
  } finally {
    await browser.close();
  }
});

app.get('/', (req, res) => {
  res.send('Tracking Checker API is running. Use /check?url=https://example.com');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

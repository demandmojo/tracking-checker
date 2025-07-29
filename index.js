import express from 'express';
import { chromium } from 'playwright';

const app = express();
app.use(express.json());

app.post('/check-tags', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle' });

    const html = await page.content();

    const gtm = html.includes('gtm.js');
    const ga4 = html.match(/G-[A-Z0-9]{6,}/);
    const ua = html.match(/UA-\d{4,}-\d+/);
    const adsTag = html.includes('googleadservices.com/pagead/conversion.js');
    const metaPixel = html.includes('connect.facebook.net');

    const result = {
      gtm,
      ga4: !!ga4,
      ua: !!ua,
      ads_tag: adsTag,
      meta_pixel: metaPixel,
      tracking_status: gtm || ga4 || ua || adsTag || metaPixel ? 'ok' : 'broken',
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to check site', detail: err.message });
  } finally {
    await browser.close();
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));

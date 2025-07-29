const express = require("express");
const { chromium } = require("playwright");

const app = express();
const port = process.env.PORT || 10000;

app.get("/check", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url, { timeout: 15000 });

    const content = await page.content();

    const gtm = content.includes("googletagmanager.com");
    const ga4 = content.includes("gtag('config'");
    const metaPixel = content.includes("connect.facebook.net");

    res.json({
      url,
      GTM: gtm,
      GA4: ga4,
      MetaPixel: metaPixel
    });
  } catch (error) {
    res.status(500).send("Error loading page");
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

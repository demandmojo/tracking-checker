const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is running! Add the /check?url=example.com endpoint.");
});

app.get("/check", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "Missing ?url= parameter" });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const hasGTM = html.includes("GTM-");
    const hasGA4 = html.includes("G-");
    const hasMetaPixel = html.includes("fbq(");

    res.json({
      url,
      gtm: hasGTM,
      ga4: hasGA4,
      metaPixel: hasMetaPixel,
    });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch URL" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "Mozilla/5.0 (LegalFeed Bot)" }
});

// Define all feed sources
const sources = {
  livelaw: "https://www.livelaw.in/rssfeed",
  barandbench: "https://www.barandbench.com/feed",
  ipleaders: "https://blog.ipleaders.in/feed",
  indiankanoon: "https://www.indiankanoon.org/rss/3",   // example: SC judgments
  casemine: "https://www.casemine.com/rss"               // may block bots, test needed
};

export default async function handler(req, res) {
  try {
    const { site } = req.query;

    if (!site || !sources[site]) {
      return res.status(400).json({
        error: "Missing or invalid site parameter",
        available: Object.keys(sources)
      });
    }

    const feedUrl = sources[site];
    let feed;

    try {
      feed = await parser.parseURL(feedUrl);
    } catch (err) {
      return res.status(502).json({
        error: `Failed to fetch from ${feedUrl}`,
        details: err.message
      });
    }

    // Format clean items
    const items = (feed.items || []).map(item => ({
      title: item.title || "No title",
      link: item.link || "",
      pubDate: item.pubDate || "",
      contentSnippet: item.contentSnippet || "",
    }));

    res.status(200).json({
      source: site,
      count: items.length,
      items
    });
  } catch (err) {
    res.status(500).json({
      error: "Unexpected Server Error",
      details: err.message
    });
  }
}

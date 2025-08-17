// api/feeds.js
import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req, res) {
  const { site } = req.query;

  // 🔹 Supported RSS sources
  const sources = {
    livelaw: "https://www.livelaw.in/rssfeed",
    barbench: "https://www.barandbench.com/feed",
    ipleaders: "https://blog.ipleaders.in/feed/",
    supremetoday: "https://www.supremetoday.ai/rss",
    sconline: "https://www.scconline.com/feed/",
    indiankanoon: "https://indiankanoon.org/rssfeed/",
    casemine: "https://www.casemine.com/rss" // ⚠️ may fail if blocked
  };

  // If no site query or invalid key → return error
  if (!site || !sources[site]) {
    res.status(400).json({ 
      error: "Invalid or missing site parameter. Try ?site=livelaw" 
    });
    return;
  }

  try {
    // Fetch and parse the feed
    const feed = await parser.parseURL(sources[site]);

    // Extract simplified JSON list
    const items = feed.items.map(item => ({
      title: item.title || "No Title",
      link: item.link || "#",
      contentSnippet: item.contentSnippet || "",
      pubDate: item.pubDate || ""
    }));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.status(200).json(items);

  } catch (error) {
    console.error("Feed fetch error:", error);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
}

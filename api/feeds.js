import Parser from "rss-parser";
const parser = new Parser();

export default async function handler(req, res) {
  const feedUrls = [
    "https://www.lawctopus.com/feed/",
    "https://blog.ipleaders.in/feed/",
    "https://lawcolumn.in/feed/",
    "https://feeds.feedburner.com/vakilno1",
    "https://legalfirm.in/feed/",
    "https://katcheri.in/feed/",
    "https://legalresearchandanalysis.com/feed/",
    "https://www.isail.in/blog-feed.xml",
    "https://www.lawweb.in/feeds/posts/default?alt=rss",
    "https://indianlegalsolution.com/feed/",
    "https://lexforti.com/legal-news/feed/",
    "https://lawwatch.in/feed/",
    "https://indialegallive.com/feed/",
    "https://www.legalbites.in/feed",
    "https://prod-qt-images.s3.amazonaws.com/production/barandbench/feed.xml",
    "https://indiankanoon.org/feeds/latest/supremecourt/",
    "https://indiankanoon.org/feeds/latest/chennai/"
  ];

  let allItems = [];

  for (const url of feedUrls) {
    try {
      const feed = await parser.parseURL(url);
      if (feed.items && feed.items.length > 0) {
        // tag with source name
        const source = feed.title || new URL(url).hostname;
        const items = feed.items.map(item => ({
          title: item.title || "Untitled",
          link: item.link,
          pubDate: item.pubDate || item.isoDate || null,
          contentSnippet: item.contentSnippet || "",
          source
        }));
        allItems.push(...items);
      }
    } catch (err) {
      console.error("❌ Failed to load:", url, err.message);
    }
  }

  // sort by date descending
  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
  res.status(200).json(allItems);
}

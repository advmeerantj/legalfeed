// /api/feeds.js
import Parser from "rss-parser";
const parser = new Parser();

export default async function handler(_, res) {
  const feedUrls = [
    { source: "Lawctopus", url: "https://www.lawctopus.com/feed/" },
    { source: "iPleaders", url: "https://blog.ipleaders.in/feed/" },
    { source: "Law Column", url: "https://lawcolumn.in/feed/" },
    { source: "Vakilno1", url: "https://feeds.feedburner.com/vakilno1" },
    { source: "Legal Research & Analysis", url: "https://legalresearchandanalysis.com/feed/" },
    { source: "iSAIL", url: "https://www.isail.in/blog-feed.xml" },
    { source: "LawWeb", url: "https://www.lawweb.in/feeds/posts/default?alt=rss" },
    { source: "India Legal Live", url: "https://indialegallive.com/feed/" },
    { source: "Legal Bites", url: "https://www.legalbites.in/feed" },
    { source: "Indian Kanoon - SC", url: "https://indiankanoon.org/feeds/latest/supremecourt/" },
    { source: "Indian Kanoon - Chennai", url: "https://indiankanoon.org/feeds/latest/chennai/" },
    { source: "SpicyIP", url: "https://spicyip.com/feed" },
    { source: "Selvam & Selvam", url: "https://selvams.com/feed" },
    { source: "Patentology", url: "https://feeds.feedburner.com/patentology" },
    { source: "IPKat", url: "https://feeds.feedburner.com/theipkat" },
  ];

  const allItems = [];

  for (const { source, url } of feedUrls) {
    try {
      const feed = await parser.parseURL(url);
      if (feed.items?.length) {
        feed.items.forEach(item => {
          allItems.push({
            source,
            title: item.title,
            link: item.link,
            pubDate: item.pubDate || item.isoDate,
            contentSnippet: item.contentSnippet || "",
          });
        });
      }
    } catch (err) {
      console.error(`Failed: ${source}`, err.message);
    }
  }

  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
  res.status(200).json(allItems);
}

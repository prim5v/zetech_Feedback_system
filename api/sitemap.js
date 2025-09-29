import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");

  // Directory where your pages live
  const pagesDir = path.join(process.cwd(), "src/pages");

  // Read all files in pages directory
  const files = fs.readdirSync(pagesDir);

  // Filter only .jsx files (skip special ones like _app, etc. if any)
  const pageFiles = files.filter(
    (file) =>
      file.endsWith(".jsx") &&
      !file.startsWith("_") &&
      !file.toLowerCase().includes("404")
  );

  // Build URLs
  const baseUrl = "https://zetech-feedback-portal.vercel.app";

  const urls = pageFiles.map((file) => {
    const name = file.replace(".jsx", "").toLowerCase();
    let loc = `${baseUrl}/${name === "homepage" ? "" : name}`;

    return `
      <url>
        <loc>${loc}</loc>
        <changefreq>weekly</changefreq>
        <priority>${name === "homepage" ? "1.0" : "0.8"}</priority>
      </url>
    `;
  });

  // Wrap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("\n")}
  </urlset>`;

  res.status(200).send(xml);
}

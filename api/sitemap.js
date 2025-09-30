export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");

  const baseUrl = "https://zetech-feedback-portal.vercel.app";

  const urls = [
    { loc: `${baseUrl}/`, priority: "1.0" },
    { loc: `${baseUrl}/admin/login`, priority: "0.8" },
    { loc: `${baseUrl}/admin/dashboard`, priority: "0.9" },
    { loc: `${baseUrl}/student/dashboard`, priority: "0.9" },
    { loc: `${baseUrl}/student/submit-issue`, priority: "0.8" },
    { loc: `${baseUrl}/student/track-issue`, priority: "0.8" },
    { loc: `${baseUrl}/student/issue-details`, priority: "0.8" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  // ✅ Use .end() with Buffer so the XML declaration is preserved
  res.status(200).end(xml);
}

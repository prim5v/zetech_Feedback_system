export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://zetech-feedback-portal.vercel.app/</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://zetech-feedback-portal.vercel.app/admin/login</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://zetech-feedback-portal.vercel.app/admin/dashboard</loc>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>https://zetech-feedback-portal.vercel.app/student/dashboard</loc>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>https://zetech-feedback-portal.vercel.app/student/submit-issue</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://zetech-feedback-portal.vercel.app/student/track-issue</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://zetech-feedback-portal.vercel.app/student/issue-details</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  </urlset>`;

  res.status(200).send(xml);
}

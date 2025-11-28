// ملف: scripts/generateSitemap.js
// قم بتشغيله بعد بناء المشروع: npm run sitemap

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://nouhelkady.nouhelkady.com';

// الصفحات الثابتة
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/projects', priority: '0.9', changefreq: 'weekly' },
  { url: '/projects-ai', priority: '0.9', changefreq: 'weekly' },
  { url: '/courses', priority: '0.9', changefreq: 'weekly' },
  { url: '/about-us', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact-us', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { url: '/terms-and-conditions', priority: '0.5', changefreq: 'yearly' },
];

function generateSitemap() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // بناء XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // الصفحات الثابتة
    staticPages.forEach(page => {
      xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${today}</lastmod>
  </url>
`;
    });

    xml += `</urlset>`;

    // حفظ الملف
    const buildDir = path.join(__dirname, '..', 'build');
    const publicDir = path.join(__dirname, '..', 'public');
    
    // حفظ في build (للإنتاج)
    if (fs.existsSync(buildDir)) {
      fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), xml);
      console.log('✅ تم إنشاء sitemap.xml في مجلد build');
    }
    
    // حفظ في public (للتطوير)
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log('✅ تم إنشاء sitemap.xml في مجلد public');
    console.log(`📊 عدد الصفحات: ${staticPages.length}`);
    console.log(`🌐 الموقع: ${BASE_URL}`);
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء sitemap:', error.message);
    process.exit(1);
  }
}

// تشغيل
generateSitemap();

// ملاحظة: إذا أردت جلب المشاريع من API، استخدم axios:
// const axios = require('axios');
// const projects = await axios.get('https://nouhelkady.nouhelkady.com/api/video-projects');
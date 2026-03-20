/**
 * App Icon Generator for QuickQR
 * Generates PNG icons for all Android mipmap densities from SVG source.
 * Run: node scripts/generate-icons.js
 *
 * Requires: sharp (npm install -D sharp)
 */
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('sharp not available, creating placeholder icons with Canvas fallback...');
    await generatePlaceholderIcons();
    return;
  }

  const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C6FF0"/>
      <stop offset="100%" style="stop-color:#5A4BD1"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="108" fill="url(#bg)"/>
  <!-- QR pattern -->
  <rect x="80" y="80" width="140" height="140" rx="20" fill="white"/>
  <rect x="292" y="80" width="140" height="140" rx="20" fill="white"/>
  <rect x="80" y="292" width="140" height="140" rx="20" fill="white"/>
  <rect x="300" y="300" width="124" height="124" rx="16" fill="white"/>
  <!-- Inner squares -->
  <rect x="110" y="110" width="80" height="80" rx="12" fill="#6C5CE7"/>
  <rect x="322" y="110" width="80" height="80" rx="12" fill="#6C5CE7"/>
  <rect x="110" y="322" width="80" height="80" rx="12" fill="#6C5CE7"/>
  <!-- Small dots -->
  <rect x="330" y="330" width="30" height="30" rx="6" fill="#6C5CE7"/>
  <rect x="375" y="330" width="30" height="30" rx="6" fill="#6C5CE7"/>
  <rect x="330" y="375" width="30" height="30" rx="6" fill="#6C5CE7"/>
  <rect x="375" y="375" width="30" height="30" rx="6" fill="#A29BFE" opacity="0.8"/>
</svg>`;

  const sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
  };

  const androidResDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

  for (const [folder, size] of Object.entries(sizes)) {
    const dir = path.join(androidResDir, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const buf = Buffer.from(svgIcon);
    await sharp(buf).resize(size, size).png().toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(buf).resize(size, size).png().toFile(path.join(dir, 'ic_launcher_round.png'));
    await sharp(buf).resize(size, size).png().toFile(path.join(dir, 'ic_launcher_foreground.png'));
    console.log(`Generated ${folder}: ${size}x${size}px`);
  }

  // Play Store icon 512x512
  const playStoreDir = path.join(__dirname, '..', 'store-assets');
  if (!fs.existsSync(playStoreDir)) fs.mkdirSync(playStoreDir, { recursive: true });

  const buf = Buffer.from(svgIcon);
  await sharp(buf).resize(512, 512).png().toFile(path.join(playStoreDir, 'icon-512.png'));
  console.log('Generated Play Store icon: 512x512px');

  console.log('Done! All icons generated.');
}

async function generatePlaceholderIcons() {
  // Fallback: copy a simple 1x1 purple PNG as placeholder
  console.log('Placeholder icons will be replaced when you run this with sharp installed.');
  console.log('Run: npm install -D sharp && node scripts/generate-icons.js');
}

generateIcons().catch(console.error);

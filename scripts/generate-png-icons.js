import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generate() {
  try {
    console.log('Generating PNG icons for PWA eligibility...');
    
    // Create public directory if not exists
    const publicDir = path.resolve('public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    const iconSvgPath = path.join(publicDir, 'icon.svg');
    const maskableSvgPath = path.join(publicDir, 'icon-maskable.svg');

    // Generate standard icons
    await sharp(iconSvgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('Generated: icon-192.png');

    await sharp(iconSvgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('Generated: icon-512.png');

    // Generate maskable icons
    await sharp(maskableSvgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-maskable-192.png'));
    console.log('Generated: icon-maskable-192.png');

    await sharp(maskableSvgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-maskable-512.png'));
    console.log('Generated: icon-maskable-512.png');

    console.log('PWA PNG Icons generated successfully!');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generate();

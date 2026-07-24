import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// High-fidelity Official PORTAL ORBIT Logo SVG
const makeSvg = (isMaskable: boolean = false) => `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Space Gradient -->
    <radialGradient id="bg-space" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#0d0e26" />
      <stop offset="60%" stop-color="#040510" />
      <stop offset="100%" stop-color="#010105" />
    </radialGradient>

    <!-- Squircle Neon Frame Gradient -->
    <linearGradient id="neon-frame-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e879f9" /> <!-- Neon Pink/Magenta -->
      <stop offset="35%" stop-color="#a855f7" /> <!-- Purple -->
      <stop offset="70%" stop-color="#38bdf8" /> <!-- Cyan -->
      <stop offset="100%" stop-color="#0284c7" /> <!-- Deep Blue -->
    </linearGradient>

    <!-- Planet Spherical Gradient -->
    <linearGradient id="planet-body-grad" x1="15%" y1="15%" x2="85%" y2="85%">
      <stop offset="0%" stop-color="#38bdf8" /> <!-- Bright Cyan Highlight -->
      <stop offset="30%" stop-color="#2563eb" /> <!-- Electric Blue -->
      <stop offset="65%" stop-color="#4c1d95" /> <!-- Deep Indigo/Purple -->
      <stop offset="100%" stop-color="#1e1b4b" /> <!-- Cosmic Dark Base -->
    </linearGradient>

    <!-- Planet 3D Volume Shadow -->
    <radialGradient id="planet-3d-shadow" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="40%" stop-color="#000000" stop-opacity="0" />
      <stop offset="85%" stop-color="#020208" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.95" />
    </radialGradient>

    <!-- Planetary Main Rings Gradient -->
    <linearGradient id="ring-main-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f472b6" /> <!-- Pink -->
      <stop offset="40%" stop-color="#c084fc" /> <!-- Purple -->
      <stop offset="80%" stop-color="#38bdf8" /> <!-- Cyan -->
      <stop offset="100%" stop-color="#a5f3fc" /> <!-- Ice Blue -->
    </linearGradient>

    <!-- Bottom Orbit Loop Gradient under ORBIT -->
    <linearGradient id="bottom-orbit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0.2" />
      <stop offset="30%" stop-color="#c084fc" stop-opacity="0.9" />
      <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#67e8f9" stop-opacity="0.3" />
    </linearGradient>

    <!-- Star Flare Radial Glow -->
    <radialGradient id="star-flare-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
      <stop offset="25%" stop-color="#7dd3fc" stop-opacity="0.7" />
      <stop offset="60%" stop-color="#a855f7" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Glow Filters -->
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="text-light-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Nebula Cloud Top Left -->
    <radialGradient id="nebula-purple" cx="30%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#d946ef" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Nebula Cloud Bottom Right -->
    <radialGradient id="nebula-cyan" cx="80%" cy="50%" r="45%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.3" />
      <stop offset="60%" stop-color="#0369a1" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <filter id="blur-nebula">
      <feGaussianBlur stdDeviation="40" />
    </filter>
  </defs>

  <!-- Base Space Canvas -->
  <rect width="1024" height="1024" fill="url(#bg-space)" />

  <!-- Outer Rounded Squircle Frame (Dark Metallic Container) -->
  ${!isMaskable ? `
  <rect x="28" y="28" width="968" height="968" rx="190" ry="190" fill="#030511" />
  <rect x="28" y="28" width="968" height="968" rx="190" ry="190" fill="url(#bg-space)" />
  <!-- Neon Outer Glowing Border -->
  <rect x="28" y="28" width="968" height="968" rx="190" ry="190" fill="none" stroke="url(#neon-frame-grad)" stroke-width="14" filter="url(#neon-glow)" />
  ` : ''}

  <!-- COSMIC NEBULAE AND STARDUST -->
  <ellipse cx="280" cy="280" rx="350" ry="250" fill="url(#nebula-purple)" filter="url(#blur-nebula)" />
  <ellipse cx="800" cy="500" rx="300" ry="300" fill="url(#nebula-cyan)" filter="url(#blur-nebula)" />

  <!-- Starfield background dots -->
  <g fill="#ffffff" opacity="0.65">
    <circle cx="120" cy="180" r="2.5" />
    <circle cx="220" cy="120" r="1.8" />
    <circle cx="850" cy="160" r="2.2" />
    <circle cx="910" cy="320" r="1.5" />
    <circle cx="150" cy="780" r="2" />
    <circle cx="880" cy="820" r="2.5" />
    <circle cx="200" cy="520" r="1.5" />
    <circle cx="820" cy="620" r="1.8" />
    <circle cx="480" cy="100" r="2" />
  </g>

  <!-- CELESTIAL PLANET SYSTEM (Tilted -20deg around Planet Center at 512, 350) -->
  <g transform="rotate(-20 512 350)">
    <!-- 1. Back Ring Half -->
    <path d="M 130 350 A 390 95 0 0 1 894 350" fill="none" stroke="url(#ring-main-grad)" stroke-width="28" stroke-opacity="0.85" stroke-linecap="round" />
    <path d="M 80 350 A 440 110 0 0 1 944 350" fill="none" stroke="url(#ring-main-grad)" stroke-width="6" stroke-opacity="0.4" stroke-linecap="round" />

    <!-- 2. Planet Sphere Body -->
    <circle cx="512" cy="350" r="225" fill="url(#planet-body-grad)" />
    <!-- 3D Lighting Crescent Overlay -->
    <circle cx="512" cy="350" r="225" fill="url(#planet-3d-shadow)" />

    <!-- 3. Front Ring Half (Wraps in Front of Planet Body) -->
    <path d="M 894 350 A 390 95 0 0 1 130 350" fill="none" stroke="url(#ring-main-grad)" stroke-width="28" stroke-linecap="round" filter="url(#neon-glow)" />
    <!-- Bright White Core Line in Ring -->
    <path d="M 880 350 A 376 90 0 0 1 144 350" fill="none" stroke="#ffffff" stroke-width="6" stroke-opacity="0.9" stroke-linecap="round" />
    <path d="M 944 350 A 440 110 0 0 1 80 350" fill="none" stroke="url(#ring-main-grad)" stroke-width="6" stroke-opacity="0.6" stroke-linecap="round" />

    <!-- 4. Top-Right Brilliant Star Flare -->
    <g transform="translate(775, 255)">
      <!-- Radial Flare Glow -->
      <circle cx="0" cy="0" r="100" fill="url(#star-flare-glow)" />
      
      <!-- Primary Vertical 4-pointed Star -->
      <path d="M 0 -95 L 9 -18 L 95 0 L 9 18 L 0 95 L -9 18 L -95 0 L -9 -18 Z" fill="#ffffff" />
      <!-- Diagonal Secondary Star -->
      <path d="M 0 -50 L 6 -10 L 50 0 L 6 10 L 0 50 L -6 10 L -50 0 L -6 -10 Z" fill="#ffffff" transform="rotate(45)" opacity="0.85" />
      
      <!-- Intense Hot Core -->
      <circle cx="0" cy="0" r="16" fill="#ffffff" />
      <circle cx="0" cy="0" r="7" fill="#a5f3fc" />
    </g>
  </g>

  <!-- OFFICIAL BRAND TYPOGRAPHY: PORTAL ORBIT -->
  <g text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">
    <!-- PORTAL Text -->
    <text x="512" y="715" font-size="120" font-weight="900" letter-spacing="12" fill="#ffffff" filter="url(#text-light-glow)">PORTAL</text>
    
    <!-- ORBIT Text -->
    <text x="512" y="845" font-size="120" font-weight="900" letter-spacing="12" fill="#ffffff" filter="url(#text-light-glow)">ORBIT</text>
  </g>

  <!-- SWOOPING ORBITAL LOOP UNDERNEATH THE WORD 'ORBIT' -->
  <path d="M 160 810 C 220 920, 800 930, 890 770" fill="none" stroke="url(#bottom-orbit-grad)" stroke-width="12" stroke-linecap="round" filter="url(#neon-glow)" />
  <path d="M 160 810 C 220 920, 800 930, 890 770" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8" />
</svg>
`;

async function generate() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Define targets
  const targets = [
    { name: 'icon-192.png', size: 192, isMaskable: false },
    { name: 'icon-512.png', size: 512, isMaskable: false },
    { name: 'icon-maskable-192.png', size: 192, isMaskable: true },
    { name: 'icon-maskable-512.png', size: 512, isMaskable: true },
  ];

  console.log("🌌 Starting High-Fidelity Official PORTAL ORBIT Logo Generation via Sharp...");

  for (const target of targets) {
    const destPath = path.join(publicDir, target.name);
    console.log(`✨ Rendering ${target.name} (${target.size}x${target.size}) [maskable: ${target.isMaskable}]...`);
    
    const svgStr = makeSvg(target.isMaskable);
    
    await sharp(Buffer.from(svgStr))
      .resize(target.size, target.size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(destPath);
  }

  // Write master vector SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), makeSvg(false));
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), makeSvg(true));
  console.log("✨ Master vector SVGs written to /public/icon.svg and /public/icon-maskable.svg...");

  console.log("✅ All PORTAL ORBIT PWA icons generated and optimized successfully in /public!");
}

generate().catch(err => {
  console.error("❌ Error generating icons:", err);
  process.exit(1);
});


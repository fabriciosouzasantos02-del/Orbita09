async function test() {
  const urls = [
    "https://raw.githubusercontent.com/crockettio/tarot-api/master/public/images/cards/m00.jpg",
    "https://raw.githubusercontent.com/crockettio/tarot-api/main/public/images/cards/m00.jpg",
    "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/00.jpg",
    "https://raw.githubusercontent.com/ekg/tarot/main/images/cards/00.jpg",
    "https://raw.githubusercontent.com/mizofuyo/tarot/master/images/cards/00.jpg",
    "https://raw.githubusercontent.com/mizofuyo/tarot/main/images/cards/00.jpg",
    "https://raw.githubusercontent.com/mizofuyo/tarot/master/images/00.jpg",
    "https://raw.githubusercontent.com/mizofuyo/tarot/main/images/00.jpg",
    "https://raw.githubusercontent.com/crockettio/tarot-api/master/public/images/cards/c01.jpg",
    "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/01w.jpg",
    "https://raw.githubusercontent.com/mizofuyo/tarot/master/images/cards/01w.jpg",
    "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/01_wands.jpg"
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`URL: ${url} -> status: ${res.status}`);
    } catch (e) {
      console.log(`URL: ${url} -> error: ${e.message}`);
    }
  }
}
test();

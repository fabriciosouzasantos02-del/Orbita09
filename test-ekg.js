async function test() {
  const urls = [
    "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/02.jpg",
    "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/00.jpg",
    "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/c01.jpg",
    "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/w01.jpg",
    "https://raw.githubusercontent.com/frosas/tarot-api/master/public/images/cards/m00.jpg",
    "https://raw.githubusercontent.com/frosas/tarot-api/master/public/images/cards/0.jpg",
    "https://raw.githubusercontent.com/frosas/tarot-api/master/public/cards/0.jpg",
    "https://raw.githubusercontent.com/frosas/tarot-api/master/images/cards/00.jpg",
    "https://raw.githubusercontent.com/frosas/tarot-api/master/images/00.jpg",
    "https://raw.githubusercontent.com/frosas/tarot-api/master/public/images/00.jpg",
    "https://raw.githubusercontent.com/frosas/tarot-api/master/static/cards/00.jpg"
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      console.log(`URL: ${url} -> status: ${res.status}`);
    } catch (e) {
      console.error(`URL: ${url} -> error: ${e.message}`);
    }
  }
}
test();

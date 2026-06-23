async function test() {
  const urls = [
    "https://raw.githubusercontent.com/krates98/tarotcardapi/main/images/knightofcups.jpeg",
    "https://raw.githubusercontent.com/krates98/tarotcardapi/main/images/TheLovers.jpg",
    "https://raw.githubusercontent.com/krates98/tarotcardapi/main/images/thefool.jpeg"
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      console.log(`URL: ${url} -> status: ${res.status}`);
    } catch (e) {
      console.log(`Error fetching ${url}: ${e.message}`);
    }
  }
}
test();

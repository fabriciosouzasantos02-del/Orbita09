async function test() {
  const branches = ["master", "main"];
  const paths = [
    "images/cards/01.jpg",
    "images/01.jpg",
    "cards/01.jpg",
    "01.jpg",
    "images/cards/00.jpg",
    "images/00.jpg",
    "cards/00.jpg",
    "00.jpg"
  ];
  for (const br of branches) {
    for (const p of paths) {
      const url = `https://raw.githubusercontent.com/ekg/tarot-cards/${br}/${p}`;
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (res.status === 200) {
          console.log(`[FOUND!] ${url}`);
          return;
        }
      } catch (e) {
        // ignore
      }
    }
  }
  console.log("No files found in ekg/tarot-cards.");
}
test();

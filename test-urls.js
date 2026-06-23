async function test() {
  const apis = [
    "https://api.github.com/repos/mizofuyo/tarot",
    "https://api.github.com/repos/mizofuyo/tarot/contents",
    "https://api.github.com/repos/mizofuyo/tarot/contents/images/cards",
    "https://api.github.com/repos/mizofuyo/tarot/contents/images"
  ];
  
  for (const api of apis) {
    try {
      const res = await fetch(api);
      console.log(`\n=== Contents of ${api} (status: ${res.status}) ===`);
      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body)) {
          console.log(body.map(f => `${f.type}: ${f.name} (path: ${f.path})`));
        } else {
          console.log(`Default branch: ${body.default_branch}`);
          console.log(`Description: ${body.description}`);
        }
      } else {
        const err = await res.text();
        console.log(`Failed: ${err.substring(0, 200)}`);
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}
test();

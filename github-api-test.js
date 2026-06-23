async function test() {
  const url = "https://api.github.com/repos/krates98/tarotcardapi/contents/images";
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (res.ok) {
      const data = await res.json();
      console.log(JSON.stringify(data.map(f => f.name)));
    } else {
      console.log("Error body:", await res.text());
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();

async function test() {
  const testUrl = "https://raw.githubusercontent.com/frosas/tarot-api/master/package.json";
  try {
    const res = await fetch(testUrl);
    console.log(`Test raw github: ${testUrl} -> status: ${res.status}`);
    if (res.ok) {
      console.log(await res.text());
    }
  } catch (e) {
    console.log(`Test raw github error: ${e.message}`);
  }

  const testUrl2 = "https://raw.githubusercontent.com/ekg/tarot/master/README.md";
  try {
    const res2 = await fetch(testUrl2);
    console.log(`Test raw github: ${testUrl2} -> status: ${res2.status}`);
  } catch (e) {
    console.log(`Test raw github error: ${e.message}`);
  }
}
test();

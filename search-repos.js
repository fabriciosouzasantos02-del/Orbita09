async function search() {
  const query = "tarot+images";
  const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log(`Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`Found ${data.total_count} repositories.`);
      const items = data.items || [];
      console.log("Top 5 repositories:");
      for (const item of items.slice(0, 5)) {
        console.log(`- ${item.full_name}: ${item.description || ''} (Stars: ${item.stargazers_count})`);
      }
    } else {
      console.log("Error:", await res.text());
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
search();

import json
import os
import time
import urllib.request

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

language_names = {
    "en": "English",
    "es": "Spanish",
    "de": "German",
    "fr": "French"
}

def translate_batch(lang, batch):
    prompt = f"""You are a professional translator for a spiritual astrology, tarot, and numerology app.
Translate these Portuguese strings into natural {language_names[lang]}.
CRITICAL:
1. Keep placeholders like {{name}}, {{count}}, {{city}}, etc. EXACTLY intact.
2. Return ONLY a single valid JSON object mapping exact Portuguese strings to {language_names[lang]} translations.

Portuguese strings:
{json.dumps(batch, ensure_ascii=False)}"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json"}
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "aistudio-build"}
    )

    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                text = res_data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text)
                return parsed
        except Exception as e:
            print(f"    Attempt {attempt+1}/5 failed for {lang}: {e}. Waiting 10s...")
            time.sleep(10)
    return {}

def main():
    with open("missing-translations-map.json", "r", encoding="utf-8") as f:
        missing_map = json.load(f)

    all_keys = list(missing_map.keys())
    print(f"Total keys to translate: {len(all_keys)}")

    output = {"en": {}, "es": {}, "de": {}, "fr": {}}
    if os.path.exists("audit-translations-output.json"):
        try:
            with open("audit-translations-output.json", "r", encoding="utf-8") as f:
                output = json.load(f)
        except:
            pass

    batch_size = 60

    for lang in ["en", "es", "de", "fr"]:
        if lang not in output:
            output[lang] = {}
        untranslated = [k for k in all_keys if k not in output[lang]]
        print(f"\nLanguage {lang}: {len(untranslated)} keys remaining...")

        total_batches = (len(untranslated) + batch_size - 1) // batch_size if len(untranslated) > 0 else 0
        for i in range(0, len(untranslated), batch_size):
            batch = untranslated[i:i+batch_size]
            batch_num = (i // batch_size) + 1
            print(f"  Batch {batch_num}/{total_batches} for {lang} ({len(batch)} items)...")
            res = translate_batch(lang, batch)
            if res:
                output[lang].update(res)
                with open("audit-translations-output.json", "w", encoding="utf-8") as out_f:
                    json.dump(output, out_f, ensure_ascii=False, indent=2)
                print(f"    Saved batch {batch_num}/{total_batches} for {lang}! Total: {len(output[lang])}")
            
            time.sleep(3)

    print("\nSUCCESS! Wrote all translations to audit-translations-output.json")

if __name__ == "__main__":
    main()

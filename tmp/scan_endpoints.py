import re

with open("server.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

endpoints = []
for i, line in enumerate(lines):
    m = re.search(r"app\.(post|get|put|delete)\(\s*[\"'\`](/api/[^\"'\`]+)[\"'\`]", line)
    if m:
        verb = m.group(1).upper()
        path = m.group(2)
        endpoints.append((i+1, verb, path))

print(f"Found {len(endpoints)} API endpoints in server.ts:\n")
for line_num, verb, path in endpoints:
    block = "".join(lines[line_num-1:line_num+70])
    has_lang = ("lang" in block) or ("language" in block) or ("activeLang" in block) or ("req.t" in block) or ("accept-language" in block)
    print(f"Line {line_num:4d}: [{verb:4s}] {path:<38s} | Has Lang: {has_lang}")

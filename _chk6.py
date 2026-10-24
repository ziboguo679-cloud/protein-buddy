lines = open("index.html", encoding="utf-8").read().split("\n")
for i, l in enumerate(lines):
    if "prefers-color-scheme" in l or "深色模式" in l:
        print(i + 1, l[:80])

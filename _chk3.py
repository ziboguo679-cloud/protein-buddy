src = open("app.js", encoding="utf-8").read()
import re
for pat in ["THEME_KEY", "applySavedTheme", "applyThemeAssets", "proteinBuddyTheme"]:
    hits = [(i + 1, l.strip()[:90]) for i, l in enumerate(src.split("\n")) if pat in l]
    print("==", pat)
    for h in hits:
        print("  ", h)

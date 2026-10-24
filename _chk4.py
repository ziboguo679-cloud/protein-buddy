import re
src = open("app.js", encoding="utf-8").read()
m = re.search(r"const THEMES = \[(.*?)\];", src, re.S)
ids = re.findall(r'id:\s*"([^"]+)"', m.group(1)) if m else []
print("disk THEMES ids:", ids)
# 确认关键字段
print("has pachacco:", "pachacco" in ids)
print("THEME_KEY line:", [l.strip() for l in src.split("\n") if "THEME_KEY =" in l])

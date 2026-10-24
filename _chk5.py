src = open("index.html", encoding="utf-8").read()
print("dark-block removed:", "@media" not in src)
print("chars:", len(src))

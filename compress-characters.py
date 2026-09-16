"""压缩角色素材到 400px 宽（仅缩放，不改动形象内容）"""
from PIL import Image
import os

d = "assets/character"
for f in os.listdir(d):
    p = os.path.join(d, f)
    im = Image.open(p)
    w, h = im.size
    if w > 400:
        im = im.resize((400, int(h * 400 / w)), Image.LANCZOS)
        im.save(p, optimize=True)
    print(f, "->", im.size, os.path.getsize(p) // 1024, "KB")

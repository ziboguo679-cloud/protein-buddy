lines = open("index.html", encoding="utf-8").read().split("\n")
# 找 @media 块的结束（从 581 行 0-based 580 开始，配对花括号）
start = 580  # 0-based，@media 行
assert "@media" in lines[start], lines[start]
depth = 0
end = None
for i in range(start, len(lines)):
    depth += lines[i].count("{") - lines[i].count("}")
    if depth == 0:
        end = i
        break
# 同时删除上面的注释行 579（0-based 578）
del_start = start - 1 if "深色模式" in lines[start - 1] else start
del lines[del_start:end + 1]
open("index.html", "w", encoding="utf-8").write("\n".join(lines))
print("removed lines", del_start + 1, "to", end + 1)

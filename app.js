/* 蛋白质小助手 v2 —— 全部逻辑 */
"use strict";

/* ================= 基础数据 ================= */
const COEF = { cut: 2.2, gain: 2.0, keep: 1.4 };
const GOAL_NAME = { cut: "减脂", gain: "增肌", keep: "维持" };
const MEALS = [
  { id: "breakfast", name: "早餐", em: "🌅" },
  { id: "lunch",     name: "午餐", em: "☀️" },
  { id: "dinner",    name: "晚餐", em: "🌙" },
  { id: "snack",     name: "加餐", em: "🍡" },
];
const CATS = [
  { id: "all",    name: "全部" },
  { id: "meat",   name: "🥩 肉类" },
  { id: "sea",    name: "🐟 海鲜" },
  { id: "egg",    name: "🥚 蛋奶" },
  { id: "bean",   name: "🫘 豆类" },
  { id: "staple", name: "🍚 主食" },
  { id: "veg",    name: "🥦 蔬果" },
  { id: "sup",    name: "💪 补剂" },
];
// p/c/f = 蛋白质/碳水/脂肪 g 每100g；g = 一份克数；note = 生熟标注；veg = 素食可吃
const FOODS = [
  { id:"chicken",  name:"鸡胸肉",   em:"🍗", cat:"meat", p:31,  c:0,   f:3.6, g:100, note:"生", veg:false },
  { id:"thigh",    name:"去皮鸡腿", em:"🍖", cat:"meat", p:20,  c:0,   f:8,   g:120, note:"生", veg:false },
  { id:"beef",     name:"瘦牛肉",   em:"🥩", cat:"meat", p:20,  c:1.2, f:6.5, g:100, note:"生", veg:false },
  { id:"pork",     name:"猪里脊",   em:"🐖", cat:"meat", p:20,  c:0.7, f:7.9, g:100, note:"生", veg:false },
  { id:"duck",     name:"鸭腿去皮", em:"🦆", cat:"meat", p:19,  c:0,   f:10,  g:120, note:"生", veg:false },
  { id:"lamb",     name:"瘦羊肉",   em:"🐏", cat:"meat", p:20,  c:0,   f:7,   g:100, note:"生", veg:false },
  { id:"burger",   name:"汉堡包",   em:"🍔", cat:"meat", p:12,  c:28,  f:12,  g:200, note:"熟", veg:false },
  { id:"fish",     name:"三文鱼",   em:"🐟", cat:"sea",  p:20,  c:0,   f:13,  g:100, note:"生", veg:false },
  { id:"cod",      name:"鳕鱼",     em:"🐠", cat:"sea",  p:18,  c:0,   f:1,   g:120, note:"生", veg:false },
  { id:"shrimp",   name:"虾仁",     em:"🦐", cat:"sea",  p:18,  c:0.5, f:1,   g:100, note:"生", veg:false },
  { id:"tuna",     name:"金枪鱼",   em:"🐋", cat:"sea",  p:24,  c:0,   f:4,   g:100, note:"",  veg:false },
  { id:"squid",    name:"鱿鱼",     em:"🦑", cat:"sea",  p:15,  c:3,   f:1,   g:100, note:"生", veg:false },
  { id:"egg",      name:"鸡蛋1个",  em:"🥚", cat:"egg",  p:13,  c:1.5, f:9,   g:50,  note:"",  veg:true  },
  { id:"milk",     name:"牛奶",     em:"🥛", cat:"egg",  p:3.3, c:5,   f:3.6, g:250, note:"",  veg:true  },
  { id:"yogurt",   name:"酸奶",     em:"🍶", cat:"egg",  p:3.5, c:12,  f:3.3, g:200, note:"",  veg:true  },
  { id:"gyogurt",  name:"希腊酸奶", em:"🥣", cat:"egg",  p:9,   c:4,   f:5,   g:100, note:"",  veg:true  },
  { id:"cheese",   name:"奶酪片",   em:"🧀", cat:"egg",  p:20,  c:3,   f:25,  g:25,  note:"",  veg:true  },
  { id:"whey",     name:"蛋白粉1勺",em:"💪", cat:"sup",  p:80,  c:5,   f:3,   g:30,  note:"",  veg:true  },
  { id:"bar",      name:"蛋白棒",   em:"🍫", cat:"sup",  p:33,  c:30,  f:9,   g:60,  note:"",  veg:true  },
  { id:"tofu",     name:"豆腐",     em:"🧊", cat:"bean", p:8,   c:2,   f:4.5, g:100, note:"",  veg:true  },
  { id:"dried",    name:"豆干",     em:"🟫", cat:"bean", p:16,  c:5,   f:8,   g:50,  note:"",  veg:true  },
  { id:"soymilk",  name:"豆浆",     em:"🫘", cat:"bean", p:3,   c:1.2, f:1.6, g:250, note:"",  veg:true  },
  { id:"edamame",  name:"毛豆",     em:"🌱", cat:"bean", p:13,  c:10,  f:5,   g:80,  note:"",  veg:true  },
  { id:"chickpea", name:"鹰嘴豆",   em:"🟤", cat:"bean", p:19,  c:45,  f:4,   g:60,  note:"熟", veg:true  },
  { id:"fuzhu",    name:"腐竹",     em:"🟨", cat:"bean", p:46,  c:15,  f:22,  g:30,  note:"干", veg:true  },
  { id:"rice",     name:"米饭",     em:"🍚", cat:"staple", p:2.6, c:26, f:0.3, g:150, note:"熟", veg:true  },
  { id:"noodle",   name:"面条",     em:"🍜", cat:"staple", p:3.6, c:25, f:0.5, g:200, note:"熟", veg:true  },
  { id:"mantou",   name:"馒头",     em:"🥟", cat:"staple", p:7,  c:47,  f:1.1, g:100, note:"熟", veg:true  },
  { id:"bread",    name:"全麦面包", em:"🍞", cat:"staple", p:9,  c:45,  f:3.5, g:50,  note:"",  veg:true  },
  { id:"oat",      name:"燕麦片",   em:"🌾", cat:"staple", p:13, c:60,  f:7,   g:40,  note:"干", veg:true  },
  { id:"potato",   name:"红薯",     em:"🍠", cat:"staple", p:1.6,c:24,  f:0.2, g:150, note:"熟", veg:true  },
  { id:"corn",     name:"玉米",     em:"🌽", cat:"staple", p:4,  c:23,  f:1.2, g:100, note:"",  veg:true  },
  { id:"dumpling", name:"饺子",     em:"🥠", cat:"staple", p:8,  c:26,  f:4,   g:150, note:"熟", veg:false },
  { id:"brocoli",  name:"西兰花",   em:"🥦", cat:"veg",  p:3,   c:4,   f:0.4, g:150, note:"熟", veg:true  },
  { id:"spinach",  name:"菠菜",     em:"🥬", cat:"veg",  p:2.9, c:3,   f:0.4, g:150, note:"熟", veg:true  },
  { id:"mushroom", name:"蘑菇",     em:"🍄", cat:"veg",  p:3.1, c:3,   f:0.3, g:100, note:"熟", veg:true  },
  { id:"pea",      name:"豌豆",     em:"🫛", cat:"veg",  p:5.4, c:18,  f:0.4, g:100, note:"熟", veg:true  },
  { id:"banana",   name:"香蕉",     em:"🍌", cat:"veg",  p:1.1, c:22,  f:0.3, g:100, note:"",  veg:true  },
  { id:"nut",      name:"混合坚果", em:"🥜", cat:"veg",  p:20,  c:15,  f:50,  g:25,  note:"",  veg:true  },
  { id:"yakult",   name:"养乐多",   em:"🧴", cat:"veg",  p:1.2, c:16,  f:0,   g:100, note:"",  veg:true  },
];
const EMOJIS = ["🍔","🍗","🥩","🐟","🥚","🥛","🧀","🫘","🍚","🍜","🥦","🍎","💪","🍶","🥣","🍤"];
const TEMPLATES = [
  { id:"t1", em:"🌅", name:"增肌早餐",  desc:"鸡蛋+牛奶+燕麦 ≈ 29g蛋白", items:[["egg",100],["milk",250],["oat",40]] },
  { id:"t2", em:"💪", name:"练后加餐",  desc:"蛋白粉+香蕉 ≈ 28g蛋白",   items:[["whey",30],["banana",100]] },
  { id:"t3", em:"🥩", name:"高蛋白正餐",desc:"鸡胸+米饭+西兰花 ≈ 51g蛋白", items:[["chicken",150],["rice",150],["brocoli",150]] },
  { id:"t4", em:"🥬", name:"素食轻食",  desc:"豆腐+毛豆+玉米 ≈ 19g蛋白", items:[["tofu",100],["edamame",80],["corn",100]] },
];

/* ================= 存储 ================= */
const KEY = "proteinBuddyV2";
function todayStr(d) {
  d = d || new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 2) return s;
  } catch (e) {}
  // v1 数据迁移
  try {
    const old = JSON.parse(localStorage.getItem("proteinBuddyV1"));
    if (old && old.profile) {
      const logs = {};
      Object.keys(old.logs || {}).forEach(k => {
        logs[k] = (old.logs[k] || []).map(e => {
          const f = FOODS.find(x => x.id === e.foodId);
          return f ? { uid: "m" + Math.random().toString(36).slice(2, 8), name: f.name, em: f.em, p100: f.p, c100: f.c, f100: f.f, grams: e.grams, meal: "lunch", veg: f.veg } : null;
        }).filter(Boolean);
      });
      return { v: 2, profile: { weight: old.profile.weight, goal: old.profile.goal, coef: null, macroOn: false }, customFoods: [], logs, weights: {} };
    }
  } catch (e) {}
  return { v: 2, profile: null, customFoods: [], logs: {}, weights: {} };
}
let state = loadState();
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

/* ================= UI 状态 ================= */
let curDate = todayStr();
let curMeal = guessMeal();
let curCat = "all";
let curSearch = "";
let vegOnly = false;
let mult = 1;
let calMonth = new Date();
let editUid = null;      // 正在编辑的记录
let editFoodId = null;   // 正在编辑的自定义食物

function guessMeal() {
  const h = new Date().getHours();
  if (h < 10) return "breakfast";
  if (h < 14) return "lunch";
  if (h < 21) return "dinner";
  return "snack";
}
const $ = (id) => document.getElementById(id);
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 1700);
}
function fmt(n) { return Math.round(n * 10) / 10; }
function openModal(id) { $(id).classList.add("show"); }
function closeModal(id) { $(id).classList.remove("show"); }
function dateLabelStr(iso) {
  if (iso === todayStr()) return "今天";
  const d = new Date(iso + "T12:00:00");
  const diff = Math.round((new Date(todayStr() + "T12:00:00") - d) / 86400000);
  if (diff === 1) return "昨天";
  return (d.getMonth() + 1) + "月" + d.getDate() + "日";
}

/* ================= 数据访问 ================= */
function coef() {
  const p = state.profile;
  if (!p) return COEF.gain;
  if (p.coef && p.coef >= 0.8 && p.coef <= 3) return p.coef;
  return COEF[p.goal] || 2.0;
}
function dailyTarget() {
  return state.profile ? Math.round(state.profile.weight * coef()) : 0;
}
function dayLog(iso) {
  if (!state.logs[iso]) state.logs[iso] = [];
  return state.logs[iso];
}
function consumed(iso) {
  return dayLog(iso).reduce((s, e) => s + e.p100 * e.grams / 100, 0);
}
function allFoods() {
  return FOODS.concat(state.customFoods);
}
function findFood(id) {
  return allFoods().find(f => f.id === id);
}

/* ================= 渲染 ================= */
function renderDateBar() {
  $("dateLabel").textContent = "📅 " + dateLabelStr(curDate);
  $("btnBackToday").classList.toggle("show", curDate !== todayStr());
  $("logDateTag").textContent = dateLabelStr(curDate);
}

function renderRing() {
  const target = dailyTarget();
  const eaten = consumed(curDate);
  const pct = target > 0 ? Math.min(eaten / target, 1) : 0;
  const C = 320.44;
  const bar = $("ringBar");
  bar.style.stroke = pct >= 1 ? "#2ED573" : "#FF9F43";
  bar.style.strokeDashoffset = C * (1 - pct);
  $("ringNum").textContent = Math.round(eaten);
  $("ringTarget").textContent = target;

  if (!state.profile) {
    $("helloLine").textContent = "你好呀！";
    $("statusLine").textContent = "先设置体重和目标吧～";
    $("statusPill").textContent = "待设置";
    $("statusPill").style.background = "var(--teal)";
  } else {
    const p = state.profile;
    const remain = Math.max(target - eaten, 0);
    $("helloLine").textContent = `${p.weight}kg · ${p.coef ? "自定义系数 " + p.coef : GOAL_NAME[p.goal]}`;
    if (eaten === 0) {
      $("statusLine").textContent = `目标 ${target}g 蛋白质，冲鸭！`;
      $("statusPill").textContent = "还没开吃 🍳"; $("statusPill").style.background = "var(--teal)";
    } else if (eaten >= target) {
      $("statusLine").textContent = `已摄入 ${fmt(eaten)}g，超出 ${fmt(eaten - target)}g，别撑着～`;
      $("statusPill").textContent = "达标啦 🎉"; $("statusPill").style.background = "var(--green)";
    } else {
      $("statusLine").textContent = `已摄入 ${fmt(eaten)}g，还差 ${fmt(remain)}g！`;
      $("statusPill").textContent = `完成 ${Math.round(eaten / target * 100)}% 💪`; $("statusPill").style.background = "var(--primary)";
    }
  }
  // 宏量营养素
  const mr = $("macroRow");
  if (state.profile && state.profile.macroOn) {
    mr.classList.add("show");
    let carb = 0, fat = 0;
    dayLog(curDate).forEach(e => {
      carb += (e.c100 || 0) * e.grams / 100;
      fat += (e.f100 || 0) * e.grams / 100;
    });
    $("mCarb").textContent = fmt(carb) + "g";
    $("mFat").textContent = fmt(fat) + "g";
  } else {
    mr.classList.remove("show");
  }
}

function renderMeals() {
  $("mealTabs").innerHTML = MEALS.map(m => {
    const n = dayLog(curDate).filter(e => e.meal === m.id).length;
    return `<button class="meal-tab ${m.id === curMeal ? "active" : ""}" data-meal="${m.id}">
      <span class="me">${m.em}</span>${m.name}<span class="mc"> ${n ? n + "份" : ""}</span></button>`;
  }).join("");
  $("mealTag").textContent = MEALS.find(m => m.id === curMeal).name;
}

function renderCats() {
  $("catRow").innerHTML = CATS.map(c =>
    `<button class="cat-chip ${c.id === curCat ? "active" : ""}" data-cat="${c.id}">${c.name}</button>`
  ).join("") +
  `<button class="cat-chip veg-chip ${vegOnly ? "active" : ""}" data-cat="__veg">🥬 素食</button>`;
}

function renderMult() {
  const opts = [0.5, 1, 1.5, 2, 3];
  $("multRow").innerHTML = `<span class="ml">份数</span>` + opts.map(o =>
    `<button class="mult-chip ${mult === o ? "active" : ""}" data-mult="${o}">×${o}</button>`
  ).join("") + `<span class="ml" style="margin-left:auto">点食物即按此份数记录</span>`;
}

function renderFoods() {
  const grid = $("foodGrid");
  let list = allFoods();
  if (curSearch) {
    list = list.filter(f => f.name.includes(curSearch));
  } else {
    if (vegOnly) list = list.filter(f => f.veg);
    if (curCat !== "all") list = list.filter(f => f.cat === curCat);
  }
  const customs = state.customFoods.length;
  $("btnManageFoods").classList.toggle("show", customs > 0);
  let html = list.map(f =>
    `<button class="food-btn ${String(f.id).startsWith("c_") ? "custom" : ""}" data-food="${f.id}" title="${f.name}">
      ${f.note ? `<span class="note">${f.note}</span>` : ""}
      <span class="em">${f.em}</span>
      <span class="nm">${f.name}</span>
      <span class="pf">${f.g * mult >= 1000 ? (f.g * mult / 1000) + "kg" : Math.round(f.g * mult) + "g"}·<b>${fmt(f.p * f.g * mult / 100)}g</b>蛋白</span>
    </button>`).join("");
  html += `<button class="food-add" data-addcustom="1"><span style="font-size:22px">＋</span>自定义食物</button>`;
  const emptyMsg = curSearch
    ? `没找到"${curSearch}"，点＋自定义添加吧`
    : (vegOnly ? "素食模式下这个分类没有食物，换换分类吧 🥬" : "这个分类还没有食物");
  grid.innerHTML = html || `<div class="empty" style="grid-column:1/-1">${emptyMsg}</div>`;
}

function renderLog() {
  const box = $("logList");
  const log = dayLog(curDate);
  if (!log.length) {
    box.innerHTML = `<div class="empty">这一天还没有记录${curDate === todayStr() ? "，点上面的食物开吃 👆" : ""}</div>`;
    return;
  }
  const sorted = MEALS.slice().sort((a, b) => {
    const order = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
    return order[a.id] - order[b.id];
  });
  box.innerHTML = sorted.map(m => {
    const items = log.filter(e => e.meal === m.id);
    if (!items.length) return "";
    const sub = items.reduce((s, e) => s + e.p100 * e.grams / 100, 0);
    return `<div class="meal-group">
      <div class="gt">${m.em} ${m.name} · ${fmt(sub)}g 蛋白</div>
      <div class="log-list">` +
      items.map(e => {
        const pv = e.p100 * e.grams / 100;
        return `<div class="log-item">
          <span class="em">${e.em}</span>
          <span class="nm">${e.name} × ${e.grams}g<small>蛋白质 ${fmt(pv)}g${state.profile.macroOn ? ` · 碳水 ${fmt((e.c100 || 0) * e.grams / 100)}g · 脂肪 ${fmt((e.f100 || 0) * e.grams / 100)}g` : ""}</small></span>
          <span class="pv">+${fmt(pv)}g</span>
          <button class="ev" data-edit="${e.uid}">✏️</button>
          <button class="del" data-del="${e.uid}">✕</button>
        </div>`;
      }).join("") +
      `</div></div>`;
  }).join("");
}

function renderRec() {
  const box = $("recBox");
  const target = dailyTarget();
  const eaten = consumed(curDate);
  if (!state.profile) {
    box.innerHTML = `<div class="empty">先点右上角 ⚙️ 设置体重和目标～</div>`;
    return;
  }
  if (eaten >= target) {
    box.innerHTML = `<div class="done-card">
      <div class="em">🎉🥳🎊</div>
      <div class="t">${dateLabelStr(curDate)}的蛋白质达标啦！</div>
      <div class="d">共摄入 ${fmt(eaten)}g / 目标 ${target}g<br>记得多喝水，好好休息，肌肉在偷偷生长～</div>
    </div>`;
    return;
  }
  const remain = target - eaten;
  const todayIds = new Set(dayLog(curDate).map(e => e.name));
  const scored = allFoods()
    .map(f => ({ f, need: remain / (f.p / 100) }))
    .filter(x => x.need >= 15)
    .map(x => {
      const serveG = Math.min(Math.max(x.need, x.f.g * 0.5), Math.max(x.f.g * 2, 100));
      const gain = x.f.p * serveG / 100;
      let score = x.f.p;
      if (!todayIds.has(x.f.name)) score *= 1.4;
      if (x.f.cat === "veg" && remain > 20) score *= 0.6;
      if (vegOnly && !x.f.veg) score *= 0.1;
      if (x.f.g <= 60) score *= 1.1;
      return { f: x.f, serveG: Math.round(serveG), gain, score: score * gain / 100 };
    })
    .sort((a, b) => b.score - a.score);
  const picked = [];
  const usedCat = new Set();
  for (const s of scored) {
    if (picked.length >= 3) break;
    if (usedCat.has(s.f.cat) && picked.length < 2) continue;
    picked.push(s);
    usedCat.add(s.f.cat);
  }
  if (!picked.length) {
    box.innerHTML = `<div class="empty">缺口很小啦，喝杯牛奶就够咯 🥛</div>`;
    return;
  }
  box.innerHTML = `<div class="rec-note">还差 <b style="color:var(--pink)">${fmt(remain)}g</b> 蛋白质，推荐这样补 👇</div>
    <div class="rec-list">` +
    picked.map(s =>
      `<div class="rec-item">
        <span class="em">${s.f.em}</span>
        <div class="info">
          <div class="t">${s.f.name} 约 ${s.serveG}g${s.f.note ? "(" + s.f.note + "重)" : ""}</div>
          <div class="d">补充 <b>${fmt(s.gain)}g</b> · 覆盖缺口 ${Math.min(Math.round(s.gain / remain * 100), 100)}%</div>
        </div>
        <button data-addrec="${s.f.id}" data-grams="${s.serveG}">吃它！</button>
      </div>`).join("") +
    `</div>`;
}

function renderTemplates() {
  $("tplList").innerHTML = TEMPLATES.map(t =>
    `<div class="tpl-item">
      <span class="te">${t.em}</span>
      <div class="ti"><div class="t">${t.name}</div><div class="d">${t.desc}</div></div>
      <button data-tpl="${t.id}">加到${MEALS.find(m => m.id === curMeal).name}</button>
    </div>`).join("");
}

function renderStats() {
  const target = dailyTarget();
  let days = 0, hits = 0, total = 0;
  const cols = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = todayStr(d);
    const eaten = (state.logs[k] || []).reduce((s, e) => s + e.p100 * e.grams / 100, 0);
    if (eaten > 0) { days++; total += eaten; if (eaten >= target) hits++; }
    const h = target > 0 ? Math.min(eaten / target, 1) * 100 : 0;
    cols.push(`<div class="col">
      <div class="bar ${target > 0 && eaten >= target ? "hit" : ""}" style="height:${Math.max(h, 3)}%" title="${fmt(eaten)}g"></div>
      <div class="lb">${i === 0 ? "今天" : (d.getMonth() + 1) + "/" + d.getDate()}</div>
    </div>`);
  }
  $("hist").innerHTML = cols.join("");
  $("stRate").textContent = days ? Math.round(hits / days * 100) + "%" : "0%";
  $("stAvg").textContent = fmt(days ? total / 7 : 0) + "g";
  $("stDays").textContent = days;
}

function renderCalendar() {
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  $("calMonth").textContent = y + " 年 " + (m + 1) + " 月";
  const first = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const lead = first.getDay();
  const target = dailyTarget();
  let html = ["日", "一", "二", "三", "四", "五", "六"].map(w => `<div class="wd">${w}</div>`).join("");
  for (let i = 0; i < lead; i++) html += `<div class="cal-cell blank"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = y + "-" + String(m + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
    const eaten = (state.logs[iso] || []).reduce((s, e) => s + e.p100 * e.grams / 100, 0);
    const hasRec = eaten > 0;
    const hit = hasRec && eaten >= target;
    html += `<button class="cal-cell ${iso === curDate ? "sel" : ""} ${iso === todayStr() ? "today" : ""}" data-cal="${iso}">
      <span class="dn">${day}</span>
      ${hasRec ? `<span class="dp ${hit ? "hit" : ""}">${Math.round(eaten)}g${hit ? "✓" : ""}</span>` : ""}
    </button>`;
  }
  $("calGrid").innerHTML = html;
}

function renderAll() {
  renderDateBar();
  renderRing();
  renderMeals();
  renderCats();
  renderMult();
  renderFoods();
  renderLog();
  renderRec();
  renderTemplates();
  renderStats();
  renderCalendar();
}

/* ================= 交互：记录 ================= */
function addEntry(foodId, grams, meal, iso) {
  const f = findFood(foodId);
  if (!f) return;
  dayLog(iso || curDate).push({
    uid: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: f.name, em: f.em, p100: f.p, c100: f.c || 0, f100: f.f || 0,
    grams, meal: meal || curMeal, veg: !!f.veg,
  });
  save();
  renderAll();
}

$("foodGrid").addEventListener("click", (ev) => {
  const add = ev.target.closest("[data-addcustom]");
  if (add) { openFoodForm(null); return; }
  const btn = ev.target.closest("[data-food]");
  if (!btn) return;
  const f = findFood(btn.dataset.food);
  const grams = Math.round(f.g * mult);
  addEntry(f.id, grams);
  toast(`${f.em} ${f.name} ${grams}g 已记入${MEALS.find(m => m.id === curMeal).name} +${fmt(f.p * grams / 100)}g蛋白`);
});
$("recBox").addEventListener("click", (ev) => {
  const btn = ev.target.closest("[data-addrec]");
  if (!btn) return;
  const grams = Number(btn.dataset.grams);
  addEntry(btn.dataset.addrec, grams);
  toast("记录成功，继续加油！💪");
});
$("tplList").addEventListener("click", (ev) => {
  const btn = ev.target.closest("[data-tpl]");
  if (!btn) return;
  const t = TEMPLATES.find(x => x.id === btn.dataset.tpl);
  t.items.forEach(([fid, g]) => addEntry(fid, g));
  toast(`${t.em} 「${t.name}」已加入${MEALS.find(m => m.id === curMeal).name}`);
});
$("logList").addEventListener("click", (ev) => {
  const del = ev.target.closest("[data-del]");
  if (del) {
    const log = dayLog(curDate);
    const idx = log.findIndex(e => e.uid === del.dataset.del);
    if (idx >= 0) {
      toast("已删除 " + log[idx].name + " 🗑️");
      log.splice(idx, 1);
      save();
      renderAll();
    }
    return;
  }
  const ed = ev.target.closest("[data-edit]");
  if (ed) {
    const e = dayLog(curDate).find(x => x.uid === ed.dataset.edit);
    if (e) openEntryEditor(e);
  }
});

/* 餐次 / 筛选 / 搜索 / 份数 */
$("mealTabs").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-meal]");
  if (!b) return;
  curMeal = b.dataset.meal;
  renderMeals();
  renderFoods();
  renderTemplates();
});
$("catRow").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-cat]");
  if (!b) return;
  if (b.dataset.cat === "__veg") {
    vegOnly = !vegOnly;
    curSearch = ""; $("foodSearch").value = "";
    if (vegOnly) curCat = "all";   // 素食模式重置分类，避免交集为空
  } else { curCat = b.dataset.cat; vegOnly = false; }
  renderCats();
  renderFoods();
});
$("foodSearch").addEventListener("input", () => {
  curSearch = $("foodSearch").value.trim();
  renderFoods();
});
$("multRow").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-mult]");
  if (!b) return;
  mult = Number(b.dataset.mult);
  renderMult();
  renderFoods();
});

/* 日期 */
$("btnBackToday").addEventListener("click", () => {
  curDate = todayStr();
  curMeal = guessMeal();
  renderAll();
  toast("回到今天 🏠");
});
$("calGrid").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-cal]");
  if (!b) return;
  curDate = b.dataset.cal;
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("calPrev").addEventListener("click", () => { calMonth.setMonth(calMonth.getMonth() - 1); renderCalendar(); });
$("calNext").addEventListener("click", () => { calMonth.setMonth(calMonth.getMonth() + 1); renderCalendar(); });

/* ================= 设置弹窗 ================= */
function syncWeightInputs(v) {
  v = Math.round(v * 2) / 2;
  $("weightRange").value = v;
  $("weightNum").value = v;
  echoFormula();
}
function echoFormula() {
  const w = Number($("weightRange").value) || 60;
  const c = Number($("coefInput").value);
  const eff = (c >= 0.8 && c <= 3) ? c : coef();
  $("formulaHint").innerHTML =
    `每日目标 = <b>${w}kg</b> × <b>${eff}</b> ＝ <b style="color:var(--primary-dark)">${Math.round(w * eff)}g</b> 蛋白质`;
}
$("btnProfile").addEventListener("click", () => {
  const p = state.profile || { weight: 60, goal: "gain", coef: null, macroOn: false };
  syncWeightInputs(p.weight);
  document.querySelectorAll(".goal-btn").forEach(b => b.classList.toggle("active", b.dataset.goal === p.goal));
  $("coefInput").value = p.coef || "";
  $("macroToggle").checked = !!p.macroOn;
  renderWeightLogInfo();
  openModal("mProfile");
});
$("weightRange").addEventListener("input", () => { $("weightNum").value = $("weightRange").value; echoFormula(); });
$("weightNum").addEventListener("input", () => {
  const v = Number($("weightNum").value);
  if (v >= 30 && v <= 150) { $("weightRange").value = v; echoFormula(); }
});
$("coefInput").addEventListener("input", echoFormula);
$("goalRow").addEventListener("click", (ev) => {
  const b = ev.target.closest(".goal-btn");
  if (!b) return;
  document.querySelectorAll(".goal-btn").forEach(x => x.classList.toggle("active", x === b));
  $("coefInput").value = "";
  echoFormula();
});
$("btnSaveProfile").addEventListener("click", () => {
  const weight = Math.round(Number($("weightRange").value) * 2) / 2;
  if (!(weight >= 30 && weight <= 150)) { toast("体重数值不合法哦（30~150）"); return; }
  const activeGoal = document.querySelector(".goal-btn.active");
  const c = Number($("coefInput").value);
  state.profile = {
    weight,
    goal: activeGoal ? activeGoal.dataset.goal : "gain",
    coef: (c >= 0.8 && c <= 3) ? c : null,
    macroOn: $("macroToggle").checked,
  };
  if (!state.weights[todayStr()]) state.weights[todayStr()] = weight;
  save();
  closeModal("mProfile");
  renderAll();
  toast(`目标已更新：每天 ${dailyTarget()}g 蛋白质 💪`);
});

/* 体重日志 */
function renderWeightLogInfo() {
  const keys = Object.keys(state.weights).sort();
  if (!keys.length) { $("weightLogInfo").textContent = "还没有体重记录"; return; }
  const last = keys[keys.length - 1];
  $("weightLogInfo").textContent = `最近一次：${dateLabelStr(last)} ${state.weights[last]}kg · 共 ${keys.length} 天记录`;
}
$("btnLogWeight").addEventListener("click", () => {
  const v = Number($("weightLogInput").value);
  if (!(v >= 30 && v <= 150)) { toast("请输入 30~150 之间的体重"); return; }
  state.weights[todayStr()] = v;
  state.profile = state.profile || { weight: v, goal: "gain", coef: null, macroOn: false };
  state.profile.weight = v;
  save();
  $("weightLogInput").value = "";
  renderWeightLogInfo();
  syncWeightInputs(v);
  renderAll();
  toast(`已记录今天体重 ${v}kg，目标更新为 ${dailyTarget()}g ⚖️`);
});

/* 导入导出 */
$("btnExport").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "蛋白质小助手备份_" + todayStr() + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("备份已导出 💾");
});
$("btnImport").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const s = JSON.parse(reader.result);
      if (!s || s.v !== 2 || typeof s.logs !== "object") throw new Error("bad");
      if (!confirm("导入将覆盖当前所有数据，确定继续吗？")) return;
      state = s;
      save();
      closeModal("mProfile");
      curDate = todayStr();
      renderAll();
      toast("备份导入成功！📦");
    } catch (e) {
      toast("导入失败：文件格式不对 😥");
    }
  };
  reader.readAsText(file);
  ev.target.value = "";
});
$("btnClear").addEventListener("click", () => {
  if (confirm("确定清空全部数据（设置、记录、自定义食物）吗？此操作不可恢复！") && confirm("真的确定吗？建议先导出备份 🥺")) {
    state = { v: 2, profile: null, customFoods: [], logs: {}, weights: {} };
    save();
    closeModal("mProfile");
    curDate = todayStr();
    renderAll();
    toast("已全部清空");
  }
});

/* ================= 自定义食物 ================= */
let cfEm = "🍔";
function openFoodForm(foodId) {
  editFoodId = foodId;
  $("mFoodTitle").textContent = foodId ? "✏️ 编辑自定义食物" : "🍳 添加自定义食物";
  const f = foodId ? state.customFoods.find(x => x.id === foodId) : null;
  $("cfName").value = f ? f.name : "";
  $("cfProtein").value = f ? f.p : "";
  $("cfPortion").value = f ? f.g : "";
  $("cfCarb").value = f && f.c ? f.c : "";
  $("cfFat").value = f && f.f ? f.f : "";
  $("cfCat").value = f ? f.cat : "meat";
  $("cfVeg").checked = f ? !!f.veg : false;
  $("cfNote").value = f ? (f.note || "") : "";
  cfEm = f ? f.em : EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  renderEmPick();
  closeModal("mManage");
  openModal("mFood");
}
function renderEmPick() {
  $("cfEmPick").innerHTML = EMOJIS.map(e =>
    `<button class="${e === cfEm ? "active" : ""}" data-em="${e}">${e}</button>`).join("");
}
$("cfEmPick").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-em]");
  if (!b) return;
  cfEm = b.dataset.em;
  renderEmPick();
});
$("btnFoodCancel").addEventListener("click", () => { closeModal("mFood"); if (state.customFoods.length) openModal("mManage"); });
$("btnFoodSave").addEventListener("click", () => {
  const name = $("cfName").value.trim();
  const p = Number($("cfProtein").value);
  const g = Number($("cfPortion").value);
  if (!name) { toast("给食物起个名字吧"); return; }
  if (!(p > 0 && p <= 100)) { toast("蛋白质含量要填 0~100 之间"); return; }
  if (!(g >= 5 && g <= 1000)) { toast("一份的克数要填 5~1000 之间"); return; }
  const c = Number($("cfCarb").value) || 0;
  const f = Number($("cfFat").value) || 0;
  if (editFoodId) {
    const item = state.customFoods.find(x => x.id === editFoodId);
    Object.assign(item, { name, em: cfEm, p, g, c, f, cat: $("cfCat").value, veg: $("cfVeg").checked, note: $("cfNote").value });
    toast("已更新自定义食物 ✏️");
  } else {
    state.customFoods.push({
      id: "c_" + Date.now().toString(36),
      name, em: cfEm, p, g, c, f,
      cat: $("cfCat").value, veg: $("cfVeg").checked, note: $("cfNote").value,
    });
    toast(`${cfEm} 「${name}」已加入食物库！`);
  }
  save();
  closeModal("mFood");
  renderAll();
});
$("btnManageFoods").addEventListener("click", () => { renderManage(); openModal("mManage"); });
$("btnManageAdd").addEventListener("click", () => openFoodForm(null));
$("btnManageClose").addEventListener("click", () => closeModal("mManage"));
function renderManage() {
  const box = $("manageList");
  if (!state.customFoods.length) {
    box.innerHTML = `<div class="empty">还没有自定义食物</div>`;
    return;
  }
  box.innerHTML = state.customFoods.map(f =>
    `<div class="custom-food-item">
      <span style="font-size:20px">${f.em}</span>
      <span class="nm">${f.name}<small>${f.p}g蛋白/100g · 一份${f.g}g${f.note ? " · " + f.note + "重" : ""}${f.veg ? " · 🥬素食" : ""}</small></span>
      <button class="ev" style="border:none;cursor:pointer;width:27px;height:27px;border-radius:9px;background:#EDE9FF;color:var(--purple);font-weight:800" data-cfedit="${f.id}">✏️</button>
      <button class="del" style="border:none;cursor:pointer;width:27px;height:27px;border-radius:9px;background:#FFE3E3;color:var(--pink);font-weight:800" data-cfdel="${f.id}">✕</button>
    </div>`).join("");
}
$("manageList").addEventListener("click", (ev) => {
  const ed = ev.target.closest("[data-cfedit]");
  if (ed) { openFoodForm(ed.dataset.cfedit); return; }
  const del = ev.target.closest("[data-cfdel]");
  if (del && confirm("删除这个自定义食物？已有记录不受影响。")) {
    state.customFoods = state.customFoods.filter(x => x.id !== del.dataset.cfdel);
    save();
    renderManage();
    renderAll();
    toast("已删除");
  }
});

/* ================= 编辑记录弹窗 ================= */
let entryMeal = "lunch";
function openEntryEditor(e) {
  editUid = e.uid;
  entryMeal = e.meal;
  $("entryEm").textContent = e.em + " " + e.name;
  $("entryGrams").value = e.grams;
  $("entryMealPick").innerHTML = MEALS.map(m =>
    `<button class="${m.id === entryMeal ? "active" : ""}" data-emmeal="${m.id}">${m.em} ${m.name}</button>`).join("");
  echoEntry();
  openModal("mEntry");
}
function echoEntry() {
  const e = dayLog(curDate).find(x => x.uid === editUid);
  if (!e) return;
  const g = Number($("entryGrams").value) || 0;
  $("entryProteinEcho").innerHTML = `≈ 蛋白质 <b style="color:var(--teal)">${fmt(e.p100 * g / 100)}g</b>${e.c100 || e.f100 ? ` · 碳水 ${fmt((e.c100 || 0) * g / 100)}g · 脂肪 ${fmt((e.f100 || 0) * g / 100)}g` : ""}`;
}
$("entryMinus").addEventListener("click", () => { $("entryGrams").value = Math.max(1, Number($("entryGrams").value) - 10); echoEntry(); });
$("entryPlus").addEventListener("click", () => { $("entryGrams").value = Number($("entryGrams").value) + 10; echoEntry(); });
$("entryGrams").addEventListener("input", echoEntry);
$("entryMealPick").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-emmeal]");
  if (!b) return;
  entryMeal = b.dataset.emmeal;
  $("entryMealPick").querySelectorAll("button").forEach(x => x.classList.toggle("active", x === b));
});
$("btnEntrySave").addEventListener("click", () => {
  const e = dayLog(curDate).find(x => x.uid === editUid);
  if (e) {
    const g = Number($("entryGrams").value);
    if (!(g >= 1 && g <= 2000)) { toast("克数要填 1~2000 之间"); return; }
    e.grams = g;
    e.meal = entryMeal;
    save();
    renderAll();
    toast("记录已更新 ✏️");
  }
  closeModal("mEntry");
});
$("btnEntryDelete").addEventListener("click", () => {
  const log = dayLog(curDate);
  const idx = log.findIndex(x => x.uid === editUid);
  if (idx >= 0) {
    log.splice(idx, 1);
    save();
    renderAll();
    toast("已删除记录 🗑️");
  }
  closeModal("mEntry");
});

/* ================= 说明弹窗 ================= */
$("btnHelp").addEventListener("click", () => openModal("mHelp"));
$("btnHelpClose").addEventListener("click", () => closeModal("mHelp"));

/* 点击遮罩关闭 */
document.querySelectorAll(".modal-mask").forEach(m => {
  m.addEventListener("click", (ev) => { if (ev.target === m) m.classList.remove("show"); });
});

/* ================= PWA ================= */
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "127.0.0.1" || location.hostname === "localhost")) {
  navigator.serviceWorker.register("sw.js").catch((err) => console.warn("SW 注册失败(不影响使用):", err));
}

/* ================= 启动 ================= */
if (!state.profile) {
  // 首次使用：先给个默认体重，打开设置
  state.profile = { weight: 60, goal: "gain", coef: null, macroOn: false };
  save();
  syncWeightInputs(60);
  document.querySelector('.goal-btn[data-goal="gain"]').classList.add("active");
  echoFormula();
  renderAll();
  openModal("mProfile");
} else {
  syncWeightInputs(state.profile.weight);
  echoFormula();
  renderAll();
}

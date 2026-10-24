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
// 分餐次目标占比（早30% 午30% 晚30% 加餐10%，按主流“三餐均匀分配+小加餐”共识校准）
const MEAL_SPLIT = { breakfast: 0.30, lunch: 0.30, dinner: 0.30, snack: 0.10 };
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
  { id:"chicken",  name:"鸡胸肉",   em:"🍗", cat:"meat", p:23,  c:0,   f:3.6, g:100, note:"生", veg:false }, // 生鸡胸约22.5g/100g（USDA），熟后约31g
  { id:"thigh",    name:"去皮鸡腿", em:"🍖", cat:"meat", p:19,  c:0,   f:8,   g:120, note:"生", veg:false },
  { id:"beef",     name:"瘦牛肉",   em:"🥩", cat:"meat", p:20,  c:1.2, f:6.5, g:100, note:"生", veg:false },
  { id:"pork",     name:"猪里脊",   em:"🐖", cat:"meat", p:20,  c:0.7, f:7.9, g:100, note:"生", veg:false },
  { id:"duck",     name:"鸭腿去皮", em:"🦆", cat:"meat", p:19,  c:0,   f:10,  g:120, note:"生", veg:false },
  { id:"lamb",     name:"瘦羊肉",   em:"🐏", cat:"meat", p:17,  c:0,   f:7,   g:100, note:"生", veg:false },
  { id:"burger",   name:"汉堡包",   em:"🍔", cat:"meat", p:12,  c:28,  f:12,  g:200, note:"熟", veg:false },
  { id:"fish",     name:"三文鱼",   em:"🐟", cat:"sea",  p:20,  c:0,   f:13,  g:100, note:"生", veg:false },
  { id:"cod",      name:"鳕鱼",     em:"🐠", cat:"sea",  p:18,  c:0,   f:1,   g:120, note:"生", veg:false },
  { id:"shrimp",   name:"虾仁",     em:"🦐", cat:"sea",  p:17,  c:0.5, f:1,   g:100, note:"生", veg:false },
  { id:"tuna",     name:"金枪鱼",   em:"🐋", cat:"sea",  p:24,  c:0,   f:4,   g:100, note:"",  veg:false },
  { id:"squid",    name:"鱿鱼",     em:"🦑", cat:"sea",  p:15,  c:3,   f:1,   g:100, note:"生", veg:false },
  { id:"egg",      name:"鸡蛋1个",  em:"🥚", cat:"egg",  p:13,  c:1.5, f:9,   g:50,  note:"",  veg:true  },
  { id:"milk",     name:"牛奶",     em:"🥛", cat:"egg",  p:3,   c:5,   f:3.6, g:250, note:"",  veg:true  },
  { id:"yogurt",   name:"酸奶",     em:"🍶", cat:"egg",  p:3.1, c:12,  f:3.3, g:200, note:"",  veg:true  },
  { id:"gyogurt",  name:"希腊酸奶", em:"🥣", cat:"egg",  p:9,   c:4,   f:5,   g:100, note:"",  veg:true  },
  { id:"cheese",   name:"奶酪片",   em:"🧀", cat:"egg",  p:20,  c:3,   f:25,  g:25,  note:"",  veg:true  },
  { id:"whey",     name:"蛋白粉1勺",em:"💪", cat:"sup",  p:80,  c:5,   f:3,   g:30,  note:"",  veg:true  },
  { id:"bar",      name:"蛋白棒",   em:"🍫", cat:"sup",  p:33,  c:30,  f:9,   g:60,  note:"",  veg:true  },
  { id:"tofu",     name:"豆腐",     em:"🧊", cat:"bean", p:8,   c:2,   f:4.5, g:100, note:"",  veg:true  },
  { id:"dried",    name:"豆干",     em:"🟫", cat:"bean", p:16,  c:5,   f:8,   g:50,  note:"",  veg:true  },
  { id:"soymilk",  name:"豆浆",     em:"🫘", cat:"bean", p:3,   c:1.2, f:1.6, g:250, note:"",  veg:true  },
  { id:"edamame",  name:"毛豆",     em:"🌱", cat:"bean", p:13,  c:10,  f:5,   g:80,  note:"",  veg:true  },
  { id:"chickpea", name:"鹰嘴豆",   em:"🟤", cat:"bean", p:9,   c:45,  f:4,   g:60,  note:"熟", veg:true  }, // 熟鹰嘴豆约9g/100g（干豆约19g）
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
  { id:"t1", em:"🌅", name:"增肌早餐",  desc:"鸡蛋+牛奶+燕麦 ≈ 26g蛋白", items:[["egg",100],["milk",250],["oat",40]] },
  { id:"t2", em:"💪", name:"练后加餐",  desc:"蛋白粉+香蕉 ≈ 25g蛋白",   items:[["whey",30],["banana",100]] },
  { id:"t3", em:"🥩", name:"高蛋白正餐",desc:"鸡胸+米饭+西兰花 ≈ 43g蛋白", items:[["chicken",150],["rice",150],["brocoli",150]] },
  { id:"t4", em:"🥬", name:"素食轻食",  desc:"豆腐+毛豆+玉米 ≈ 22g蛋白", items:[["tofu",100],["edamame",80],["corn",100]] },
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
// 单条记录实际蛋白质克数：优先取手动覆盖值（pOverride），否则按 p100×克数计算
function proteinOf(e) {
  return (e.pOverride !== undefined && e.pOverride !== null) ? e.pOverride : e.p100 * e.grams / 100;
}
function consumed(iso) {
  return dayLog(iso).reduce((s, e) => s + proteinOf(e), 0);
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

// v2.5 动效状态：仅当数值真的变化时才弹跳/放光环
let ringLastDone = false, ringLastNum = null, ringLastPill = null;

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
  // v2.5 动效：达标光环（从未达标→达标时放一次）/ 数字与状态弹跳（值变化时）
  const wrap = $("ringBar").closest(".ring-wrap");
  if (pct >= 1) {
    wrap.classList.add("done");
    if (!ringLastDone) {
      wrap.classList.remove("halo-once"); void wrap.offsetWidth; wrap.classList.add("halo-once");
      ringLastDone = true;
    }
  } else {
    wrap.classList.remove("done"); ringLastDone = false;
  }
  const num = $("ringNum");
  if (ringLastNum !== Math.round(eaten)) {
    num.classList.remove("num-bounce"); void num.offsetWidth; num.classList.add("num-bounce");
    ringLastNum = Math.round(eaten);
  }
  const pill = $("statusPill");
  if (ringLastPill !== pill.textContent) {
    pill.classList.remove("pill-pop"); void pill.offsetWidth; pill.classList.add("pill-pop");
    ringLastPill = pill.textContent;
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
    const sub = items.reduce((s, e) => s + proteinOf(e), 0);
    return `<div class="meal-group" data-mg="${m.id}">
      <div class="gt">${m.em} ${m.name} · ${fmt(sub)}g 蛋白 <button class="mg-note-btn" data-mnote="${m.id}" title="餐次备注">💬</button></div>
      <div class="mg-note" id="mgn-${m.id}"></div>
      <div class="log-list">` +
      items.map(e => {
        const pv = proteinOf(e);
        return `<div class="log-item" data-uid="${e.uid}">
          <span class="em">${e.em}</span>
          <span class="nm">
            <span class="editable ed-name" contenteditable="true" spellcheck="false" title="点击修改名称">${e.name}</span>
            <span class="ed-x"> × </span>
            <span class="editable ed-grams" contenteditable="true" spellcheck="false" title="点击修改克数">${e.grams}</span>g
            <small>蛋白质 ${fmt(pv)}g${state.profile.macroOn ? ` · 碳水 ${fmt((e.c100 || 0) * e.grams / 100)}g · 脂肪 ${fmt((e.f100 || 0) * e.grams / 100)}g` : ""}</small>
          </span>
          <span class="pv">+<span class="editable ed-pv" contenteditable="true" spellcheck="false" title="点击修改蛋白质">${fmt(pv)}</span>g</span>
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
  const dayEntries = dayLog(curDate);
  // 统计今天每种食物/每个类别吃过几次，用于动态降权换花样
  const eatenCount = {};
  dayEntries.forEach(e => { eatenCount[e.name] = (eatenCount[e.name] || 0) + 1; });
  const eatenCatCount = {};
  dayEntries.forEach(e => {
    const f = allFoods().find(x => x.name === e.name);
    if (f) eatenCatCount[f.cat] = (eatenCatCount[f.cat] || 0) + 1;
  });
  // 用“日期+已记录条数”做种子轮换：不同天数/不同时段刷新都会换组合
  let seed = 0;
  const seedStr = curDate + "#" + dayEntries.length;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 131 + seedStr.charCodeAt(i)) % 100000;
  const scored = allFoods()
    .map(f => ({ f, need: remain / (f.p / 100) }))
    .filter(x => x.need >= 15)
    .map(x => {
      const serveG = Math.min(Math.max(x.need, x.f.g * 0.5), Math.max(x.f.g * 2, 100));
      const gain = x.f.p * serveG / 100;
      let score = x.f.p;
      const times = eatenCount[x.f.name] || 0;
      if (times === 0) score *= 1.5;                       // 今天没吃过的优先
      else score *= Math.max(0.15, 0.5 / times);           // 吃过的强烈降权，避免总推老三样
      const catTimes = eatenCatCount[x.f.cat] || 0;
      if (catTimes >= 2) score *= 0.5;                     // 同类别吃多了换口味
      if (x.f.cat === "veg" && remain > 20) score *= 0.6;
      if (vegOnly && !x.f.veg) score *= 0.1;
      if (x.f.g <= 60) score *= 1.1;
      let h2 = 0;
      for (const ch of x.f.id) h2 = (h2 * 31 + ch.charCodeAt(0)) % 997;
      const rot = ((seed + h2 * 37) % 100) / 100;          // 0~1 轮换因子
      return { f: x.f, serveG: Math.round(serveG), gain, score: score * gain / 100 * (0.75 + rot * 0.5) };
    })
    .sort((a, b) => b.score - a.score);
  // 前 6 名候选按种子轮换起点，再挑 3 个不同类别
  const pool = scored.slice(0, 6);
  const start = pool.length ? seed % pool.length : 0;
  const ordered = pool.slice(start).concat(pool.slice(0, start));
  const picked = [];
  const usedCat = new Set();
  for (const s of ordered) {
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
    const eaten = (state.logs[k] || []).reduce((s, e) => s + proteinOf(e), 0);
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
    const eaten = (state.logs[iso] || []).reduce((s, e) => s + proteinOf(e), 0);
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
  renderMealProgress();
  renderWater();
  renderWaterCard();
  renderMeals();
  renderCats();
  renderMult();
  renderFoods();
  renderLog();
  renderNotes();
  renderRec();
  renderTemplates();
  renderStats();
  renderStreak();
  renderCalendar();
}

/* ================= 交互：记录 ================= */
function addEntry(foodId, grams, meal, iso) {
  const f = findFood(foodId);
  if (!f) return;
  const e = {
    uid: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: f.name, em: f.em, p100: f.p, c100: f.c || 0, f100: f.f || 0,
    grams, meal: meal || curMeal, veg: !!f.veg,
  };
  dayLog(iso || curDate).push(e);
  save();
  renderAll();
  // v2.5：新记录高亮浮现（渲染后精确定位这条，闪烁一次）
  const node = document.querySelector(`#logList .log-item[data-uid="${e.uid}"]`);
  if (node) node.classList.add("fresh");
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
    const item = del.closest(".log-item");
    const doRemove = () => {
      const log = dayLog(curDate);
      const idx = log.findIndex(e => e.uid === del.dataset.del);
      if (idx >= 0) {
        toast("已删除 " + log[idx].name + " 🗑️");
        log.splice(idx, 1);
        save();
        renderAll();
      }
    };
    // v2.5：先播淡出滑走动画，再真正删除
    if (item && !item.classList.contains("leaving")) {
      item.classList.add("leaving");
      setTimeout(doRemove, 240);
    } else {
      doRemove();
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
  $("waterGoalInput").value = waterGoal();
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
  // v2.2 喝水目标随设置保存
  const wg = Number($("waterGoalInput").value);
  if (wg >= 500 && wg <= 5000) waterGoal(wg);
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
    if (g !== e.grams) { e.grams = g; delete e.pOverride; } // 克数变了，蛋白按新克数重新计算
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

/* ============================================================
 * v2.1 新增功能（增量，不动上方原有逻辑）
 * ============================================================ */

/* ---------- 5. 分餐次进度 ---------- */
function renderMealProgress() {
  const target = dailyTarget();
  MEALS.forEach(m => {
    const sub = dayLog(curDate).filter(e => e.meal === m.id)
      .reduce((s, e) => s + proteinOf(e), 0);
    const goal = Math.round(target * MEAL_SPLIT[m.id]);
    $("mpv-" + m.id).textContent = Math.round(sub) + "/" + goal + "g";
    const fill = $("mpf-" + m.id);
    const pct = goal > 0 ? Math.min(sub / goal, 1) * 100 : 0;
    fill.style.width = pct + "%";
    fill.classList.toggle("hit", goal > 0 && sub >= goal);
  });
}

/* ---------- 6. 饮水建议 ---------- */
function renderWater() {
  const el = $("waterLine");
  if (!state.profile) { el.classList.remove("show"); return; }
  const p = consumed(curDate);
  // v2.7：基础 30ml/kg + 每克蛋白质额外约10ml（每50g蛋白约+500ml，高蛋白饮食补水共识）
  const ml = Math.round((state.profile.weight * 30 + p * 10) / 100) * 100;
  el.innerHTML = `💧 高蛋白饮食记得多喝水～今日已摄入 <b>${Math.round(p)}g</b> 蛋白，建议饮水约 <b>${(ml / 1000).toFixed(1)}L</b>（按体重 30ml/kg + 每克蛋白约 10ml 估算）`;
  el.classList.add("show");
}

/* ---------- 1. 复制昨日记录 ---------- */
$("btnCopyYesterday").addEventListener("click", () => {
  const d = new Date(curDate + "T12:00:00");
  d.setDate(d.getDate() - 1);
  const yKey = todayStr(d);
  const src = (state.logs[yKey] || []).slice();
  if (!src.length) { toast("昨天没有记录可复制哦 😅"); return; }
  if (!confirm(`把昨天（${dateLabelStr(yKey)}）的 ${src.length} 条记录复制到${dateLabelStr(curDate)}？`)) return;
  src.forEach(e => dayLog(curDate).push({ ...e, uid: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }));
  save();
  renderAll();
  toast(`已复制昨日 ${src.length} 条记录 📋`);
});

/* ---------- 4. 备注（单日 + 单餐次） ---------- */
function getNotes(iso) {
  if (!state.notes) state.notes = {};
  if (!state.notes[iso]) state.notes[iso] = {};
  return state.notes[iso];
}
let noteCtx = null; // { date, key }  key: "_day" 或餐次 id
function openNote(date, key, title) {
  noteCtx = { date, key };
  $("noteTitle").textContent = title;
  $("noteText").value = getNotes(date)[key] || "";
  openModal("mNote");
}
function renderNotes() {
  const notes = (state.notes && state.notes[curDate]) || {};
  const dayBox = $("dayNoteBox");
  dayBox.textContent = notes._day || "";
  dayBox.classList.toggle("show", !!notes._day);
  MEALS.forEach(m => {
    const box = $("mgn-" + m.id);
    if (!box) return;
    box.textContent = notes[m.id] || "";
    box.classList.toggle("show", !!notes[m.id]);
  });
}
$("btnDayNote").addEventListener("click", () => openNote(curDate, "_day", "💬 " + dateLabelStr(curDate) + "的备注"));
$("logList").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-mnote]");
  if (!b) return;
  const m = MEALS.find(x => x.id === b.dataset.mnote);
  openNote(curDate, m.id, "💬 " + m.em + " " + m.name + "备注");
});
$("btnNoteSave").addEventListener("click", () => {
  if (!noteCtx) return;
  const txt = $("noteText").value.trim();
  if (txt) getNotes(noteCtx.date)[noteCtx.key] = txt;
  else delete getNotes(noteCtx.date)[noteCtx.key];
  save();
  closeModal("mNote");
  renderNotes();
  toast(txt ? "备注已保存 💬" : "备注已清空");
});
$("btnNoteClear").addEventListener("click", () => {
  if (!noteCtx) return;
  delete getNotes(noteCtx.date)[noteCtx.key];
  save();
  closeModal("mNote");
  renderNotes();
  toast("备注已清空");
});

/* ---------- 3. 连续达标天数 ---------- */
function calcStreak() {
  const target = dailyTarget();
  if (!target) return 0;
  let streak = 0;
  const d = new Date();
  // 今天还没达标不打断连击（进行中），从昨天往前数
  if (consumed(todayStr(d)) < target) d.setDate(d.getDate() - 1);
  for (let i = 0; i  < 3650; i++) {
    const iso = todayStr(d);
    const eaten = (state.logs[iso] || []).reduce((s, e) => s + proteinOf(e), 0);
    if (eaten >= target) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}
function renderStreak() {
  $("stStreak").textContent = calcStreak();
}

/* ---------- 7. 主题系统 ---------- */
const THEME_KEY = "proteinBuddyTheme";
const THEMES = [
  { id: "default",   name: "🍦 原味奶油", bg1: "#FFF6E5", bg2: "#E3F6FF", p: "#FF9F43", wallpaper: "", characterImg: "" },
  { id: "kitty",     name: "🎀 奶白小猫",     bg1: "#FFEDF4", bg2: "#FFF7FA", p: "#FF6B9D", wallpaper: "assets/theme-wallpaper/kitty.png", characterImg: "assets/character/kitty.png" },
  { id: "kuromi",    name: "🖤 浅紫小兔",     bg1: "#F1ECFF", bg2: "#FDEFF9", p: "#8A5CF6", wallpaper: "assets/theme-wallpaper/kuromi.png", characterImg: "assets/character/kuromi.png" },
  { id: "cinnamon",  name: "☁️ 白色垂耳小狗", bg1: "#EAF6FF", bg2: "#F8FCFF", p: "#5FB4FF", wallpaper: "assets/theme-wallpaper/cinnamoroll.png", characterImg: "assets/character/cinnamoroll.png" },
  { id: "melody",    name: "🐰 粉色小兔",     bg1: "#FFF0F5", bg2: "#FFFAEF", p: "#FF8FB5", wallpaper: "assets/theme-wallpaper/melody.png", characterImg: "assets/character/melody.png" },
  { id: "pochacco",  name: "🐶 奶油小狗",     bg1: "#FFFDF2", bg2: "#EFF8FF", p: "#FFC94D", wallpaper: "assets/theme-wallpaper/pachacco.png", characterImg: "assets/character/pachacco.png" },
  { id: "pudding",   name: "🍮 奶黄小狗",     bg1: "#FFF6DC", bg2: "#FFFBEF", p: "#E8A33D", wallpaper: "assets/theme-wallpaper/pompompurin.png", characterImg: "assets/character/pompompurin.png" },
  { id: "keroppi",   name: "🐸 绿色青蛙",     bg1: "#EAFBF0", bg2: "#F4FFF8", p: "#3FC46F", wallpaper: "assets/theme-wallpaper/keroppi.png", characterImg: "assets/character/keroppi.png" },
  { id: "hangyodon", name: "🐟 浅蓝海豹",     bg1: "#E9F4FF", bg2: "#FFF1EC", p: "#4FA3E0", wallpaper: "assets/theme-wallpaper/hangyodon.png", characterImg: "assets/character/hangyodon.png" },
];
function darken(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function applyThemeColors(bg1, bg2, primary) {
  const root = document.documentElement.style;
  root.setProperty("--bg1", bg1);
  root.setProperty("--bg2", bg2);
  root.setProperty("--primary", primary);
  root.setProperty("--primary-dark", darken(primary, 0.82));
}
/* v2.2：切换壁纸与角色装饰 */
/* v2.6：壁纸预加载后平滑淡入；加载失败自动退回主题渐变背景，避免"背景空白" */
function applyThemeAssets(t) {
  const body = document.body;
  if (t.wallpaper) {
    body.classList.add("has-wallpaper");
    body.style.setProperty("--wall", `url("${t.wallpaper}")`);
    // 壁纸未加载完成前保持主题渐变；加载完成后才淡入
    body.classList.remove("wall-ready");
    const img = new Image();
    img.onload = () => {
      // 仅当仍是当前主题的壁纸时才淡入（快速切换时不串图）
      if (body.style.getPropertyValue("--wall").includes(t.wallpaper)) body.classList.add("wall-ready");
    };
    img.onerror = () => {
      // 加载失败：退回渐变背景，不显示空白/破图
      body.classList.remove("has-wallpaper");
      body.style.removeProperty("--wall");
    };
    img.src = t.wallpaper;
  } else {
    body.classList.remove("has-wallpaper");
    body.style.removeProperty("--wall");
  }
  const ch = $("themeCharacter");
  if (t.characterImg) {
    ch.src = t.characterImg;
    body.classList.remove("no-character");
    // 角色图加载失败则隐藏，避免破图
    ch.onerror = () => body.classList.add("no-character");
  } else {
    ch.src = "";
    body.classList.add("no-character");
    ch.onerror = null;
  }
  // 喝水空状态的角色也跟随主题
  renderWaterCard();
}
function themeById(id) { return THEMES.find(x => x.id === id); }
function applySavedTheme() {
  let t = null;
  try { t = JSON.parse(localStorage.getItem(THEME_KEY)); } catch (e) {}
  if (!t) return;
  if (t.id === "custom" && t.colors) {
    applyThemeColors(t.colors.bg1, t.colors.bg2, t.colors.p);
    document.body.classList.remove("has-wallpaper");
    document.body.classList.remove("no-character");
    const ch = $("themeCharacter");
    if (ch) {
      ch.src = t.characterImg || "";
      ch.onerror = () => document.body.classList.add("no-character");
    }
  } else {
    const preset = themeById(t.id);
    if (preset && preset.id !== "default") {
      applyThemeColors(preset.bg1, preset.bg2, preset.p);
      applyThemeAssets(preset);
    }
  }
}
function renderThemeGrid() {
  $("themeGrid").innerHTML = THEMES.map(t =>
    `<button class="theme-cell ${t.id === curThemeId ? "active" : ""}" data-theme="${t.id}">
      <span class="sw"><i style="background:${t.bg1}"></i><i style="background:${t.bg2}"></i><i style="background:${t.p}"></i></span>
      ${t.name}
    </button>`).join("");
}
let curThemeId = "default";
$("btnTheme").addEventListener("click", () => { renderThemeGrid(); openModal("mTheme"); });
$("btnThemeClose").addEventListener("click", () => closeModal("mTheme"));
$("themeGrid").addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-theme]");
  if (!b) return;
  const t = themeById(b.dataset.theme);
  if (!t) return;
  curThemeId = t.id;
  if (t.id === "default") {
    const root = document.documentElement.style;
    root.removeProperty("--bg1");
    root.removeProperty("--bg2");
    root.removeProperty("--primary");
    root.removeProperty("--primary-dark");
    applyThemeAssets(t);
    localStorage.removeItem(THEME_KEY);
  } else {
    applyThemeColors(t.bg1, t.bg2, t.p);
    applyThemeAssets(t);
    localStorage.setItem(THEME_KEY, JSON.stringify({ id: t.id }));
  }
  renderThemeGrid();
  toast(t.name + " 主题已换装 " + t.name.split(" ")[0]);
});
$("btnCusThemeApply").addEventListener("click", () => {
  const bg1 = $("cusBg1").value, bg2 = $("cusBg2").value, p = $("cusPrimary").value;
  curThemeId = "custom";
  applyThemeColors(bg1, bg2, p);
  document.body.classList.remove("has-wallpaper");
  localStorage.setItem(THEME_KEY, JSON.stringify({ id: "custom", colors: { bg1, bg2, p } }));
  renderThemeGrid();
  toast("自定义主题已应用 🎨");
});

/* 启动时恢复主题 */
(function () {
  let t = null;
  try { t = JSON.parse(localStorage.getItem(THEME_KEY)); } catch (e) {}
  if (t) curThemeId = t.id || "default";
  applySavedTheme();
})();

/* ============================================================
 * v2.2 新增：喝水记录模块（独立，不影响原有逻辑）
 * ============================================================ */
function waterGoal(newVal) {
  if (!state.water) state.water = { goal: 1500, logs: {} };
  if (!state.water.goal) state.water.goal = 1500;
  if (newVal !== undefined) state.water.goal = newVal;
  return state.water.goal;
}
function waterToday() {
  if (!state.water) waterGoal();
  // 喝水与饮食共用“当前查看日期”：切到昨天补记，不会混进今天
  if (!state.water.logs) state.water.logs = {};
  return state.water.logs[curDate] || 0;
}
function addWater(ml) {
  waterGoal();
  const k = curDate;
  state.water.logs[k] = Math.max(0, (state.water.logs[k] || 0) + ml);
  save();
  renderWaterCard();
}
function renderWaterCard() {
  const box = $("waterCard");
  if (!box) return;
  const goal = waterGoal();
  const drunk = waterToday();
  const remain = Math.max(goal - drunk, 0);
  const pct = Math.min(drunk / goal * 100, 100);
  const isToday = curDate === todayStr();
  // 卡片标题跟随查看日期：今天→“今日喝水”，其他→“昨天喝水/某月某日喝水”+补记标签
  const titleEl = $("waterCardTitle");
  if (titleEl) {
    titleEl.innerHTML = "💧 " + (isToday ? "今日喝水" : dateLabelStr(curDate) + "喝水")
      + (isToday ? "" : ` <span class="tag">补记</span>`);
  }
  // 空状态：还没喝水，展示当前主题角色
  if (drunk === 0) {
    const chSrc = ($("themeCharacter") && $("themeCharacter").src) || "";
    box.innerHTML = `<div class="water-empty">
      ${chSrc ? `<img src="${chSrc}" alt="">` : `<div style="font-size:40px">💧🐱</div>`}
      <div class="we">${isToday ? "今天" : dateLabelStr(curDate)}还没喝水，来一杯吧</div>
    </div>
    <div class="water-actions"><button class="water-btn" data-water="200">💧 +200ml</button></div>
    <div class="water-actions">
      <input type="number" id="waterCustom" min="1" max="5000" placeholder="自定义毫升数" class="weight-num" style="flex:1; width:auto; color:#3D9AD1;">
      <button class="water-btn" data-water-custom style="flex:0 0 auto; padding:11px 16px;">记录</button>
    </div>`;
    bindWaterBtns(box);
    return;
  }
  box.innerHTML = `
    <div class="water-top">
      <span class="wv">${drunk}</span><span class="wt">/ ${goal} ml</span>
      <span class="wp">${remain > 0 ? "还差 " + remain + " ml" : "达标啦 🎉"}</span>
    </div>
    <div class="water-track"><div class="water-fill ${pct >= 100 ? "full" : ""}" style="width:${pct}%"></div></div>
    <div class="water-actions">
      <button class="water-btn ghost" data-water="-200">−200</button>
      <button class="water-btn" data-water="200">💧 +200ml</button>
    </div>
    <div class="water-actions">
      <input type="number" id="waterCustom" min="1" max="5000" placeholder="自定义毫升数" class="weight-num" style="flex:1; width:auto; color:#3D9AD1;">
      <button class="water-btn" data-water-custom style="flex:0 0 auto; padding:11px 16px;">记录</button>
    </div>
    <div class="water-ripple">${isToday ? "一杯约 200ml，支持手动输入任意毫升数；高蛋白日记得多喝哦" : `正在为「${dateLabelStr(curDate)}」补记喝水，不会影响今天；点顶部“回到今天”即可返回`}</div>`;
  bindWaterBtns(box);
}
function bindWaterBtns(box) {
  box.querySelectorAll("[data-water]").forEach(b => {
    b.onclick = () => {
      const v = Number(b.dataset.water);
      if (v > 0) splashWater(box); // v2.5：加水时来一圈水波
      addWater(v);
    };
  });
  const customBtn = box.querySelector("[data-water-custom]");
  if (customBtn) {
    customBtn.onclick = () => {
      const v = Math.round(Number(box.querySelector("#waterCustom").value));
      if (!(v > 0 && v <= 5000)) { toast("请输入 1~5000 之间的毫升数"); return; }
      splashWater(box);
      addWater(v);
      toast(`已记录喝水 ${v}ml 💧`);
    };
  }
}
// v2.5：喝水卡片上播一次柔和水波扩散
function splashWater(box) {
  const wc = box.closest(".water-card");
  if (!wc) return;
  wc.classList.remove("splash"); void wc.offsetWidth; wc.classList.add("splash");
}

/* ============================================================
 * v2.3 新增：一键添加到桌面（PWA 安装）
 * ============================================================ */
let deferredPrompt = null;
const isIOSDevice = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
const isStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function updateInstallBtn() {
  const btn = $("btnInstall");
  if (!btn) return;
  // 已经以桌面应用方式运行（安装过），就不需要再提示
  if (isStandaloneMode()) { btn.style.display = "none"; return; }
  btn.style.display = "";
}

function askInstallPrompt() {
  if (!deferredPrompt) return false;
  const p = deferredPrompt;
  const finish = (outcome) => {
    if (outcome === "accepted") toast("已添加到桌面 🎉");
    deferredPrompt = null;
    updateInstallBtn();
  };
  p.prompt();
  if (p.userChoice) {
    // 标准浏览器：userChoice 返回用户选择结果
    p.userChoice.then((choice) => finish(choice && choice.outcome)).catch(() => finish());
  } else {
    // 个别环境无 userChoice：默认视为已发起安装
    finish();
  }
  return true;
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // 阻止浏览器默认的小横幅，由我们的按钮统一触发
  deferredPrompt = e;
  updateInstallBtn();
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  updateInstallBtn();
  toast("已安装到桌面 🎉");
});

$("btnInstall").addEventListener("click", () => {
  if (askInstallPrompt()) return; // Chrome/Edge/Android：直接弹系统安装框
  $("btnDoInstall").style.display = "none";
  if (isIOSDevice()) {
    // iOS Safari 不支持自动安装，给出引导
    $("installBody").innerHTML =
      `<div class="box">请用 <b>Safari 浏览器</b> 打开本页面，然后：</div>
      <div class="box">
        <li>1️⃣ 点击底部工具栏的 <b>分享按钮</b>（方框＋箭头 ↑）</li>
        <li>2️⃣ 选择 <b>“添加到主屏幕”</b></li>
        <li>3️⃣ 点击右上角 <b>“添加”</b>，桌面就会出现蛋白质小助手啦</li>
      </div>`;
  } else {
    $("installBody").innerHTML =
      `<div class="box">当前环境不支持一键安装，请手动添加到桌面：</div>
      <div class="box">
        <li>Chrome / Edge：点地址栏右侧的 <b>安装应用</b> 图标，或菜单 → 安装</li>
        <li>其他浏览器：菜单里的 <b>“添加到主屏幕 / 创建快捷方式”</b></li>
      </div>`;
  }
  openModal("mInstall");
});

$("btnInstallClose").addEventListener("click", () => closeModal("mInstall"));
$("btnDoInstall").addEventListener("click", () => {
  closeModal("mInstall");
  askInstallPrompt();
});

// 页面加载时初始化按钮显隐（已安装过则隐藏）
updateInstallBtn();

/* ============================================================
 * v2.4 新增：记录卡片点击直接编辑（名称 / 克数 / 蛋白质）
 * 布局与原有样式完全不变；默认外观与原版一致，仅增加
 * hover/编辑时的浅色反馈。数据保存到 localStorage，刷新保留。
 * ============================================================ */
function commitEntryEdit(ed) {
  const item = ed.closest(".log-item");
  if (!item) return;
  const e = dayLog(curDate).find(x => x.uid === item.dataset.uid);
  if (!e) return;
  const raw = ed.textContent.trim();
  let changed = false;
  if (ed.classList.contains("ed-name")) {
    if (raw && raw !== e.name) { e.name = raw.slice(0, 12); changed = true; }
  } else if (ed.classList.contains("ed-grams")) {
    const v = Math.round(parseFloat(raw) * 100) / 100;
    if (v >= 1 && v <= 2000 && v !== e.grams) {
      e.grams = v;
      delete e.pOverride; // 克数变了，蛋白质按新克数重新计算
      changed = true;
    }
  } else if (ed.classList.contains("ed-pv")) {
    const v = Math.round(parseFloat(raw) * 10) / 10;
    if (v >= 0 && v <= 1000 && v !== Math.round(proteinOf(e) * 10) / 10) {
      e.pOverride = v; // 手动覆盖蛋白质克数
      changed = true;
    }
  }
  if (changed) {
    save();
    toast("已保存 ✏️");
    // 延后到事件流结束后整体重渲染，避免与按钮点击竞争 DOM
    setTimeout(renderAll, 0);
  } else {
    // 输入非法或无变化：还原为规范显示值
    if (ed.classList.contains("ed-name")) ed.textContent = e.name;
    else if (ed.classList.contains("ed-grams")) ed.textContent = e.grams;
    else if (ed.classList.contains("ed-pv")) ed.textContent = fmt(proteinOf(e));
  }
}

$("logList").addEventListener("focusout", (ev) => {
  const ed = ev.target.closest(".editable");
  if (!ed || !ed.isContentEditable) return;
  commitEntryEdit(ed);
});
$("logList").addEventListener("keydown", (ev) => {
  if (ev.key === "Enter" && ev.target.isContentEditable) {
    ev.preventDefault();
    ev.target.blur(); // 回车即提交
  }
});

/* ============================================================
 * v3 新增：底部导航 / 训练打卡 / 我页（不影响原有逻辑）
 * ============================================================ */

/* ---------- Tab 切换 ---------- */
function switchPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll("#tabbar .tab").forEach(t => t.classList.remove("active"));
  const page = $("page-" + name);
  if (page) page.classList.add("active");
  const tab = document.querySelector('#tabbar .tab[data-page="' + name + '"]');
  if (tab) tab.classList.add("active");
  if (name === "train") renderTraining();
  if (name === "me") renderBodyForm();
  window.scrollTo({ top: 0 });
}
$("tabbar").addEventListener("click", (ev) => {
  const t = ev.target.closest(".tab");
  if (!t) return;
  switchPage(t.dataset.page);
});
$("btnTrainBackToday").addEventListener("click", () => {
  curDate = todayStr();
  renderAll();
  renderTraining();
  toast("回到今天 🏠");
});

/* ---------- 动作库（仅名称 + 本地示范 GIF） ---------- */
const EXLIB = [
  { cat: "🫁 胸部", items: [
    { id: "bench-press", name: "平板杠铃卧推", gif: "assets/exercise-videos/bench-press.gif" },
    { id: "incline-db",  name: "上斜哑铃卧推", gif: "assets/exercise-videos/incline-db.gif" },
    { id: "pec-deck",    name: "蝴蝶机夹胸",   gif: "assets/exercise-videos/pec-deck.gif" },
  ]},
  { cat: "🪽 背部", items: [
    { id: "pulldown",    name: "高位下拉",     gif: "assets/exercise-videos/pulldown.gif" },
    { id: "cable-row",   name: "坐姿绳索划船", gif: "assets/exercise-videos/cable-row.gif" },
    { id: "db-row",      name: "单臂哑铃划船", gif: "assets/exercise-videos/db-row.gif" },
    { id: "straight-arm",name: "直臂下压",     gif: "assets/exercise-videos/straight-arm.gif" },
  ]},
  { cat: "🎛 肩部", items: [
    { id: "db-press",  name: "坐姿哑铃推肩",   gif: "assets/exercise-videos/db-press.gif" },
    { id: "lat-raise", name: "哑铃侧平举",     gif: "assets/exercise-videos/lat-raise.gif" },
    { id: "rev-fly",   name: "俯身反向飞鸟",   gif: "assets/exercise-videos/rev-fly.gif" },
    { id: "face-pull", name: "绳索面拉",       gif: "assets/exercise-videos/face-pull.gif" },
  ]},
  { cat: "💥 肱三头肌", items: [
    { id: "rope-pushdown", name: "绳索三头下压",   gif: "assets/exercise-videos/rope-pushdown.gif" },
    { id: "oh-tri",        name: "哑铃颈后臂屈伸", gif: "assets/exercise-videos/oh-tri.gif" },
    { id: "skull",         name: "仰卧臂屈伸",     gif: "assets/exercise-videos/skull.gif" },
  ]},
  { cat: "💪 肱二头肌", items: [
    { id: "bb-curl",  name: "杠铃弯举",     gif: "assets/exercise-videos/bb-curl.gif" },
    { id: "hammer",   name: "锤式弯举",     gif: "assets/exercise-videos/hammer.gif" },
    { id: "preacher", name: "牧师凳弯举",   gif: "assets/exercise-videos/preacher.gif" },
  ]},
  { cat: "🦵 腿部", items: [
    { id: "squat",    name: "杠铃深蹲",     gif: "assets/exercise-videos/squat.gif" },
    { id: "leg-press",name: "腿举",         gif: "assets/exercise-videos/leg-press.gif" },
    { id: "leg-ext",  name: "坐姿腿屈伸",   gif: "assets/exercise-videos/leg-ext.gif" },
    { id: "leg-curl", name: "俯卧腿弯举",   gif: "assets/exercise-videos/leg-curl.gif" },
    { id: "calf",     name: "站姿提踵",     gif: "assets/exercise-videos/calf.gif" },
  ]},
  { cat: "🏃 有氧 / 休息", items: [
    { id: "jog",       name: "慢跑",   gif: "" },
    { id: "incline",   name: "爬坡",   gif: "" },
    { id: "jump-rope", name: "跳绳",   gif: "assets/exercise-videos/jump-rope.gif" },
    { id: "rest",      name: "休息日", gif: "" },
  ]},
];
const EXMAP = {};
EXLIB.forEach(c => c.items.forEach(x => { EXMAP[x.id] = x; }));

/* ---------- 训练数据（按日期独立存储） ---------- */
function trainDay(iso) {
  if (!state.training) state.training = {};
  if (!state.training[iso]) state.training[iso] = {};
  return state.training[iso];
}
function trainEntry(iso, exId) {
  const d = trainDay(iso);
  if (!d[exId]) d[exId] = { sets: [], done: false };
  return d[exId];
}
function exIsDone(iso, exId) {
  const e = trainDay(iso)[exId];
  if (!e) return false;
  return e.done || (e.sets.length > 0 && e.sets.every(s => s.done));
}
let openEx = null;
function renderTraining() {
  $("trainDateLabel").textContent = "📅 " + dateLabelStr(curDate);
  $("btnTrainBackToday").classList.toggle("show", curDate !== todayStr());
  const day = trainDay(curDate);
  // 概览
  const usedIds = Object.keys(day).filter(id => day[id].sets.length || day[id].done);
  const parts = [...new Set(usedIds.map(id => EXMAP[id] ? EXMAP[id].cat : null).filter(Boolean))];
  const doneCnt = usedIds.filter(id => exIsDone(curDate, id)).length;
  $("trainOverview").innerHTML = `
    <div class="stat-box"><div class="sv">${parts.length}</div><div class="sl">训练部位</div></div>
    <div class="stat-box"><div class="sv">${usedIds.length}</div><div class="sl">动作总数</div></div>
    <div class="stat-box hit"><div class="sv">${doneCnt}/${usedIds.length}</div><div class="sl">已完成</div></div>`;
  // 列表
  $("exList").innerHTML = EXLIB.map(c => {
    const rows = c.items.map(x => {
      const e = day[x.id] || { sets: [], done: false };
      const open = openEx === x.id;
      const done = exIsDone(curDate, x.id);
      const setsHtml = !open ? "" : `
        <div class="ex-detail">
          ${e.sets.map((s, i) => `
            <div class="set-row">
              <button class="set-check ${s.done ? "on" : ""}" data-setcheck="${x.id}" data-idx="${i}" title="完成此组">${s.done ? "✓" : i + 1}</button>
              <input class="set-in" type="number" min="0" max="1000" step="0.5" placeholder="重量" value="${s.w}" data-setin="${x.id}" data-idx="${i}" data-field="w">
              <span class="set-lb">kg ×</span>
              <input class="set-in" type="number" min="0" max="999" step="1" placeholder="次数" value="${s.r}" data-setin="${x.id}" data-idx="${i}" data-field="r">
              <span class="set-lb">次</span>
              <button class="set-del" data-setdel="${x.id}" data-idx="${i}">✕</button>
            </div>`).join("")}
          ${e.sets.length ? "" : `<div class="empty" style="padding:8px 0">还没加组，点下面「＋加一组」开始吧</div>`}
          <div class="ex-actions">
            <button class="soft-btn blue" data-addset="${x.id}">＋ 加一组</button>
            <button class="soft-btn" data-clearsets="${x.id}">清空</button>
            <button class="soft-btn ${e.done ? "red" : ""}" data-doneall="${x.id}">${e.done ? "取消打卡" : "整个动作完成 ✓"}</button>
          </div>
        </div>`;
      return `<div class="ex-row ${done ? "done" : ""}">
        <div class="ex-head" data-extoggle="${x.id}">
          <span class="nm">${x.name}</span>
          ${e.sets.length ? `<span class="cnt">${e.sets.filter(s => s.done).length}/${e.sets.length}组</span>` : ""}
          ${x.gif ? `<button class="video-btn" data-video="${x.id}">▶ 示范</button>` : ""}
        </div>
        ${setsHtml}
      </div>`;
    }).join("");
    return `<div class="ex-cat">${c.cat}</div>${rows}`;
  }).join("");
}
$("exList").addEventListener("click", (ev) => {
  const vbtn = ev.target.closest("[data-video]");
  if (vbtn) { openVideo(vbtn.dataset.video); return; }
  const chk = ev.target.closest("[data-setcheck]");
  if (chk) {
    const e = trainEntry(curDate, chk.dataset.setcheck);
    e.sets[Number(chk.dataset.idx)].done = !e.sets[Number(chk.dataset.idx)].done;
    save(); renderTraining(); return;
  }
  const del = ev.target.closest("[data-setdel]");
  if (del) {
    const e = trainEntry(curDate, del.dataset.setdel);
    e.sets.splice(Number(del.dataset.idx), 1);
    save(); renderTraining(); return;
  }
  const add = ev.target.closest("[data-addset]");
  if (add) {
    trainEntry(curDate, add.dataset.addset).sets.push({ w: "", r: "", done: false });
    save(); renderTraining(); return;
  }
  const clr = ev.target.closest("[data-clearsets]");
  if (clr) {
    const e = trainEntry(curDate, clr.dataset.clearsets);
    if (e.sets.length && confirm("清空这个动作的所有组？")) { e.sets = []; save(); renderTraining(); }
    return;
  }
  const da = ev.target.closest("[data-doneall]");
  if (da) {
    const e = trainEntry(curDate, da.dataset.doneall);
    e.done = !e.done;
    e.sets.forEach(s => s.done = e.done); // 完成时全勾；取消时同步取消所有组的勾
    save(); renderTraining();
    toast(e.done ? "动作完成，干得漂亮！💪" : "已取消打卡");
    return;
  }
  const head = ev.target.closest("[data-extoggle]");
  if (head) {
    openEx = openEx === head.dataset.extoggle ? null : head.dataset.extoggle;
    renderTraining();
  }
});
$("exList").addEventListener("input", (ev) => {
  const inp = ev.target.closest("[data-setin]");
  if (!inp) return;
  const e = trainEntry(curDate, inp.dataset.setin);
  const s = e.sets[Number(inp.dataset.idx)];
  if (!s) return;
  s[inp.dataset.field] = inp.value;
  save();
});
function openVideo(exId) {
  const x = EXMAP[exId];
  if (!x || !x.gif) return;
  $("videoTitle").textContent = "🎬 " + x.name;
  $("videoImg").src = x.gif;
  openModal("mVideo");
}
$("btnVideoClose").addEventListener("click", () => closeModal("mVideo"));

/* ---------- 我页：身体数据 ---------- */
function renderBodyForm() {
  const b = state.body || {};
  $("bdHeight").value = b.height || "";
  $("bdWeight").value = b.weight || "";
  $("bdFat").value = b.fat || "";
  $("bdAge").value = b.age || "";
  $("bdGender").value = b.gender || "";
  echoBMI();
}
function echoBMI() {
  const h = Number($("bdHeight").value), w = Number($("bdWeight").value);
  if (h > 0 && w > 0) {
    const bmi = w / ((h / 100) * (h / 100));
    let tag = "标准 🎯";
    if (bmi < 18.5) tag = "偏瘦 🌱";
    else if (bmi >= 24) tag = bmi >= 28 ? "偏胖 🍔" : "微胖 🤔";
    $("bmiEcho").innerHTML = `BMI = <b style="color:var(--primary-dark)">${bmi.toFixed(1)}</b>（${tag}）`;
  } else {
    $("bmiEcho").textContent = "身高体重都填了会自动算 BMI 哦";
  }
}
["bdHeight", "bdWeight"].forEach(id => $(id).addEventListener("input", echoBMI));
$("btnBodySave").addEventListener("click", () => {
  const num = (id, lo, hi) => {
    const v = Number($(id).value);
    return (v >= lo && v <= hi) ? v : null;
  };
  state.body = {
    height: num("bdHeight", 80, 250),
    weight: num("bdWeight", 25, 250),
    fat: num("bdFat", 2, 60),
    age: num("bdAge", 10, 100),
    gender: $("bdGender").value || null,
  };
  save();
  toast("身体数据已保存 📏");
});
/* 我页的 btnTheme / btnInstall / btnProfile 按钮沿用 app.js 原有 id 处理器，无需重复绑定 */

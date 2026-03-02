import { useState, useEffect } from "react";

const MEALS = [
  { id: "breakfast", label: "Breakfast", time: "8–10am", emoji: "🌅" },
  { id: "lunch",     label: "Lunch",     time: "12–2pm", emoji: "☀️"  },
  { id: "dinner",    label: "Dinner",    time: "6–8pm",  emoji: "🌙"  },
];

const ENCOURAGEMENTS = [
  "You logged a meal. That's actually huge.",
  "Your brain runs on food. This matters.",
  "One meal at a time. You're doing it.",
  "Logged! Future you says thank you.",
  "That counts. Everything counts.",
];

const PROTEIN_GOAL = 100;

const FOOD_LIBRARY = [
  { name: "McDonald's Big Mac",          protein: 25, category: "Fast Food" },
  { name: "McDonald's McChicken",         protein: 22, category: "Fast Food" },
  { name: "McDonald's Egg McMuffin",      protein: 17, category: "Fast Food" },
  { name: "Chick-fil-A Sandwich",         protein: 28, category: "Fast Food" },
  { name: "Chick-fil-A Nuggets (8pc)",    protein: 25, category: "Fast Food" },
  { name: "Taco Bell Crunchwrap",         protein: 21, category: "Fast Food" },
  { name: "Taco Bell Bean Burrito",       protein: 13, category: "Fast Food" },
  { name: "Taco Bell Chicken Burrito",    protein: 20, category: "Fast Food" },
  { name: "Burger King Whopper",          protein: 28, category: "Fast Food" },
  { name: "Wendy's Dave's Single",        protein: 30, category: "Fast Food" },
  { name: "Wendy's Spicy Chicken",        protein: 35, category: "Fast Food" },
  { name: "Chipotle Chicken Bowl",        protein: 45, category: "Fast Food" },
  { name: "Chipotle Steak Bowl",          protein: 40, category: "Fast Food" },
  { name: "Subway 6in Turkey",            protein: 18, category: "Fast Food" },
  { name: "Subway 6in Chicken",           protein: 23, category: "Fast Food" },
  { name: "Pizza 2 slices cheese",        protein: 22, category: "Fast Food" },
  { name: "Pizza 2 slices pepperoni",     protein: 26, category: "Fast Food" },
  { name: "Frozen Burrito (El Monterey)", protein: 11, category: "Frozen" },
  { name: "Chicken Tenders (4pc)",        protein: 22, category: "Frozen" },
  { name: "Frozen Pizza (1/3 pizza)",     protein: 18, category: "Frozen" },
  { name: "Pizza Rolls (6pc)",            protein: 8,  category: "Frozen" },
  { name: "Frozen Chicken Patty",         protein: 14, category: "Frozen" },
  { name: "Instant Ramen + Egg",          protein: 15, category: "Frozen" },
  { name: "Instant Ramen (plain)",        protein: 8,  category: "Frozen" },
  { name: "Frozen Salmon Fillet",         protein: 34, category: "Frozen" },
  { name: "Frozen Shrimp (4oz)",          protein: 23, category: "Frozen" },
  { name: "Eggs scrambled (2)",           protein: 12, category: "Home Cooked" },
  { name: "Eggs scrambled (3)",           protein: 18, category: "Home Cooked" },
  { name: "Fried egg (1)",                protein: 6,  category: "Home Cooked" },
  { name: "Egg quesadilla",               protein: 20, category: "Home Cooked" },
  { name: "Chicken breast (6oz)",         protein: 42, category: "Home Cooked" },
  { name: "Chicken thigh (2 pieces)",     protein: 38, category: "Home Cooked" },
  { name: "Ground beef (4oz)",            protein: 28, category: "Home Cooked" },
  { name: "Ground turkey (4oz)",          protein: 30, category: "Home Cooked" },
  { name: "Salmon fillet (6oz)",          protein: 40, category: "Home Cooked" },
  { name: "Canned tuna (1 can)",          protein: 25, category: "Home Cooked" },
  { name: "Pasta with meat sauce",        protein: 30, category: "Home Cooked" },
  { name: "Rice bowl with chicken",       protein: 40, category: "Home Cooked" },
  { name: "Ground beef rice bowl",        protein: 38, category: "Home Cooked" },
  { name: "Avocado toast + egg",          protein: 12, category: "Home Cooked" },
  { name: "Oatmeal (plain)",              protein: 6,  category: "Home Cooked" },
  { name: "Peanut butter toast",          protein: 10, category: "Home Cooked" },
  { name: "Greek yogurt (plain)",         protein: 17, category: "Home Cooked" },
  { name: "Cottage cheese (1/2 cup)",     protein: 14, category: "Home Cooked" },
  { name: "Deli turkey (3 slices)",       protein: 10, category: "Home Cooked" },
  { name: "Cheese quesadilla",            protein: 14, category: "Home Cooked" },
  { name: "Grilled cheese sandwich",      protein: 16, category: "Home Cooked" },
  { name: "Stir fry chicken + veggies",   protein: 38, category: "Home Cooked" },
  { name: "Sheet pan chicken + veggies",  protein: 42, category: "Home Cooked" },
  { name: "Protein bar (Clif)",           protein: 11, category: "Snacks" },
  { name: "Protein bar (Kind)",           protein: 12, category: "Snacks" },
  { name: "Protein shake (1 scoop)",      protein: 25, category: "Snacks" },
  { name: "String cheese (2)",            protein: 12, category: "Snacks" },
  { name: "Almonds (1oz)",                protein: 6,  category: "Snacks" },
  { name: "Hard boiled egg (2)",          protein: 12, category: "Snacks" },
  { name: "Peanut butter (2 tbsp)",       protein: 8,  category: "Snacks" },
  { name: "Beef jerky (1oz)",             protein: 10, category: "Snacks" },
  { name: "Chocolate milk (1 cup)",       protein: 8,  category: "Snacks" },
  { name: "Apple + peanut butter",        protein: 8,  category: "Snacks" },
];

const FOOD_CATEGORIES = ["Fast Food", "Frozen", "Home Cooked", "Snacks"];

const GROCERY_STAPLES = [
  "Eggs", "Bread", "Peanut butter", "Greek yogurt", "Bananas",
  "Oats", "Rice", "Canned tuna", "Cheese", "Frozen veggies",
  "Pasta", "Tomato sauce", "Protein bars", "Chicken thighs",
  "Ground beef", "Frozen burritos", "Chicken tenders", "Instant ramen",
];

const USER_PROFILE = `
- Has ADHD, low energy, works 9-6 Mon-Thu
- Currently only eats lunch most days, trying to add breakfast and dinner
- Hates grocery shopping, shops at Target
- Has: stovetop, oven, microwave, air fryer
- Willing to cook 30 min max on a good night, often just needs something fast
- Loves: eggs, salty/savory food, comfort food
- Protein goal: 100g/day
- Wall-hit go-tos: egg quesadilla, frozen burritos, chicken tenders, instant ramen
- No dietary restrictions
`;

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getDateKey(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function getEncouragement() {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

function getDailyProtein(logs, dateKey) {
  return logs
    .filter(l => l.date === dateKey)
    .reduce((sum, l) => sum + (l.protein || 0), 0);
}

async function callClaude(systemPrompt, userMessage, maxTokens = 300) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "";
}

export default function App() {
  const [tab, setTab] = useState("today");
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem("meal_logs") || "[]"));
  const [grocery, setGrocery] = useState(() => JSON.parse(localStorage.getItem("grocery") || "[]"));
  const [toast, setToast] = useState(null);
  const [logOpen, setLogOpen] = useState(null);
  const [customFood, setCustomFood] = useState("");
  const [foodSearch, setFoodSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Fast Food");
  const [groceryInput, setGroceryInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [groceryGenerating, setGroceryGenerating] = useState(false);
  const [trendsView, setTrendsView] = useState("week");

  useEffect(() => { localStorage.setItem("meal_logs", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem("grocery", JSON.stringify(grocery)); }, [grocery]);

  const today = getTodayKey();
  const todayLogs = logs.filter(l => l.date === today);
  const status = {
    breakfast: todayLogs.some(l => l.meal === "breakfast"),
    lunch:     todayLogs.some(l => l.meal === "lunch"),
    dinner:    todayLogs.some(l => l.meal === "dinner"),
  };
  const mealsToday = Object.values(status).filter(Boolean).length;
  const todayProtein = getDailyProtein(logs, today);
  const proteinPct = Math.min((todayProtein / PROTEIN_GOAL) * 100, 100);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dateKey = getDateKey(6 - i);
    const protein = getDailyProtein(logs, dateKey);
    const label = i === 6 ? "Today" : new Date(dateKey + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
    return { dateKey, protein, label };
  });
  const maxProtein = Math.max(...last7.map(d => d.protein), PROTEIN_GOAL);

  function logMeal(mealId, foodName, protein) {
    const entry = {
      id: Date.now(),
      meal: mealId,
      food: foodName,
      protein: protein || 0,
      date: today,
      ts: new Date().toISOString(),
    };
    setLogs(prev => [...prev, entry]);
    setLogOpen(null);
    setCustomFood("");
    setFoodSearch("");
    const msg = protein
      ? `${getEncouragement()} +${protein}g protein`
      : getEncouragement();
    showToast(msg);
  }

  function deleteLog(id) {
    setLogs(prev => prev.filter(l => l.id !== id));
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function addGrocery(item) {
    if (!item.trim()) return;
    if (grocery.find(g => g.name.toLowerCase() === item.toLowerCase())) return;
    setGrocery(prev => [...prev, { id: Date.now(), name: item, done: false }]);
    setGroceryInput("");
  }

  function toggleGrocery(id) {
    setGrocery(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g));
  }

  function deleteGrocery(id) {
    setGrocery(prev => prev.filter(g => g.id !== id));
  }

  async function generateGroceryList() {
    setGroceryGenerating(true);
    try {
      const system = `You are a grocery list generator for someone with ADHD.
Return ONLY a valid JSON array of strings. No explanation, no markdown.
Example: ["Eggs","Bread","Frozen broccoli"]`;
      const message = `Profile: ${USER_PROFILE}
Generate 15-20 grocery items for Target. Focus on easy meals, high protein, wall-hit fallbacks. JSON array only.`;
      const raw = await callClaude(system, message, 500);
      const clean = raw.replace(/```json|```/g, "").trim();
      const items = JSON.parse(clean);
      let added = 0;
      items.forEach(item => {
        if (typeof item === "string" && item.trim()) {
          if (!grocery.find(g => g.name.toLowerCase() === item.toLowerCase())) {
            setGrocery(prev => [...prev, { id: Date.now() + Math.random(), name: item.trim(), done: false }]);
            added++;
          }
        }
      });
      showToast(`Added ${added} items to your list`);
    } catch {
      showToast("Couldn't generate list — try again");
    }
    setGroceryGenerating(false);
  }

  async function askClaude() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const context = todayLogs.length
        ? `Today I've eaten: ${todayLogs.map(l => `${l.meal} (${l.food}${l.protein ? `, ${l.protein}g protein` : ""})`).join(", ")}. Total protein today: ${todayProtein}g of my ${PROTEIN_GOAL}g goal.`
        : "I haven't eaten anything yet today.";
      const system = `You are a warm, non-judgmental wellness companion for someone with ADHD.
Profile: ${USER_PROFILE}
Keep responses short (2-4 sentences), encouraging, and practical. Never shame. Focus on momentum.`;
      const text = await callClaude(system, `${context} ${aiPrompt}`);
      setAiResponse(text || "Something went wrong, try again.");
    } catch {
      setAiResponse("Couldn't reach the API. Check your .env file.");
    }
    setAiLoading(false);
  }

  const filteredFoods = FOOD_LIBRARY.filter(f => {
    const matchesCategory = f.category === activeCategory;
    const matchesSearch = foodSearch
      ? f.name.toLowerCase().includes(foodSearch.toLowerCase())
      : true;
    return foodSearch ? matchesSearch : matchesCategory;
  });

  const s = {
    app: { maxWidth: 480, margin: "0 auto", padding: "16px 16px 100px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#0f0f13", minHeight: "100vh", color: "#f0f0f0" },
    header: { textAlign: "center", padding: "20px 0 16px" },
    title: { fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    subtitle: { fontSize: 13, color: "#888", marginTop: 4 },
    tabs: { display: "flex", gap: 6, marginBottom: 20 },
    tab: (active) => ({ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: active ? "linear-gradient(135deg, #a78bfa, #60a5fa)" : "#1a1a24", color: active ? "#fff" : "#666" }),
    card: (done) => ({ background: done ? "#0d1f15" : "#16161f", border: `1px solid ${done ? "#22c55e33" : "#ffffff0d"}`, borderRadius: 16, overflow: "hidden", marginBottom: 10 }),
    cardRow: { display: "flex", alignItems: "center", padding: "14px 16px", gap: 12 },
    logBtn: { background: "linear-gradient(135deg, #a78bfa, #60a5fa)", border: "none", borderRadius: 10, padding: "7px 14px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
    quickGrid: { display: "flex", flexWrap: "wrap", gap: 6, padding: "0 16px 12px" },
    quickBtn: { background: "#0f0f13", border: "1px solid #2a2a35", borderRadius: 20, padding: "6px 13px", color: "#ccc", fontSize: 12, cursor: "pointer" },
    inputRow: { display: "flex", gap: 8, marginBottom: 14 },
    input: { flex: 1, background: "#0f0f13", border: "1px solid #2a2a35", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none" },
    addBtn: { background: "#22c55e", border: "none", borderRadius: 10, padding: "9px 16px", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" },
    generateBtn: { width: "100%", padding: "13px", borderRadius: 12, border: "none", cursor: groceryGenerating ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700, background: groceryGenerating ? "#1a1a24" : "linear-gradient(135deg, #a78bfa, #60a5fa)", color: groceryGenerating ? "#555" : "#fff", marginBottom: 16 },
    toast: { position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#1e1b2e", border: "1px solid #a78bfa44", borderRadius: 14, padding: "12px 20px", fontSize: 14, color: "#c4b5fd", whiteSpace: "nowrap", zIndex: 100, boxShadow: "0 4px 24px #0008" },
    section: { marginBottom: 20 },
    sectionLabel: { fontSize: 12, color: "#a78bfa", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 },
    groceryItem: { display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "#16161f", border: "1px solid #ffffff0d", borderRadius: 12, marginBottom: 6 },
    aiBox: { background: "#16161f", border: "1px solid #a78bfa33", borderRadius: 16, padding: 16, marginTop: 16 },
    aiText: { fontSize: 14, color: "#e0d7ff", lineHeight: 1.6 },
    historyDay: { marginBottom: 20 },
    historyDate: { fontSize: 12, color: "#a78bfa", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
    historyEntry: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#16161f", borderRadius: 10, marginBottom: 4 },
    proteinBar: { height: 6, borderRadius: 3, background: "#1a1a24", overflow: "hidden", marginTop: 10, marginBottom: 4 },
    proteinFill: (pct) => ({ height: "100%", width: `${pct}%`, borderRadius: 3, background: pct >= 100 ? "#22c55e" : "linear-gradient(90deg, #a78bfa, #60a5fa)", transition: "width 0.4s ease" }),
    categoryBtn: (active) => ({ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: active ? "#a78bfa" : "#1a1a24", color: active ? "#fff" : "#666" }),
  };

  return (
    <div style={s.app}>

      <div style={s.header}>
        <div style={s.title}>fuelup</div>
        <div style={s.subtitle}>
          {mealsToday === 0 && "Let's get your first meal in 🌱"}
          {mealsToday === 1 && "Nice start. Keep the momentum going ✨"}
          {mealsToday === 2 && "Two meals down. Almost there 🔥"}
          {mealsToday === 3 && "Three meals today. That's everything. 🎉"}
        </div>
        <div style={{ background: "#16161f", border: "1px solid #ffffff0d", borderRadius: 14, padding: "12px 16px", marginTop: 12, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "#888" }}>Protein today</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: proteinPct >= 100 ? "#22c55e" : "#a78bfa" }}>
              {todayProtein}g <span style={{ color: "#444", fontWeight: 400 }}>/ {PROTEIN_GOAL}g</span>
            </div>
          </div>
          <div style={s.proteinBar}>
            <div style={s.proteinFill(proteinPct)} />
          </div>
          <div style={{ fontSize: 11, color: "#555" }}>
            {proteinPct >= 100 ? "Goal hit! 🎉" : `${PROTEIN_GOAL - todayProtein}g to go`}
          </div>
        </div>
      </div>

      <div style={s.tabs}>
        {[["today","Today"],["trends","Trends"],["grocery","Groceries"],["ask","Ask AI"]].map(([id, label]) => (
          <button key={id} style={s.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === "today" && (
        <div>
          {MEALS.map(({ id, label, time, emoji }) => {
            const done = status[id];
            const mealLogs = todayLogs.filter(l => l.meal === id);
            const mealProtein = mealLogs.reduce((sum, l) => sum + (l.protein || 0), 0);
            const isOpen = logOpen === id;
            return (
              <div key={id} style={s.card(done)}>
                <div style={s.cardRow}>
                  <div style={{ fontSize: 24 }}>{emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{label}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{time}</div>
                    {mealLogs.length > 0 && (
                      <div style={{ fontSize: 12, color: "#86efac", marginTop: 3 }}>
                        {mealLogs.map(l => l.food).join(", ")}
                        {mealProtein > 0 && <span style={{ color: "#a78bfa", marginLeft: 6 }}>{mealProtein}g protein</span>}
                      </div>
                    )}
                  </div>
                  {done ? (
                    <div style={{ fontSize: 20 }}>✅</div>
                  ) : (
                    <button style={s.logBtn} onClick={() => { setLogOpen(isOpen ? null : id); setFoodSearch(""); }}>
                      {isOpen ? "Close ▲" : "Log ▼"}
                    </button>
                  )}
                </div>
                {isOpen && (
                  <>
                    <div style={{ padding: "0 16px 10px" }}>
                      <input
                        style={{ ...s.input, width: "100%", boxSizing: "border-box" }}
                        value={foodSearch}
                        onChange={e => setFoodSearch(e.target.value)}
                        placeholder="Search foods..."
                        autoFocus
                      />
                    </div>
                    {!foodSearch && (
                      <div style={{ display: "flex", gap: 6, padding: "0 16px 10px", overflowX: "auto" }}>
                        {FOOD_CATEGORIES.map(cat => (
                          <button key={cat} style={s.categoryBtn(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                    <div style={{ maxHeight: 220, overflowY: "auto", padding: "0 16px 10px" }}>
                      {filteredFoods.map(f => (
                        <div
                          key={f.name}
                          onClick={() => logMeal(id, f.name, f.protein)}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "#0f0f13", border: "1px solid #2a2a35", borderRadius: 10, marginBottom: 5, cursor: "pointer" }}
                        >
                          <div style={{ fontSize: 13, color: "#ccc" }}>{f.name}</div>
                          <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 8 }}>{f.protein}g</div>
                        </div>
                      ))}
                      {filteredFoods.length === 0 && (
                        <div style={{ fontSize: 13, color: "#555", padding: "8px 0" }}>No results — use custom below</div>
                      )}
                    </div>
                    <div style={{ padding: "0 16px 14px" }}>
                      <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>Not in the list? Add it manually:</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          style={{ ...s.input, flex: 2 }}
                          value={customFood}
                          onChange={e => setCustomFood(e.target.value)}
                          placeholder="Food name"
                        />
                        <button style={s.addBtn} onClick={() => customFood.trim() && logMeal(id, customFood.trim(), null)}>+</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "trends" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[["week","Weekly Graph"],["log","Meal Log"]].map(([id, label]) => (
              <button key={id} style={s.categoryBtn(trendsView === id)} onClick={() => setTrendsView(id)}>{label}</button>
            ))}
          </div>
          {trendsView === "week" && (
            <>
              <div style={s.sectionLabel}>Protein — last 7 days</div>
              <div style={{ background: "#16161f", border: "1px solid #ffffff0d", borderRadius: 16, padding: "20px 16px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140, marginBottom: 10 }}>
                  {last7.map(({ dateKey, protein, label }) => {
                    const isToday = dateKey === today;
                    const barHeight = maxProtein > 0 ? (protein / maxProtein) * 120 : 0;
                    const hitGoal = protein >= PROTEIN_GOAL;
                    return (
                      <div key={dateKey} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        {protein > 0 && (
                          <div style={{ fontSize: 10, color: hitGoal ? "#22c55e" : "#a78bfa" }}>{protein}g</div>
                        )}
                        <div style={{ width: "100%", height: Math.max(barHeight, protein > 0 ? 4 : 0), background: hitGoal ? "#22c55e" : isToday ? "linear-gradient(180deg, #a78bfa, #60a5fa)" : "#2a2a35", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0 2px" }}>
                  {last7.map(({ dateKey, label }) => (
                    <div key={dateKey} style={{ flex: 1, textAlign: "center", fontSize: 10, color: dateKey === today ? "#a78bfa" : "#555" }}>{label}</div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: "flex", gap: 16, fontSize: 12, color: "#666" }}>
                  <span><span style={{ color: "#22c55e" }}>■</span> Goal hit</span>
                  <span><span style={{ color: "#a78bfa" }}>■</span> Today</span>
                  <span><span style={{ color: "#2a2a35" }}>■</span> Past days</span>
                  <span style={{ marginLeft: "auto" }}>Goal: {PROTEIN_GOAL}g</span>
                </div>
              </div>
              <div style={{ marginTop: 16, background: "#16161f", border: "1px solid #ffffff0d", borderRadius: 16, padding: 16 }}>
                <div style={s.sectionLabel}>This week</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#a78bfa" }}>
                      {last7.filter(d => d.protein > 0).length}
                    </div>
                    <div style={{ fontSize: 12, color: "#555" }}>days logged</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#60a5fa" }}>
                      {Math.round(last7.reduce((sum, d) => sum + d.protein, 0) / Math.max(last7.filter(d => d.protein > 0).length, 1))}g
                    </div>
                    <div style={{ fontSize: 12, color: "#555" }}>avg protein</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#22c55e" }}>
                      {last7.filter(d => d.protein >= PROTEIN_GOAL).length}
                    </div>
                    <div style={{ fontSize: 12, color: "#555" }}>goals hit</div>
                  </div>
                </div>
              </div>
            </>
          )}
          {trendsView === "log" && (
            <div>
              {logs.length === 0 ? (
                <div style={{ color: "#555", fontSize: 14, textAlign: "center", marginTop: 40 }}>No meals logged yet. Start with today!</div>
              ) : (
                [...new Set(logs.map(l => l.date))].sort().reverse().slice(0, 14).map(date => {
                  const dayLogs = logs.filter(l => l.date === date);
                  const dayProtein = getDailyProtein(logs, date);
                  const isToday = date === today;
                  return (
                    <div key={date} style={s.historyDay}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={s.historyDate}>
                          {isToday ? "Today" : new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          <span style={{ color: "#444", fontWeight: 400, marginLeft: 8 }}>{dayLogs.length} meal{dayLogs.length !== 1 ? "s" : ""}</span>
                        </div>
                        {dayProtein > 0 && (
                          <div style={{ fontSize: 12, color: dayProtein >= PROTEIN_GOAL ? "#22c55e" : "#a78bfa", fontWeight: 600 }}>
                            {dayProtein}g {dayProtein >= PROTEIN_GOAL ? "✓" : ""}
                          </div>
                        )}
                      </div>
                      {dayLogs.map(l => (
                        <div key={l.id} style={s.historyEntry}>
                          <div style={{ fontSize: 16 }}>
                            {l.meal === "breakfast" ? "🌅" : l.meal === "lunch" ? "☀️" : "🌙"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: "#ccc" }}>{l.food}</div>
                            <div style={{ fontSize: 11, color: "#555" }}>{l.meal}{l.protein ? ` · ${l.protein}g protein` : ""}</div>
                          </div>
                          <button onClick={() => deleteLog(l.id)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 16 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {tab === "grocery" && (
        <div>
          <button style={s.generateBtn} onClick={generateGroceryList} disabled={groceryGenerating}>
            {groceryGenerating ? "Generating your list..." : "✨ Generate my grocery list"}
          </button>
          <div style={s.inputRow}>
            <input
              style={s.input}
              value={groceryInput}
              onChange={e => setGroceryInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addGrocery(groceryInput)}
              placeholder="Add an item manually..."
            />
            <button style={s.addBtn} onClick={() => addGrocery(groceryInput)}>+</button>
          </div>
          <div style={s.section}>
            <div style={s.sectionLabel}>Quick add staples</div>
            <div style={s.quickGrid}>
              {GROCERY_STAPLES.map(item => (
                <button key={item} style={s.quickBtn} onClick={() => addGrocery(item)}>{item}</button>
              ))}
            </div>
          </div>
          {grocery.length > 0 && (
            <div style={s.section}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={s.sectionLabel}>Your list ({grocery.filter(g => !g.done).length} left)</div>
                {grocery.some(g => g.done) && (
                  <button onClick={() => setGrocery(prev => prev.filter(g => !g.done))} style={{ background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer" }}>
                    Clear checked
                  </button>
                )}
              </div>
              {grocery.filter(g => !g.done).map(g => (
                <div key={g.id} style={s.groceryItem}>
                  <button onClick={() => toggleGrocery(g.id)} style={{ background: "none", border: "1px solid #333", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", color: "#555", flexShrink: 0 }}>○</button>
                  <div style={{ flex: 1, fontSize: 14 }}>{g.name}</div>
                  <button onClick={() => deleteGrocery(g.id)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer" }}>✕</button>
                </div>
              ))}
              {grocery.filter(g => g.done).map(g => (
                <div key={g.id} style={{ ...s.groceryItem, opacity: 0.4 }}>
                  <button onClick={() => toggleGrocery(g.id)} style={{ background: "#22c55e", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", color: "#fff", fontSize: 12, flexShrink: 0 }}>✓</button>
                  <div style={{ flex: 1, fontSize: 14, textDecoration: "line-through", color: "#555" }}>{g.name}</div>
                  <button onClick={() => deleteGrocery(g.id)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "ask" && (
        <div>
          <div style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>
            Ask anything — what to eat, what to buy, how you're doing.
          </div>
          <div style={s.inputRow}>
            <input
              style={s.input}
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === "Enter" && askClaude()}
              placeholder="What should I eat for dinner?"
            />
            <button style={s.addBtn} onClick={askClaude}>→</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {["What should I eat next?", "Easy dinner tonight?", "How am I doing today?", "Easy breakfast ideas"].map(q => (
              <button key={q} style={s.quickBtn} onClick={() => setAiPrompt(q)}>{q}</button>
            ))}
          </div>
          {aiLoading && <div style={{ color: "#a78bfa", fontSize: 14 }}>Thinking...</div>}
          {aiResponse && (
            <div style={s.aiBox}>
              <div style={s.aiText}>{aiResponse}</div>
            </div>
          )}
        </div>
      )}

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}
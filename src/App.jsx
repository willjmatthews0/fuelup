import { useState, useEffect } from "react";

const MEALS = [
  { id: "breakfast", label: "Breakfast", time: "morning" },
  { id: "lunch",     label: "Lunch",     time: "midday"  },
  { id: "dinner",    label: "Dinner",    time: "evening"  },
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

const FOOD_CATEGORIES = ["Favorites", "Fast Food", "Frozen", "Home Cooked", "Snacks", "My Foods"];

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

const C = {
  bg:         "#faf6f1",
  surface:    "#ffffff",
  border:     "#e8dfd4",
  borderSoft: "#f0e8dd",
  accent:     "#c67a4a",
  accentSoft: "#c67a4a14",
  green:      "#6a9f5c",
  greenSoft:  "#6a9f5c14",
  gold:       "#b8923a",
  text:       "#3d3229",
  textSub:    "#8a7d6f",
  textDim:    "#b5a898",
  shadow:     "0 2px 16px #00000008",
  shadowSm:   "0 1px 6px #00000006",
};

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
  return logs.filter(l => l.date === dateKey).reduce((sum, l) => sum + (l.protein || 0), 0);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
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
  const [proteinLookup, setProteinLookup] = useState(null);
  const [proteinLookupLoading, setProteinLookupLoading] = useState(false);
  const [trendsView, setTrendsView] = useState("week");
  const [customFoods, setCustomFoods] = useState(() => JSON.parse(localStorage.getItem("custom_foods") || "[]"));
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites") || "[]"));

  useEffect(() => { localStorage.setItem("meal_logs", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem("grocery", JSON.stringify(grocery)); }, [grocery]);
  useEffect(() => { localStorage.setItem("custom_foods", JSON.stringify(customFoods)); }, [customFoods]);
  useEffect(() => { localStorage.setItem("favorites", JSON.stringify(favorites)); }, [favorites]);

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
    const entry = { id: Date.now(), meal: mealId, food: foodName, protein: protein || 0, date: today, ts: new Date().toISOString() };
    setLogs(prev => [...prev, entry]);
    setCustomFood("");
    setFoodSearch("");
    setProteinLookup(null);
    showToast(protein ? `${getEncouragement()} +${protein}g protein` : getEncouragement());
  }

  function deleteLog(id) { setLogs(prev => prev.filter(l => l.id !== id)); }

  function toggleFavorite(foodName) {
    setFavorites(prev => prev.includes(foodName) ? prev.filter(n => n !== foodName) : [...prev, foodName]);
  }

  function addCustomFood(name, protein) {
    if (customFoods.some(f => f.name.toLowerCase() === name.toLowerCase())) return;
    setCustomFoods(prev => [...prev, { name, protein, category: "My Foods" }]);
  }

  function deleteCustomFood(name) {
    setCustomFoods(prev => prev.filter(f => f.name !== name));
    setFavorites(prev => prev.filter(n => n !== name));
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

  function toggleGrocery(id) { setGrocery(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g)); }
  function deleteGrocery(id) { setGrocery(prev => prev.filter(g => g.id !== id)); }

  async function generateGroceryList() {
    setGroceryGenerating(true);
    try {
      const system = `You are a grocery list generator for someone with ADHD. Return ONLY a valid JSON array of strings. No explanation, no markdown. Example: ["Eggs","Bread","Frozen broccoli"]`;
      const message = `Profile: ${USER_PROFILE}\nGenerate 15-20 grocery items for Target. Focus on easy meals, high protein, wall-hit fallbacks. JSON array only.`;
      const raw = await callClaude(system, message, 500);
      const items = JSON.parse(raw.replace(/```json|```/g, "").trim());
      let added = 0;
      items.forEach(item => {
        if (typeof item === "string" && item.trim() && !grocery.find(g => g.name.toLowerCase() === item.toLowerCase())) {
          setGrocery(prev => [...prev, { id: Date.now() + Math.random(), name: item.trim(), done: false }]);
          added++;
        }
      });
      showToast(`Added ${added} items to your list`);
    } catch { showToast("Couldn't generate list — try again"); }
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
      const system = `You are a warm, non-judgmental wellness companion for someone with ADHD.\nProfile: ${USER_PROFILE}\nKeep responses short (2-4 sentences), encouraging, and practical. Never shame. Focus on momentum.`;
      const text = await callClaude(system, `${context} ${aiPrompt}`);
      setAiResponse(text || "Something went wrong, try again.");
    } catch { setAiResponse("Couldn't reach the API. Check your .env file."); }
    setAiLoading(false);
  }

  async function lookupProtein(foodName) {
    setProteinLookupLoading(true);
    setProteinLookup(null);
    try {
      const system = `You are a nutrition assistant. When given a food, return ONLY a JSON object with two fields: "food" (cleaned up food name as a string) and "protein" (estimated grams of protein as a number). No explanation, no markdown. Example: {"food":"Chipotle chicken burrito","protein":42}`;
      const raw = await callClaude(system, `Estimate the protein in: ${foodName}`, 100);
      const result = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setProteinLookup(result);
    } catch { showToast("Couldn't look that up — try again"); }
    setProteinLookupLoading(false);
  }

  const allFoods = [...FOOD_LIBRARY, ...customFoods];
  const filteredFoods = (() => {
    if (foodSearch) return allFoods.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase()));
    if (activeCategory === "Favorites") return allFoods.filter(f => favorites.includes(f.name));
    return allFoods.filter(f => f.category === activeCategory);
  })();

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 0 100px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: "100vh", color: C.text, overflowX: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "48px 20px 24px" }}>
        <div style={{ fontSize: 13, color: C.textSub, fontWeight: 500, marginBottom: 4 }}>{getGreeting()} 👋</div>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, color: C.text }}>fuelup</div>
        <div style={{ fontSize: 14, color: C.textSub, marginTop: 4 }}>
          {mealsToday === 0 && "Let's get your first meal in today"}
          {mealsToday === 1 && "Good start — keep the momentum going"}
          {mealsToday === 2 && "Two meals down, one to go"}
          {mealsToday === 3 && "Three meals today. That's everything ✦"}
        </div>

        {/* Protein card */}
        <div style={{ background: C.surface, borderRadius: 18, padding: "16px 18px", marginTop: 20, boxShadow: C.shadow }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 12, color: C.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Protein today</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.text, marginTop: 2, letterSpacing: -1 }}>
                {todayProtein}g
                <span style={{ fontSize: 14, fontWeight: 500, color: C.textDim, marginLeft: 4 }}>/ {PROTEIN_GOAL}g</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: proteinPct >= 100 ? C.green : C.gold, fontWeight: 700 }}>
                {proteinPct >= 100 ? "Goal hit! ✦" : `${PROTEIN_GOAL - todayProtein}g to go`}
              </div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{Math.round(proteinPct)}%</div>
            </div>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: C.borderSoft, overflow: "hidden", marginTop: 14 }}>
            <div style={{ height: "100%", width: `${proteinPct}%`, borderRadius: 3, background: proteinPct >= 100 ? C.green : C.gold, transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "0 20px", borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
        {[["today","Today"],["trends","Trends"],["grocery","Groceries"],["ask","Ask AI"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: "12px 0", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: "none", color: tab === id ? C.accent : C.textDim,
            borderBottom: `2px solid ${tab === id ? C.accent : "transparent"}`,
            transition: "all 0.15s",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "0 20px" }}>

        {/* TODAY */}
        {tab === "today" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {MEALS.map(({ id, label, time }, mealIdx) => {
              const mealLogs = todayLogs.filter(l => l.meal === id);
              const mealProtein = mealLogs.reduce((sum, l) => sum + (l.protein || 0), 0);
              const isOpen = logOpen === id;
              const isLast = mealIdx === MEALS.length - 1;
              return (
                <div key={id} style={{ display: "flex", gap: 16 }}>
                  {/* Timeline rail */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: mealLogs.length > 0 ? C.green : C.border, border: `2px solid ${mealLogs.length > 0 ? C.green : C.borderSoft}`, marginTop: 4, flexShrink: 0 }} />
                    {!isLast && <div style={{ width: 1.5, flex: 1, background: C.border, marginTop: 4 }} />}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : 24 }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{label}</span>
                        <span style={{ fontSize: 12, color: C.textDim, marginLeft: 8 }}>{time}</span>
                      </div>
                      <button onClick={() => { setLogOpen(isOpen ? null : id); setFoodSearch(""); setProteinLookup(null); }} style={{ background: "none", border: "none", color: isOpen ? C.textDim : C.accent, fontWeight: 600, fontSize: 13, cursor: "pointer", padding: "2px 0" }}>
                        {isOpen ? "done" : "+ add"}
                      </button>
                    </div>

                    {/* Logged items */}
                    {mealLogs.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: isOpen ? 12 : 0 }}>
                        {mealLogs.map(l => (
                          <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}` }}>
                            <span style={{ fontSize: 13, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>{l.food}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {l.protein > 0 && <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{l.protein}g</span>}
                              <button onClick={() => deleteLog(l.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}>×</button>
                            </div>
                          </div>
                        ))}
                        {mealProtein > 0 && mealLogs.length > 1 && (
                          <div style={{ fontSize: 11, color: C.textDim, textAlign: "right", paddingRight: 4 }}>{mealProtein}g total</div>
                        )}
                      </div>
                    )}

                    {/* Log panel */}
                    {isOpen && (
                      <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: "14px 16px", marginTop: mealLogs.length > 0 ? 0 : 4, minWidth: 0, overflow: "hidden" }}>
                        <input
                          style={{ width: "100%", boxSizing: "border-box", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", marginBottom: 10 }}
                          value={foodSearch}
                          onChange={e => setFoodSearch(e.target.value)}
                          placeholder="Search foods..."
                          autoFocus
                        />
                        {!foodSearch && (
                          <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto" }}>
                            {FOOD_CATEGORIES.map(cat => (
                              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${activeCategory === cat ? C.accent : C.border}`, background: activeCategory === cat ? C.accentSoft : "none", color: activeCategory === cat ? C.accent : C.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                                {cat}
                              </button>
                            ))}
                          </div>
                        )}
                        <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3, marginBottom: 14 }}>
                          {filteredFoods.map(f => {
                            const isFav = favorites.includes(f.name);
                            const isCustom = customFoods.some(c => c.name === f.name);
                            return (
                              <div key={f.name} style={{ display: "flex", alignItems: "center", padding: "9px 12px", background: C.bg, borderRadius: 10, gap: 8 }}>
                                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(f.name); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1, color: isFav ? C.gold : C.borderSoft, flexShrink: 0 }}>
                                  {isFav ? "★" : "☆"}
                                </button>
                                <div onClick={() => logMeal(id, f.name, f.protein)} style={{ flex: 1, minWidth: 0, cursor: "pointer", fontSize: 13, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                                <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, whiteSpace: "nowrap" }}>{f.protein}g</div>
                                {isCustom && (
                                  <button onClick={(e) => { e.stopPropagation(); deleteCustomFood(f.name); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1, color: C.textDim, flexShrink: 0 }}>×</button>
                                )}
                              </div>
                            );
                          })}
                          {filteredFoods.length === 0 && activeCategory === "Favorites" && <div style={{ fontSize: 13, color: C.textDim, padding: "8px 4px" }}>Star foods to add them here</div>}
                          {filteredFoods.length === 0 && activeCategory === "My Foods" && <div style={{ fontSize: 13, color: C.textDim, padding: "8px 4px" }}>Foods you look up with AI will appear here</div>}
                          {filteredFoods.length === 0 && activeCategory !== "Favorites" && activeCategory !== "My Foods" && <div style={{ fontSize: 13, color: C.textDim, padding: "8px 4px" }}>No results — use the lookup below</div>}
                        </div>

                        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>Not in the list? Claude will find the protein:</div>
                          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <input
                              style={{ flex: 1, minWidth: 0, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none" }}
                              value={customFood}
                              onChange={e => { setCustomFood(e.target.value); setProteinLookup(null); }}
                              onKeyDown={e => e.key === "Enter" && customFood.trim() && lookupProtein(customFood.trim())}
                              placeholder="e.g. Cane's combo, bowl of ramen..."
                            />
                            <button onClick={() => customFood.trim() && lookupProtein(customFood.trim())} disabled={proteinLookupLoading} style={{ background: proteinLookupLoading ? C.borderSoft : C.accent, border: "none", borderRadius: 10, padding: "9px 14px", color: proteinLookupLoading ? C.textDim : "#fff", fontWeight: 700, fontSize: 13, cursor: proteinLookupLoading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                              {proteinLookupLoading ? "..." : "Look up"}
                            </button>
                          </div>
                          {proteinLookup && (
                            <div style={{ background: C.accentSoft, border: `1px solid ${C.accent}44`, borderRadius: 12, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{proteinLookup.food}</div>
                                <div style={{ fontSize: 12, color: C.gold, marginTop: 2 }}>~{proteinLookup.protein}g protein</div>
                              </div>
                              <button onClick={() => { addCustomFood(proteinLookup.food, proteinLookup.protein); logMeal(id, proteinLookup.food, proteinLookup.protein); setProteinLookup(null); }} style={{ background: C.accent, border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                                Log it
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TRENDS */}
        {tab === "trends" && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {[["week","Weekly Graph"],["log","Meal Log"]].map(([id, label]) => (
                <button key={id} onClick={() => setTrendsView(id)} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${trendsView === id ? C.accent : C.border}`, background: trendsView === id ? C.accentSoft : "none", color: trendsView === id ? C.accent : C.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  {label}
                </button>
              ))}
            </div>

            {trendsView === "week" && (
              <>
                <div style={{ background: C.surface, borderRadius: 18, padding: "20px 18px", boxShadow: C.shadowSm, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: C.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 20 }}>Protein — last 7 days</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 130, marginBottom: 10 }}>
                    {last7.map(({ dateKey, protein, label }) => {
                      const isToday = dateKey === today;
                      const barH = maxProtein > 0 ? (protein / maxProtein) * 110 : 0;
                      const hitGoal = protein >= PROTEIN_GOAL;
                      return (
                        <div key={dateKey} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          {protein > 0 && <div style={{ fontSize: 9, color: hitGoal ? C.green : C.gold, fontWeight: 700 }}>{protein}g</div>}
                          <div style={{ width: "100%", height: Math.max(barH, protein > 0 ? 3 : 0), background: hitGoal ? C.green : isToday ? C.accent : C.border, borderRadius: "4px 4px 0 0", transition: "height 0.4s ease" }} />
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex" }}>
                    {last7.map(({ dateKey, label }) => (
                      <div key={dateKey} style={{ flex: 1, textAlign: "center", fontSize: 10, color: dateKey === today ? C.accent : C.textDim, fontWeight: dateKey === today ? 700 : 400 }}>{label}</div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, display: "flex", gap: 14, fontSize: 11, color: C.textDim }}>
                    <span><span style={{ color: C.green }}>■</span> Goal hit</span>
                    <span><span style={{ color: C.accent }}>■</span> Today</span>
                    <span style={{ marginLeft: "auto" }}>Goal: {PROTEIN_GOAL}g</span>
                  </div>
                </div>

                <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm }}>
                  <div style={{ fontSize: 12, color: C.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>This week</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { value: last7.filter(d => d.protein > 0).length, label: "days logged", color: C.accent },
                      { value: `${Math.round(last7.reduce((s, d) => s + d.protein, 0) / Math.max(last7.filter(d => d.protein > 0).length, 1))}g`, label: "avg protein", color: C.gold },
                      { value: last7.filter(d => d.protein >= PROTEIN_GOAL).length, label: "goals hit", color: C.green },
                    ].map(({ value, label, color }) => (
                      <div key={label} style={{ flex: 1, textAlign: "center", background: C.bg, borderRadius: 14, padding: "14px 8px" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: -1 }}>{value}</div>
                        <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {trendsView === "log" && (
              <div>
                {logs.length === 0 ? (
                  <div style={{ color: C.textDim, fontSize: 14, textAlign: "center", marginTop: 60 }}>No meals logged yet. Start with today!</div>
                ) : (
                  [...new Set(logs.map(l => l.date))].sort().reverse().slice(0, 14).map(date => {
                    const dayLogs = logs.filter(l => l.date === date);
                    const dayProtein = getDailyProtein(logs, date);
                    const isToday = date === today;
                    return (
                      <div key={date} style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                            {isToday ? "Today" : new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            <span style={{ color: C.textDim, fontWeight: 400, marginLeft: 8, textTransform: "none" }}>{dayLogs.length} meal{dayLogs.length !== 1 ? "s" : ""}</span>
                          </div>
                          {dayProtein > 0 && (
                            <div style={{ fontSize: 12, color: dayProtein >= PROTEIN_GOAL ? C.green : C.gold, fontWeight: 700 }}>
                              {dayProtein}g {dayProtein >= PROTEIN_GOAL ? "✓" : ""}
                            </div>
                          )}
                        </div>
                        {dayLogs.map(l => (
                          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: C.surface, borderRadius: 14, marginBottom: 5, boxShadow: C.shadowSm }}>
                            <div style={{ fontSize: 16 }}>{l.meal === "breakfast" ? "🌅" : l.meal === "lunch" ? "☀️" : "🌙"}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, color: C.text }}>{l.food}</div>
                              <div style={{ fontSize: 11, color: C.textDim, marginTop: 1 }}>{l.meal}{l.protein ? ` · ${l.protein}g protein` : ""}</div>
                            </div>
                            <button onClick={() => deleteLog(l.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 16 }}>✕</button>
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

        {/* GROCERIES */}
        {tab === "grocery" && (
          <div>
            <button onClick={generateGroceryList} disabled={groceryGenerating} style={{ width: "100%", padding: "14px", borderRadius: 16, border: "none", cursor: groceryGenerating ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700, background: groceryGenerating ? C.borderSoft : C.accent, color: groceryGenerating ? C.textDim : "#fff", marginBottom: 16, boxShadow: C.shadowSm }}>
              {groceryGenerating ? "Generating your list..." : "✦ Generate my grocery list"}
            </button>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input
                style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none" }}
                value={groceryInput}
                onChange={e => setGroceryInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addGrocery(groceryInput)}
                placeholder="Add an item..."
              />
              <button onClick={() => addGrocery(groceryInput)} style={{ background: C.accent, border: "none", borderRadius: 12, padding: "10px 18px", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>+</button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: C.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Quick add</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {GROCERY_STAPLES.map(item => (
                  <button key={item} onClick={() => addGrocery(item)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 14px", color: C.textSub, fontSize: 12, cursor: "pointer" }}>{item}</button>
                ))}
              </div>
            </div>
            {grocery.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: C.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Your list ({grocery.filter(g => !g.done).length} left)</div>
                  {grocery.some(g => g.done) && (
                    <button onClick={() => setGrocery(prev => prev.filter(g => !g.done))} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer" }}>Clear checked</button>
                  )}
                </div>
                {grocery.filter(g => !g.done).map(g => (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: C.surface, borderRadius: 14, marginBottom: 6, boxShadow: C.shadowSm }}>
                    <button onClick={() => toggleGrocery(g.id)} style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${C.border}`, background: "none", cursor: "pointer", flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 14, color: C.text }}>{g.name}</div>
                    <button onClick={() => deleteGrocery(g.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer" }}>✕</button>
                  </div>
                ))}
                {grocery.filter(g => g.done).map(g => (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: C.surface, borderRadius: 14, marginBottom: 6, opacity: 0.45 }}>
                    <button onClick={() => toggleGrocery(g.id)} style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: C.green, cursor: "pointer", flexShrink: 0, color: "#fff", fontSize: 12 }}>✓</button>
                    <div style={{ flex: 1, fontSize: 14, color: C.textDim, textDecoration: "line-through" }}>{g.name}</div>
                    <button onClick={() => deleteGrocery(g.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ASK AI */}
        {tab === "ask" && (
          <div>
            <div style={{ fontSize: 14, color: C.textSub, marginBottom: 16, lineHeight: 1.5 }}>
              Ask anything — what to eat, what to buy, how you're doing.
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 13, outline: "none" }}
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                onKeyDown={e => e.key === "Enter" && askClaude()}
                placeholder="What should I eat for dinner?"
              />
              <button onClick={askClaude} style={{ background: C.accent, border: "none", borderRadius: 12, padding: "11px 18px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>→</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {["What should I eat next?", "Easy dinner tonight?", "How am I doing today?", "Easy breakfast ideas"].map(q => (
                <button key={q} onClick={() => setAiPrompt(q)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 14px", color: C.textSub, fontSize: 12, cursor: "pointer" }}>{q}</button>
              ))}
            </div>
            {aiLoading && <div style={{ color: C.textSub, fontSize: 14, padding: "12px 0" }}>Thinking...</div>}
            {aiResponse && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px 18px", boxShadow: C.shadowSm }}>
                <div style={{ fontSize: 14, color: C.text, lineHeight: 1.65 }}>{aiResponse}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "12px 20px", fontSize: 13, color: C.text, whiteSpace: "nowrap", zIndex: 100, boxShadow: C.shadow }}>
          {toast}
        </div>
      )}
    </div>
  );
}

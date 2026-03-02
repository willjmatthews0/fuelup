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

const QUICK_FOODS = [
  "Eggs & toast", "Greek yogurt", "Peanut butter + banana",
  "Protein shake", "Sandwich", "Oatmeal", "Cereal",
  "Avocado toast", "Apple + cheese", "Leftovers",
];

const GROCERY_STAPLES = [
  "Eggs", "Bread", "Peanut butter", "Greek yogurt", "Bananas",
  "Oats", "Rice", "Canned beans", "Cheese", "Frozen veggies",
  "Pasta", "Tomato sauce", "Protein bars",
];

const USER_PROFILE = `
- Has ADHD, low energy, works 9-6 Mon-Thu
- Currently only eats lunch most days, trying to add breakfast and dinner
- Hates grocery shopping, shops at Target
- Has: stovetop, oven, microwave, air fryer
- Willing to cook 30 min max on a good night, often just needs something fast
- Loves: eggs, salty/savory food, comfort food
- Keeps stocked: eggs, frozen chicken, protein bars
- Wall-hit go-tos: egg quesadilla, frozen burritos, chicken tenders, instant ramen
- Likes: chicken nuggets/tenders, frozen burritos, pizza rolls
- No dietary restrictions
`;

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getEncouragement() {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
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
  const [groceryInput, setGroceryInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [groceryGenerating, setGroceryGenerating] = useState(false);

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

  function logMeal(mealId, food) {
    const entry = { id: Date.now(), meal: mealId, food, date: today, ts: new Date().toISOString() };
    setLogs(prev => [...prev, entry]);
    setLogOpen(null);
    setCustomFood("");
    showToast(getEncouragement());
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
Given their profile, generate a practical weekly grocery list.
You MUST respond with ONLY a valid JSON array of strings — no explanation, no markdown, no extra text.
Example: ["Eggs","Bread","Frozen broccoli"]`;

      const message = `Here is my profile: ${USER_PROFILE}
      
Return a JSON array of 15-20 grocery items I should buy this week at Target. Focus on easy meals, high protein, and wall-hit fallbacks. Only the JSON array, nothing else.`;

      const raw = await callClaude(system, message, 500);

      // Parse the JSON array Claude returns
      const clean = raw.replace(/```json|```/g, "").trim();
      const items = JSON.parse(clean);

      // Add each item to the grocery list, skipping duplicates
      let added = 0;
      items.forEach(item => {
        if (typeof item === "string" && item.trim()) {
          if (!grocery.find(g => g.name.toLowerCase() === item.toLowerCase())) {
            setGrocery(prev => [...prev, { id: Date.now() + Math.random(), name: item.trim(), done: false }]);
            added++;
          }
        }
      });

      showToast(`Added ${added} items to your list ✓`);
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
        ? `Today I've eaten: ${todayLogs.map(l => `${l.meal} (${l.food})`).join(", ")}.`
        : "I haven't eaten anything yet today.";

      const system = `You are a warm, non-judgmental wellness companion for someone with ADHD.
Their profile: ${USER_PROFILE}
Keep responses short (2-4 sentences), encouraging, and practical. Never shame or guilt. Focus on momentum, not perfection.`;

      const text = await callClaude(system, `${context} ${aiPrompt}`);
      setAiResponse(text || "Something went wrong, try again.");
    } catch {
      setAiResponse("Couldn't reach the API. Check that your .env file has your key.");
    }
    setAiLoading(false);
  }

  const s = {
    app: { maxWidth: 480, margin: "0 auto", padding: "16px 16px 100px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#0f0f13", minHeight: "100vh", color: "#f0f0f0" },
    header: { textAlign: "center", padding: "24px 0 20px" },
    title: { fontSize: 30, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    subtitle: { fontSize: 13, color: "#888", marginTop: 6 },
    tabs: { display: "flex", gap: 6, marginBottom: 20 },
    tab: (active) => ({ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: active ? "linear-gradient(135deg, #a78bfa, #60a5fa)" : "#1a1a24", color: active ? "#fff" : "#666" }),
    card: (done) => ({ background: done ? "#0d1f15" : "#16161f", border: `1px solid ${done ? "#22c55e33" : "#ffffff0d"}`, borderRadius: 16, overflow: "hidden", marginBottom: 10 }),
    cardRow: { display: "flex", alignItems: "center", padding: "14px 16px", gap: 12 },
    logBtn: { background: "linear-gradient(135deg, #a78bfa, #60a5fa)", border: "none", borderRadius: 10, padding: "7px 16px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" },
    doneIcon: { fontSize: 22 },
    quickGrid: { display: "flex", flexWrap: "wrap", gap: 6, padding: "0 16px 12px" },
    quickBtn: { background: "#0f0f13", border: "1px solid #2a2a35", borderRadius: 20, padding: "6px 13px", color: "#ccc", fontSize: 12, cursor: "pointer" },
    inputRow: { display: "flex", gap: 8, marginBottom: 14 },
    input: { flex: 1, background: "#0f0f13", border: "1px solid #2a2a35", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none" },
    addBtn: { background: "#22c55e", border: "none", borderRadius: 10, padding: "9px 16px", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" },
    generateBtn: { width: "100%", padding: "13px", borderRadius: 12, border: "none", cursor: groceryGenerating ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700, background: groceryGenerating ? "#1a1a24" : "linear-gradient(135deg, #a78bfa, #60a5fa)", color: groceryGenerating ? "#555" : "#fff", marginBottom: 20 },
    toast: { position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#1e1b2e", border: "1px solid #a78bfa44", borderRadius: 14, padding: "12px 20px", fontSize: 14, color: "#c4b5fd", whiteSpace: "nowrap", zIndex: 100, boxShadow: "0 4px 24px #0008" },
    section: { marginBottom: 24 },
    sectionLabel: { fontSize: 12, color: "#a78bfa", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 },
    groceryItem: { display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "#16161f", border: "1px solid #ffffff0d", borderRadius: 12, marginBottom: 6 },
    aiBox: { background: "#16161f", border: "1px solid #a78bfa33", borderRadius: 16, padding: 16, marginTop: 16 },
    aiText: { fontSize: 14, color: "#e0d7ff", lineHeight: 1.6 },
    historyDay: { marginBottom: 20 },
    historyDate: { fontSize: 12, color: "#a78bfa", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
    historyEntry: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#16161f", borderRadius: 10, marginBottom: 4 },
  };

  return (
    <div style={s.app}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.title}>fuelup</div>
        <div style={s.subtitle}>
          {mealsToday === 0 && "Let's get your first meal in 🌱"}
          {mealsToday === 1 && "Nice start. Keep the momentum going ✨"}
          {mealsToday === 2 && "Two meals down. Almost there 🔥"}
          {mealsToday === 3 && "Three meals today. That's everything. 🎉"}
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[["today","Today"],["history","Log"],["grocery","Groceries"],["ask","Ask AI"]].map(([id, label]) => (
          <button key={id} style={s.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* TODAY */}
      {tab === "today" && (
        <div>
          {MEALS.map(({ id, label, time, emoji }) => {
            const done = status[id];
            const mealLogs = todayLogs.filter(l => l.meal === id);
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
                      </div>
                    )}
                  </div>
                  {done ? (
                    <div style={s.doneIcon}>✅</div>
                  ) : (
                    <button style={s.logBtn} onClick={() => setLogOpen(isOpen ? null : id)}>
                      {isOpen ? "Close ▲" : "Log ▼"}
                    </button>
                  )}
                </div>
                {isOpen && (
                  <>
                    <div style={s.quickGrid}>
                      {QUICK_FOODS.map(f => (
                        <button key={f} style={s.quickBtn} onClick={() => logMeal(id, f)}>{f}</button>
                      ))}
                    </div>
                    <div style={{ padding: "0 16px 14px" }}>
                      <div style={s.inputRow}>
                        <input
                          style={s.input}
                          value={customFood}
                          onChange={e => setCustomFood(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && customFood.trim() && logMeal(id, customFood.trim())}
                          placeholder="Or type anything..."
                        />
                        <button style={s.addBtn} onClick={() => customFood.trim() && logMeal(id, customFood.trim())}>+</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* HISTORY */}
      {tab === "history" && (
        <div>
          {logs.length === 0 ? (
            <div style={{ color: "#555", fontSize: 14, textAlign: "center", marginTop: 40 }}>No meals logged yet. Start with today!</div>
          ) : (
            [...new Set(logs.map(l => l.date))].sort().reverse().slice(0, 14).map(date => {
              const dayLogs = logs.filter(l => l.date === date);
              const isToday = date === today;
              return (
                <div key={date} style={s.historyDay}>
                  <div style={s.historyDate}>
                    {isToday ? "Today" : new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    <span style={{ color: "#444", fontWeight: 400, marginLeft: 8 }}>{dayLogs.length} meal{dayLogs.length !== 1 ? "s" : ""}</span>
                  </div>
                  {dayLogs.map(l => (
                    <div key={l.id} style={s.historyEntry}>
                      <div style={{ fontSize: 16 }}>
                        {l.meal === "breakfast" ? "🌅" : l.meal === "lunch" ? "☀️" : "🌙"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "#ccc" }}>{l.food}</div>
                        <div style={{ fontSize: 11, color: "#555" }}>{l.meal}</div>
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

      {/* GROCERIES */}
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

      {/* ASK AI */}
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

      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}
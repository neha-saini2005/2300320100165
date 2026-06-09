"use client";
import { useState, useEffect } from "react";

const AUTH_URL = "/api/proxy/evaluation-service/auth";
const NOTIF_URL = "/api/proxy/evaluation-service/notifications";

const CLIENT_ID = "4f1cdd6f-e368-4772-8385-dffbb52c0d9f";
const CLIENT_SECRET = "jXGtzEnHqpqzPdSU";

const WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function getToken() {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      email: "nehasaini9612@gmail.com",
      name: "neha saini",
      rollNo: "2300320100165",
      accessCode: "cXuqht",
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export default function Home() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("All");
  const [topN, setTopN] = useState(10);
  const [showPriority, setShowPriority] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = await getToken();
      const res = await fetch(NOTIF_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
    }
    fetchData();
  }, []);

  const getPriorityScore = (n: any) => {
    const weight = WEIGHT[n.Type] || 0;
    const time = new Date(n.Timestamp).getTime();
    return weight * 1e13 + time;
  };

  const filtered = notifications.filter(
    (n) => filter === "All" || n.Type === filter
  );

  const priorityList = [...notifications]
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
    .slice(0, topN);

  const markViewed = (id: string) => {
    setViewed((prev) => new Set(prev).add(id));
  };

  const list = showPriority ? priorityList : filtered;

  return (
    <main style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Campus Notifications
      </h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => setShowPriority(false)}
          style={{ padding: "8px 16px", background: !showPriority ? "#1976d2" : "#eee", color: !showPriority ? "white" : "black", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          All Notifications
        </button>
        <button onClick={() => setShowPriority(true)}
          style={{ padding: "8px 16px", background: showPriority ? "#1976d2" : "#eee", color: showPriority ? "white" : "black", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Priority Inbox
        </button>

        {!showPriority && (
          <>
            {["All", "Placement", "Result", "Event"].map((type) => (
              <button key={type} onClick={() => setFilter(type)}
                style={{ padding: "8px 16px", background: filter === type ? "#388e3c" : "#eee", color: filter === type ? "white" : "black", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                {type}
              </button>
            ))}
          </>
        )}

        {showPriority && (
          <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}
            style={{ padding: "8px", borderRadius: "4px" }}>
            {[10, 15, 20].map((n) => (
              <option key={n} value={n}>Top {n}</option>
            ))}
          </select>
        )}
      </div>

      <div>
        {list.map((n) => (
          <div key={n.ID} onClick={() => markViewed(n.ID)}
            style={{
              padding: "12px 16px", marginBottom: "10px", borderRadius: "8px", cursor: "pointer",
              background: viewed.has(n.ID) ? "#f5f5f5" : "white",
              border: `2px solid ${n.Type === "Placement" ? "#1976d2" : n.Type === "Result" ? "#388e3c" : "#f57c00"}`,
              opacity: viewed.has(n.ID) ? 0.7 : 1,
            }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: viewed.has(n.ID) ? "normal" : "bold" }}>
                {!viewed.has(n.ID) && "🔵 "}{n.Message}
              </span>
              <span style={{ fontSize: "12px", color: "#666" }}>{n.Timestamp}</span>
            </div>
            <div style={{ marginTop: "4px", fontSize: "13px", color: "#888" }}>
              {n.Type} {viewed.has(n.ID) ? "· Viewed" : "· New"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";

// 🎨 styles
const btn = {
padding: "10px",
margin: "5px",
width: "100%",
borderRadius: "8px",
border: "none",
background: "#e0e7ff",
cursor: "pointer",
fontWeight: "bold"
};

const btnPrimary = {
...btn,
background: "#6366f1",
color: "#fff"
};

const input = {
width: "100%",
padding: "10px",
margin: "5px 0",
borderRadius: "8px",
border: "1px solid #ccc"
};

function Dashboard() {
const [value, setValue] = useState("");
const [scores, setScores] = useState([]);
const [charity, setCharity] = useState("");
const [drawResult, setDrawResult] = useState(null);

const [participation, setParticipation] = useState(
Number(localStorage.getItem("participation")) || 0
);
const [winnings, setWinnings] = useState(
Number(localStorage.getItem("winnings")) || 0
);

const token = localStorage.getItem("token");

const API = import.meta.env.VITE_API_URL;

let user = null;
try {
user = JSON.parse(localStorage.getItem("user"));
} catch {
user = null;
}

useEffect(() => {
if (!token) window.location.href = "/";
}, [token]);

const fetchScores = async () => {
try {
const res = await axios.get(`${API}/api/score`, {
headers: { Authorization: `Bearer ${token}` },
});
setScores(res.data);
} catch {
localStorage.clear();
window.location.href = "/";
}
};

useEffect(() => {
if (token) fetchScores();
}, [token]);

const handleAddScore = async () => {
if (!value) return alert("Enter score ⚠️");

```
try {
  await axios.post(
    `${API}/api/score/add`,
    { value: Number(value) },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  setValue("");
  fetchScores();
} catch {
  alert("Error ❌");
}
```

};

const handleUpgrade = async (plan) => {
try {
const res = await axios.post(
`${API}/api/auth/upgrade`,
{ plan },
{ headers: { Authorization: `Bearer ${token}` } }
);

```
  const updatedUser = {
    ...user,
    subscription: res.data.subscription,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));
  window.location.reload();
} catch {
  alert("Upgrade failed ❌");
}
```

};

const handleCharity = async () => {
try {
const res = await axios.post(
`${API}/api/auth/charity`,
{ charity },
{ headers: { Authorization: `Bearer ${token}` } }
);

```
  const updatedUser = { ...user, charity: res.data.charity };
  localStorage.setItem("user", JSON.stringify(updatedUser));
  window.location.reload();
} catch {
  alert("Error ❌");
}
```

};

const handleDraw = async () => {
try {
const res = await axios.get(`${API}/api/draw`, {
headers: { Authorization: `Bearer ${token}` },
});

```
  setDrawResult(res.data);

  const newParticipation = participation + 1;
  setParticipation(newParticipation);
  localStorage.setItem("participation", newParticipation);

  let reward = 0;
  if (res.data.matchCount === 3) reward = 100;
  if (res.data.matchCount === 4) reward = 500;
  if (res.data.matchCount === 5) reward = 1000;

  const total = winnings + reward;
  setWinnings(total);
  localStorage.setItem("winnings", total);

} catch {
  alert("Draw failed ❌");
}
```

};

const handleLogout = () => {
localStorage.clear();
window.location.href = "/";
};

return (
<div style={{ minHeight: "100vh", background: "#f5f7fb", display: "flex", justifyContent: "center", alignItems: "center" }}>
<div style={{ width: "420px", background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)", textAlign: "center" }}>

```
    <h2>Dashboard 🎉</h2>
    <h3>Welcome, {user?.name} 👋</h3>

    <p><b>Plan:</b> {user?.subscription?.plan}</p>
    <p><b>Status:</b> {user?.subscription?.status}</p>
    <p><b>Charity:</b> {user?.charity}</p>

    <hr />

    <p>🎯 Participation: {participation}</p>
    <p>💰 Winnings: ₹{winnings}</p>

    <hr />

    {user?.subscription?.status !== "active" && (
      <>
        <button style={btn} onClick={() => handleUpgrade("Monthly")}>Monthly 💳</button>
        <button style={btn} onClick={() => handleUpgrade("Yearly")}>Yearly 💳</button>
      </>
    )}

    <hr />

    <select style={input} value={charity} onChange={(e) => setCharity(e.target.value)}>
      <option value="">Choose</option>
      <option value="Education">Education</option>
      <option value="Health">Health</option>
      <option value="Environment">Environment</option>
    </select>

    <button style={btn} onClick={handleCharity}>Save Charity</button>

    <hr />

    <button style={btnPrimary} onClick={handleDraw}>Run Draw 🎲</button>

    {drawResult && (
      <div>
        <p>{drawResult.drawNumbers.join(", ")}</p>
        <p>{drawResult.matches.join(", ")}</p>
      </div>
    )}

    <hr />

    {user?.isAdmin && (
      <button onClick={() => window.location.href = "/admin"}>
        Admin Panel
      </button>
    )}

    <input style={input} type="number" value={value} onChange={(e) => setValue(e.target.value)} />

    <button style={btn} onClick={handleAddScore}>Add Score</button>

    {scores.map((s) => (
      <p key={s._id}>{s.value}</p>
    ))}

    <button style={{ ...btn, background: "red", color: "#fff" }} onClick={handleLogout}>
      Logout
    </button>

  </div>
</div>
```

);
}

export default Dashboard;

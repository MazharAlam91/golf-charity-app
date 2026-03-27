import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import Register from "./Register";
import Admin from "./Admin";

// 🎨 styles
const container = {
minHeight: "100vh",
background: "#f5f7fb",
display: "flex",
justifyContent: "center",
alignItems: "center"
};

const card = {
width: "350px",
background: "#fff",
padding: "25px",
borderRadius: "12px",
boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
textAlign: "center"
};

const input = {
width: "100%",
padding: "10px",
margin: "10px 0",
borderRadius: "8px",
border: "1px solid #ccc"
};

const btn = {
width: "100%",
padding: "10px",
borderRadius: "8px",
border: "none",
background: "#6366f1",
color: "#fff",
cursor: "pointer",
fontWeight: "bold"
};

// ================= LOGIN =================
function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

// ✅ API BASE URL
const API = import.meta.env.VITE_API_URL;

const handleLogin = async () => {
try {
const res = await axios.post(
`${API}/api/auth/login`,
{ email, password }
);

```
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  alert("Login Successful 🚀");

  // 👨‍💼 ADMIN REDIRECT
  if (res.data.user.isAdmin) {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }

} catch {
  alert("Login Failed ❌");
}
```

};

return ( <div style={container}> <div style={card}> <h2>Login 🔐</h2>

```
    <input
      style={input}
      type="email"
      placeholder="Enter Email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      style={input}
      type="password"
      placeholder="Enter Password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <button style={btn} onClick={handleLogin}>
      Login
    </button>

    <p style={{ marginTop: "15px" }}>
      Don't have an account?{" "}
      <span
        style={{ color: "#6366f1", cursor: "pointer", fontWeight: "bold" }}
        onClick={() => navigate("/register")}
      >
        Register
      </span>
    </p>
  </div>
</div>
```

);
}

// ================= ROUTES =================
function App() {
return ( <Routes>
<Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/admin" element={<Admin />} /> </Routes>
);
}

export default App;

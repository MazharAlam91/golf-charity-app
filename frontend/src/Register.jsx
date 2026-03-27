import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

// ✅ API BASE URL
const API = import.meta.env.VITE_API_URL;

const handleRegister = async () => {
if (!name || !email || !password) {
return alert("Please fill all fields ⚠️");
}

```
try {
  await axios.post(`${API}/api/auth/register`, {
    name,
    email,
    password,
  });

  alert("Registered Successfully 🎉");
  navigate("/");

} catch (err) {
  console.error(err);
  alert(err.response?.data?.msg || "Error ❌");
}
```

};

return ( <div style={container}> <div style={card}> <h2>Register 📝</h2>

```
    {/* Name */}
    <input
      style={input}
      type="text"
      placeholder="Enter Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    {/* Email */}
    <input
      style={input}
      type="email"
      placeholder="Enter Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    {/* Password */}
    <input
      style={input}
      type="password"
      placeholder="Enter Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button style={btn} onClick={handleRegister}>
      Register
    </button>

    <p style={{ marginTop: "15px" }}>
      Already have an account?{" "}
      <span
        style={{ color: "#6366f1", cursor: "pointer", fontWeight: "bold" }}
        onClick={() => navigate("/")}
      >
        Login
      </span>
    </p>
  </div>
</div>
```

);
}

export default Register;

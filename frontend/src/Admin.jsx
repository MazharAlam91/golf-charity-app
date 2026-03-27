import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
const [users, setUsers] = useState([]);
const token = localStorage.getItem("token");

const API = import.meta.env.VITE_API_URL;

let user = null;
try {
user = JSON.parse(localStorage.getItem("user"));
} catch {
user = null;
}

// 🔒 Protect route
useEffect(() => {
if (!user?.isAdmin) {
window.location.href = "/dashboard";
}
}, []);

// 📥 Fetch users
const fetchUsers = async () => {
try {
const res = await axios.get(`${API}/api/draw/users`, {
headers: { Authorization: `Bearer ${token}` },
});
setUsers(res.data);
} catch {
alert("Not authorized ❌");
}
};

useEffect(() => {
fetchUsers();
}, []);

// 🎲 Run draw
const runDraw = async () => {
try {
const res = await axios.get(`${API}/api/draw/admin-run`, {
headers: { Authorization: `Bearer ${token}` },
});

```
  alert("Winner: " + res.data.winner.name);
} catch {
  alert("Error ❌");
}
```

};

// 🚪 Logout
const handleLogout = () => {
localStorage.clear();
window.location.href = "/";
};

return (
<div style={{ textAlign: "center", marginTop: "50px" }}> <h2>👨‍💼 Admin Panel</h2>

```
  <button onClick={runDraw}>Run Global Draw 🎲</button>

  <h3>All Users:</h3>

  {users.length === 0 ? (
    <p>No users found</p>
  ) : (
    users.map((u) => (
      <p key={u._id}>
        {u.name} | {u.email}
      </p>
    ))
  )}

  <br />

  <button
    onClick={handleLogout}
    style={{
      padding: "10px",
      background: "red",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Logout 🚪
  </button>
</div>
```

);
}

export default Admin;

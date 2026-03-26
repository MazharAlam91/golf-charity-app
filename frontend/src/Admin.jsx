import { useEffect, useState } from "react";
import axios from "axios";

const btn = {
  padding: "10px",
  margin: "10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold"
};

function Admin() {
  const [users, setUsers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  // 🔒 Protect route
  useEffect(() => {
    if (!user?.isAdmin) {
      window.location.href = "/dashboard";
    }
  }, []);

  // 👥 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/draw/users", {
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
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/draw/admin-run", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWinner(res.data.winner);

    } catch {
      alert("Error running draw ❌");
    }
    setLoading(false);
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fb",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        width: "400px",
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>

        <h2>👨‍💼 Admin Panel</h2>

        {/* 🎲 DRAW BUTTON */}
        <button
          style={{ ...btn, background: "#6366f1", color: "#fff" }}
          onClick={runDraw}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Global Draw 🎲"}
        </button>

        {/* 🏆 WINNER DISPLAY */}
        {winner && (
          <div style={{
            marginTop: "15px",
            padding: "10px",
            background: "#e6fffa",
            borderRadius: "8px"
          }}>
            <h3>🏆 Winner</h3>
            <p><b>{winner.name}</b></p>
            <p>{winner.email}</p>
          </div>
        )}

        <hr />

        <h3>All Users</h3>

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((u) => (
            <p key={u._id}>
              {u.name} | {u.email}
            </p>
          ))
        )}

        <hr />

        {/* 🚪 LOGOUT */}
        <button
          style={{ ...btn, background: "red", color: "#fff" }}
          onClick={handleLogout}
        >
          Logout 🚪
        </button>

      </div>
    </div>
  );
}

export default Admin;
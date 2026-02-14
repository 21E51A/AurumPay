import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth.api";
import { useAuth } from "../../auth/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token } = await loginApi({ email, password });

      // decode user from token (backend only sends token)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const user = { id: payload.id, role: payload.role };

      login(token, user);

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/home");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },
  card: {
    width: 320,
    padding: 24,
    background: "#fff",
    borderRadius: 8,
  },
};

export default Login;

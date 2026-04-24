import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import styles from "./Admin.module.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdmin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!login(username, password)) {
      setError("Login yoki parol noto'g'ri");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h1>Cofelton Admin</h1>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <input
            type="text"
            placeholder="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Kirish</button>
        </form>
      </div>
    </div>
  );
}

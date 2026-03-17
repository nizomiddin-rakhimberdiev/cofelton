import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import styles from "./Admin.module.css";

const CITIES = [
  "Toshkent", "Samarqand", "Buxoro", "Farg'ona", "Andijon", "Namangan",
  "Qarshi", "Nukus", "Termiz", "Jizzax", "Guliston", "Navoiy", "Xorazm"
];

export default function Admin() {
  const { isLoggedIn, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  return (
    <div className={styles.admin}>
      <header className={styles.header}>
        <h1>Cofelton Admin</h1>
        <button onClick={logout} className={styles.logoutBtn}>
          Chiqish
        </button>
      </header>
      <AdminDashboard cities={CITIES} />
    </div>
  );
}

export { CITIES };

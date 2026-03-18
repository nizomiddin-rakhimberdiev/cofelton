import { useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { getLocalProducts, setLocalProducts, getLocalReviews, setLocalReviews } from "../../lib/storage";
import { uploadProductImage } from "../../lib/upload";
import styles from "./Admin.module.css";

const DEFAULT_PRODUCTS = [
  { id: "1", name_ru: "Кофемашина Jetinno JL24/JL25", name_uz: "Kofe mashinasi Jetinno JL24/JL25", price_usd: "4500 y.e($)", price_som: "54 500 000 so'm", features_ru: ["Кофемашина Jetinno JL24/JL25", "Мебельная стойка", "Два диспенсера", "Оплата по QR-коду", "Купюроприёмник"], features_uz: ["Kofe mashinasi Jetinno JL24/JL25", "Mebel stoykasi", "Ikkita dispenser", "QR code orqali to'lov", "Naqt pul qabul qilgich"], delivery_days: "10 kundan", image_url: null, sort_order: 0 },
  { id: "2", name_ru: "Металлический каркас", name_uz: "Metallik karkas", price_usd: null, price_som: "33 584 000 so'm", features_ru: ["Металлический каркас", "Электрика", "Утепление", "Регулируемые ножки", "Модем телеметрии"], features_uz: ["Metallik karkas", "Elektr ta'minot", "Izolyatsiya", "Sozlanadigan oyoqchalar", "Telemetriya modemi"], delivery_days: "15 kundan", image_url: null, sort_order: 1 },
];

const DEFAULT_REVIEWS = [
  { id: "1", name: "Jasur Rahimov", age: "31 yosh, murabbiy", city: "Toshkent", text_ru: "Лучшее предложение...", text_uz: "Narx-sifat nisbati bo'yicha eng yaxshi taklif..." },
  { id: "2", name: "Dilshod Karimov", age: "28 yosh, tadbirkor", city: "Samarqand", text_ru: "Дизайн очень хороший...", text_uz: "Dizayn juda yaxshi..." },
  { id: "3", name: "Aziz Toshmatov", age: "26 yosh", city: "Buxoro", text_ru: "Все напитки...", text_uz: "Barcha ichimliklar..." },
  { id: "4", name: "Otabek Yusupov", age: "35 yosh, tadbirkor", city: "Farg'ona", text_ru: "Выглядит красиво...", text_uz: "Juda chiroyli ko'rinadi..." },
  { id: "5", name: "Sardor Nazarov", age: "30 yosh, quruvchi", city: "Andijon", text_ru: "Купил готовую точку...", text_uz: "Omadim yaxshi edi..." },
  { id: "6", name: "Shoxruh Ismoilov", age: "33 yosh", city: "Qarshi", text_ru: "Заказал стойку...", text_uz: "Menejer Marat orqali stoyka buyurtma qildim..." },
];

export default function AdminDashboard({ cities }) {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const useDb = isSupabaseConfigured();

  useEffect(() => {
    if (useDb && supabase) {
      loadData();
    } else {
      setProducts(getLocalProducts() || DEFAULT_PRODUCTS);
      setReviews(getLocalReviews() || DEFAULT_REVIEWS);
      setLoading(false);
    }
  }, [activeTab, useDb]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "products") {
        const { data } = await supabase.from("products").select("*").order("sort_order");
        setProducts(data || []);
      } else if (activeTab === "reviews") {
        const { data } = await supabase.from("reviews").select("*").order("sort_order");
        setReviews(data || []);
      } else if (activeTab === "submissions") {
        const { data } = await supabase.from("form_submissions").select("*").order("created_at", { ascending: false });
        setSubmissions(data || []);
      } else if (activeTab === "analytics") {
        const { data: views } = await supabase.from("page_views").select("*");
        const { data: subs } = await supabase.from("form_submissions").select("id");
        setAnalytics({
          totalViews: views?.length || 0,
          totalSubmissions: subs?.length || 0,
          views: views || [],
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadLocal = () => {
    setProducts(getLocalProducts() || DEFAULT_PRODUCTS);
    setReviews(getLocalReviews() || DEFAULT_REVIEWS);
  };

  const tabs = [
    { id: "products", label: "Maxsulotlar" },
    { id: "reviews", label: "Sharhlar" },
    { id: "submissions", label: "Arizalar", needsDb: true },
    { id: "analytics", label: "Statistika", needsDb: true },
  ];

  return (
    <div className={styles.dashboard}>
      {!useDb && (
        <div className={styles.setupBanner}>
          <span>Supabase sozlanmagan — Maxsulotlar va sharhlar lokal saqlanadi.</span>
          <a href="https://supabase.com" target="_blank" rel="noreferrer">Sozlash</a>
        </div>
      )}
      <nav className={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={activeTab === t.id ? styles.tabActive : ""}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        {!useDb && (activeTab === "submissions" || activeTab === "analytics") ? (
          <div className={styles.setupNotice}>
            <h2>Bu bo'lim uchun Supabase kerak</h2>
            <p>.env faylida quyidagilarni qo'shing:</p>
            <code>VITE_SUPABASE_URL=your_project_url</code>
            <code>VITE_SUPABASE_ANON_KEY=your_anon_key</code>
            <p>Keyin supabase-schema.sql faylini Supabase SQL Editor da bajaring.</p>
          </div>
        ) : loading ? (
          <p>Yuklanmoqda...</p>
        ) : activeTab === "products" ? (
          <ProductsSection products={products} onUpdate={useDb ? loadData : loadLocal} useDb={useDb} />
        ) : activeTab === "reviews" ? (
          <ReviewsSection reviews={reviews} cities={cities} onUpdate={useDb ? loadData : loadLocal} useDb={useDb} />
        ) : activeTab === "submissions" ? (
          <SubmissionsSection submissions={submissions} />
        ) : (
          <AnalyticsSection analytics={analytics} />
        )}
      </div>
    </div>
  );
}

function ProductsSection({ products, onUpdate, useDb }) {
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name_ru: "", name_uz: "", price_usd: "", price_som: "",
    features_ru: "", features_uz: "", delivery_days: "", image_url: "",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !useDb || !supabase) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Faqat rasm fayllari (jpg, png, webp, gif)");
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setUploadError(err?.message || "Yuklash xatosi");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const saveProduct = async () => {
    const data = {
      ...form,
      features_ru: form.features_ru.split("\n").filter(Boolean),
      features_uz: form.features_uz.split("\n").filter(Boolean),
      sort_order: editing ? products.find((p) => p.id === editing.id)?.sort_order ?? products.length : products.length,
    };
    if (useDb && supabase) {
      if (editing) {
        await supabase.from("products").update(data).eq("id", editing.id);
      } else {
        await supabase.from("products").insert(data);
      }
    } else {
      const list = [...products];
      if (editing) {
        const i = list.findIndex((p) => p.id === editing.id);
        if (i >= 0) list[i] = { ...list[i], ...data };
      } else {
        list.push({ ...data, id: crypto.randomUUID() });
      }
      setLocalProducts(list);
    }
    setEditing(null);
    setForm({ name_ru: "", name_uz: "", price_usd: "", price_som: "", features_ru: "", features_uz: "", delivery_days: "", image_url: "" });
    onUpdate();
  };

  const deleteProduct = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    if (useDb && supabase) {
      await supabase.from("products").delete().eq("id", id);
    } else {
      setLocalProducts(products.filter((p) => p.id !== id));
    }
    onUpdate();
  };

  const editProduct = (p) => {
    setEditing(p);
    setForm({
      name_ru: p.name_ru, name_uz: p.name_uz, price_usd: p.price_usd || "", price_som: p.price_som,
      features_ru: (p.features_ru || []).join("\n"), features_uz: (p.features_uz || []).join("\n"),
      delivery_days: p.delivery_days || "", image_url: p.image_url || "",
    });
  };

  return (
    <div className={styles.section}>
      <h2>Maxsulotlar</h2>
      <div className={styles.formCard}>
        <h3>{editing ? "Tahrirlash" : "Yangi maxsulot"}</h3>
        <div className={styles.formGrid}>
          <input placeholder="Nomi (RU)" value={form.name_ru} onChange={(e) => setForm({ ...form, name_ru: e.target.value })} />
          <input placeholder="Nomi (UZ)" value={form.name_uz} onChange={(e) => setForm({ ...form, name_uz: e.target.value })} />
          <input placeholder="Narx (USD)" value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: e.target.value })} />
          <input placeholder="Narx (so'm)" value={form.price_som} onChange={(e) => setForm({ ...form, price_som: e.target.value })} />
          <input placeholder="Yetkazib berish" value={form.delivery_days} onChange={(e) => setForm({ ...form, delivery_days: e.target.value })} />
          <div className={styles.imageUpload}>
            <label>Rasm</label>
            {useDb && supabase && (
              <div className={styles.uploadRow}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className={styles.fileInput}
                  style={{ display: "none" }}
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className={styles.uploadBtn}>
                  {uploading ? "Yuklanmoqda..." : "Rasm yuklash"}
                </button>
              </div>
            )}
            <input placeholder="Yoki rasm URL kiriting" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            {form.image_url && (
              <div className={styles.imagePreview}>
                <img src={form.image_url} alt="Preview" onError={(e) => (e.target.style.display = "none")} />
              </div>
            )}
            {uploadError && <p className={styles.uploadError}>{uploadError}</p>}
          </div>
          <textarea placeholder="Izohlar (RU) - qatorlarda" value={form.features_ru} onChange={(e) => setForm({ ...form, features_ru: e.target.value })} rows={4} />
          <textarea placeholder="Izohlar (UZ) - qatorlarda" value={form.features_uz} onChange={(e) => setForm({ ...form, features_uz: e.target.value })} rows={4} />
        </div>
        <div className={styles.formActions}>
          <button onClick={saveProduct} className={styles.btnPrimary}>Saqlash</button>
          {editing && <button onClick={() => setEditing(null)}>Bekor qilish</button>}
        </div>
      </div>
      <div className={styles.list}>
        {products.map((p) => (
          <div key={p.id} className={styles.card}>
            {p.image_url && <img src={p.image_url} alt="" className={styles.cardThumb} />}
            <div>
              <strong>{p.name_uz}</strong>
              <p>{p.price_som} so'm</p>
            </div>
            <div className={styles.cardActions}>
              <button onClick={() => editProduct(p)}>Tahrir</button>
              <button onClick={() => deleteProduct(p.id)} className={styles.btnDanger}>O'chirish</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsSection({ reviews, cities, onUpdate, useDb }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", age: "", city: cities[0] || "", text_ru: "", text_uz: "" });

  const saveReview = async () => {
    if (useDb && supabase) {
      if (editing) {
        await supabase.from("reviews").update(form).eq("id", editing.id);
      } else {
        await supabase.from("reviews").insert(form);
      }
    } else {
      const list = [...reviews];
      if (editing) {
        const i = list.findIndex((r) => r.id === editing.id);
        if (i >= 0) list[i] = { ...list[i], ...form };
      } else {
        list.push({ ...form, id: crypto.randomUUID() });
      }
      setLocalReviews(list);
    }
    setEditing(null);
    setForm({ name: "", age: "", city: cities[0] || "", text_ru: "", text_uz: "" });
    onUpdate();
  };

  const deleteReview = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    if (useDb && supabase) {
      await supabase.from("reviews").delete().eq("id", id);
    } else {
      setLocalReviews(reviews.filter((r) => r.id !== id));
    }
    onUpdate();
  };

  const editReview = (r) => {
    setEditing(r);
    setForm({ name: r.name, age: r.age || "", city: r.city, text_ru: r.text_ru, text_uz: r.text_uz });
  };

  return (
    <div className={styles.section}>
      <h2>Mijozlar sharhlari</h2>
      <div className={styles.formCard}>
        <h3>{editing ? "Tahrirlash" : "Yangi sharh"}</h3>
        <div className={styles.formGrid}>
          <input placeholder="Ism" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Yosh" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea placeholder="Izoh (RU)" value={form.text_ru} onChange={(e) => setForm({ ...form, text_ru: e.target.value })} rows={3} />
          <textarea placeholder="Izoh (UZ)" value={form.text_uz} onChange={(e) => setForm({ ...form, text_uz: e.target.value })} rows={3} />
        </div>
        <div className={styles.formActions}>
          <button onClick={saveReview} className={styles.btnPrimary}>Saqlash</button>
          {editing && <button onClick={() => setEditing(null)}>Bekor qilish</button>}
        </div>
      </div>
      <div className={styles.list}>
        {reviews.map((r) => (
          <div key={r.id} className={styles.card}>
            <div>
              <strong>{r.name}</strong> — {r.city}
              <p>{r.text_uz?.slice(0, 80)}...</p>
            </div>
            <div className={styles.cardActions}>
              <button onClick={() => editReview(r)}>Tahrir</button>
              <button onClick={() => deleteReview(r.id)} className={styles.btnDanger}>O'chirish</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmissionsSection({ submissions }) {
  return (
    <div className={styles.section}>
      <h2>Forma orqali kelgan arizalar</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sana</th>
              <th>Ism</th>
              <th>Telefon</th>
              <th>Turi</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id}>
                <td>{new Date(s.created_at).toLocaleString("uz-UZ")}</td>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.form_type || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsSection({ analytics }) {
  if (!analytics) return <p>Ma'lumot yo'q</p>;
  return (
    <div className={styles.section}>
      <h2>Statistika</h2>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>{analytics.totalViews}</h3>
          <p>Tashrif buyuruvchilar</p>
        </div>
        <div className={styles.statCard}>
          <h3>{analytics.totalSubmissions}</h3>
          <p>Ariza qoldirganlar</p>
        </div>
      </div>
      <h3>So'nggi tashriflar</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Vaqt</th>
              <th>Manba (referrer)</th>
              <th>Mamlakat</th>
              <th>Shahar</th>
              <th>Sahifa</th>
            </tr>
          </thead>
          <tbody>
            {analytics.views?.slice(0, 50).map((v) => (
              <tr key={v.id}>
                <td>{new Date(v.visited_at).toLocaleString("uz-UZ")}</td>
                <td>{v.referrer || "-"}</td>
                <td>{v.country || "-"}</td>
                <td>{v.city || "-"}</td>
                <td>{v.path || "/"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

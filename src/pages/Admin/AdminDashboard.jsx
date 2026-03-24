import { useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { getLocalProducts, setLocalProducts, getLocalReviews, setLocalReviews } from "../../lib/storage";
import { uploadProductImage } from "../../lib/upload";
import styles from "./Admin.module.css";

const DEFAULT_PRODUCTS = [
  { id: "1", name_ru: "Кофемашина Jetinno JL24/JL25", name_uz: "Kofe mashinasi Jetinno JL24/JL25", price_som: "54 500 000 so'm", promo_until: "2025-03-31", features_ru: ["Кофемашина Jetinno JL24/JL25", "Мебельная стойка", "Два диспенсера", "Оплата по QR-коду", "Купюроприёмник"], features_uz: ["Kofe mashinasi Jetinno JL24/JL25", "Mebel stoykasi", "Ikkita dispenser", "QR code orqali to'lov", "Naqt pul qabul qilgich"], delivery_days: "10", image_url: null, sort_order: 0 },
  { id: "2", name_ru: "Металлический каркас", name_uz: "Metallik karkas", price_som: "33 584 000 so'm", promo_until: null, features_ru: ["Металлический каркас", "Электрика", "Утепление", "Регулируемые ножки", "Модем телеметрии"], features_uz: ["Metallik karkas", "Elektr ta'minot", "Izolyatsiya", "Sozlanadigan oyoqchalar", "Telemetriya modemi"], delivery_days: "15", image_url: null, sort_order: 1 },
];

const DEFAULT_REVIEWS = [
  { id: "1", name: "Jasur Rahimov", age: "31 yosh", profession: "murabbiy", city: "Toshkent", text_ru: "Лучшее предложение...", text_uz: "Narx-sifat nisbati bo'yicha eng yaxshi taklif...", youtube_url: "", avatar_url: "" },
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
    name_ru: "", name_uz: "", price_som: "",
    features_ru: "", features_uz: "", delivery_days: "", image_url: "", promo_until: "",
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
      name_ru: form.name_ru || "Yangi maxsulot",
      name_uz: form.name_uz || "Yangi maxsulot",
      price_som: form.price_som,
      promo_until: form.promo_until || null,
      features_ru: form.features_ru.split("\n").filter(Boolean),
      features_uz: form.features_uz.split("\n").filter(Boolean),
      delivery_days: form.delivery_days,
      image_url: form.image_url || null,
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
    setForm({ name_ru: "", name_uz: "", price_som: "", features_ru: "", features_uz: "", delivery_days: "", image_url: "", promo_until: "" });
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
    const rawPromo = p.promo_until ?? p.promo_date;
    const promoIso =
      rawPromo && /^\d{4}-\d{2}-\d{2}/.test(String(rawPromo)) ? String(rawPromo).slice(0, 10) : "";
    setForm({
      name_ru: p.name_ru, name_uz: p.name_uz, price_som: p.price_som,
      features_ru: (p.features_ru || []).join("\n"), features_uz: (p.features_uz || []).join("\n"),
      delivery_days: p.delivery_days || "", image_url: p.image_url || "", promo_until: promoIso,
    });
  };

  return (
    <div className={styles.section}>
      <h2>Maxsulotlar</h2>
      <div className={styles.formCard}>
        <h3>{editing ? "Tahrirlash" : "Yangi maxsulot"}</h3>
        <div className={styles.formGrid}>
          <input placeholder="Narx (so'm)" value={form.price_som} onChange={(e) => setForm({ ...form, price_som: e.target.value })} />
          <label className={styles.dateField}>
            <span>Aksiya tugash sanasi</span>
            <input
              type="date"
              value={form.promo_until}
              onChange={(e) => setForm({ ...form, promo_until: e.target.value })}
              className={styles.dateInput}
            />
            {form.promo_until && (
              <button type="button" className={styles.clearDate} onClick={() => setForm({ ...form, promo_until: "" })}>
                Tozalash
              </button>
            )}
          </label>
          <input placeholder="Yetkazib berish (kun)" value={form.delivery_days} onChange={(e) => setForm({ ...form, delivery_days: e.target.value })} />
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
  const [form, setForm] = useState({ name: "", age: "", profession: "", city: cities[0] || "", text_ru: "", text_uz: "", youtube_url: "", avatar_url: "" });

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
    setForm({ name: "", age: "", profession: "", city: cities[0] || "", text_ru: "", text_uz: "", youtube_url: "", avatar_url: "" });
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
    setForm({ name: r.name, age: r.age || "", profession: r.profession || "", city: r.city, text_ru: r.text_ru, text_uz: r.text_uz, youtube_url: r.youtube_url || "", avatar_url: r.avatar_url || "" });
  };

  return (
    <div className={styles.section}>
      <h2>Mijozlar sharhlari</h2>
      <div className={styles.formCard}>
        <h3>{editing ? "Tahrirlash" : "Yangi sharh"}</h3>
        <div className={styles.formGrid}>
          <input placeholder="Ism" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Yosh" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <input placeholder="Kasbi" value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
          <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="YouTube video linki" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} />
          <input placeholder="Avatar rasm URL" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
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

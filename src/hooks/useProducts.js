import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { getLocalProducts } from "../lib/storage";

const DEFAULT_PRODUCTS = [
  {
    id: "1",
    name_ru: "Кофемашина Jetinno JL24/JL25",
    name_uz: "Kofe mashinasi Jetinno JL24/JL25",
    price_usd: "4500 y.e($)",
    price_som: "54 500 000 so'm",
    features_ru: ["Кофемашина Jetinno JL24/JL25", "Мебельная стойка", "Два диспенсера", "Оплата по QR-коду", "Купюроприёмник"],
    features_uz: ["Kofe mashinasi Jetinno JL24/JL25", "Mebel stoykasi", "Ikkita dispenser", "QR code orqali to'lov", "Naqt pul qabul qilgich"],
    delivery_days: "10 kundan",
    image_url: null,
  },
  {
    id: "2",
    name_ru: "Металлический каркас",
    name_uz: "Metallik karkas",
    price_usd: null,
    price_som: "33 584 000 so'm",
    features_ru: ["Металлический каркас", "Электрика", "Утепление", "Регулируемые ножки", "Модем телеметрии"],
    features_uz: ["Metallik karkas", "Elektr ta'minot", "Izolyatsiya", "Sozlanadigan oyoqchalar", "Telemetriya modemi"],
    delivery_days: "15 kundan",
    image_url: null,
  },
];

export function useProducts(lang) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured() && supabase) {
        const { data } = await supabase.from("products").select("*").order("sort_order");
        if (data?.length > 0) {
          setProducts(data);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
      } else {
        const local = getLocalProducts();
        setProducts(local || DEFAULT_PRODUCTS);
      }
      setLoading(false);
    }
    load();
  }, []);

  return { products, loading };
}

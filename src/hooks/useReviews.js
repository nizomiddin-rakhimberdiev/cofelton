import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { getLocalReviews } from "../lib/storage";

const DEFAULT_REVIEWS = [
  { id: "1", name: "Jasur Rahimov", age: "31 yosh", profession: "murabbiy", city: "Toshkent", text_ru: "Лучшее предложение...", text_uz: "Narx-sifat nisbati bo'yicha eng yaxshi taklif...", youtube_url: null },
  { id: "2", name: "Dilshod Karimov", age: "28 yosh", profession: "tadbirkor", city: "Samarqand", text_ru: "Дизайн очень хороший...", text_uz: "Dizayn juda yaxshi...", youtube_url: null },
  { id: "3", name: "Aziz Toshmatov", age: "26 yosh", profession: null, city: "Buxoro", text_ru: "Все напитки...", text_uz: "Barcha ichimliklar...", youtube_url: null },
];

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured() && supabase) {
        const { data } = await supabase.from("reviews").select("*").order("sort_order");
        if (data?.length > 0) {
          setReviews(data);
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
      } else {
        const local = getLocalReviews();
        setReviews(local || DEFAULT_REVIEWS);
      }
      setLoading(false);
    }
    load();
  }, []);

  return { reviews, loading };
}

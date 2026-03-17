import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { getLocalReviews } from "../lib/storage";

const DEFAULT_REVIEWS = [
  { id: "1", name: "Jasur Rahimov", age: "31 yosh, murabbiy", city: "Toshkent", text_ru: "Лучшее предложение...", text_uz: "Narx-sifat nisbati bo'yicha eng yaxshi taklif..." },
  { id: "2", name: "Dilshod Karimov", age: "28 yosh, tadbirkor", city: "Samarqand", text_ru: "Дизайн очень хороший...", text_uz: "Dizayn juda yaxshi..." },
  { id: "3", name: "Aziz Toshmatov", age: "26 yosh", city: "Buxoro", text_ru: "Все напитки...", text_uz: "Barcha ichimliklar..." },
  { id: "4", name: "Otabek Yusupov", age: "35 yosh, tadbirkor", city: "Farg'ona", text_ru: "Выглядит красиво...", text_uz: "Juda chiroyli ko'rinadi..." },
  { id: "5", name: "Sardor Nazarov", age: "30 yosh, quruvchi", city: "Andijon", text_ru: "Купил готовую точку...", text_uz: "Omadim yaxshi edi..." },
  { id: "6", name: "Shoxruh Ismoilov", age: "33 yosh", city: "Qarshi", text_ru: "Заказал стойку...", text_uz: "Menejer Marat orqali stoyka buyurtma qildim..." },
];

export function useReviews(lang) {
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

import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Tashrif joylashuvi: brauzerdan tashqi geo-API (masalan ipapi.co) CORS sabab
 * localhost va ko‘p domenlarda ishlamaydi va konsolni ifloslaydi.
 * Mamlakat/shahar keyinroq server yoki Supabase Edge Function orqali qo‘shish mumkin.
 */
export async function trackPageView() {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.from("page_views").insert({
      referrer: document.referrer || null,
      path: window.location.pathname,
      country: null,
      city: null,
      user_agent: navigator.userAgent?.slice(0, 500) || null,
    });
  } catch (e) {
    console.warn("Analytics:", e);
  }
}

export async function saveFormSubmission(data) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.from("form_submissions").insert({
      name: data.name,
      phone: data.phone,
      form_type: data.formType,
    });
  } catch (e) {
    console.warn("Form save:", e);
  }
}

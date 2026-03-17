import { supabase, isSupabaseConfigured } from "./supabase";

async function getLocation() {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 3000);
    const r = await fetch("https://ipapi.co/json/", { signal: c.signal });
    clearTimeout(t);
    const d = await r.json();
    return { country: d.country_name || null, city: d.city || null };
  } catch {
    return { country: null, city: null };
  }
}

export async function trackPageView() {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    const { country, city } = await getLocation();
    await supabase.from("page_views").insert({
      referrer: document.referrer || null,
      path: window.location.pathname,
      country,
      city,
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

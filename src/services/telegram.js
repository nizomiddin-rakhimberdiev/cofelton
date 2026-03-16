/**
 * Telegram bot orqali xabar yuborish
 * .env faylida quyidagilarni o'rnating:
 * VITE_TELEGRAM_BOT_TOKEN=your_bot_token
 * VITE_TELEGRAM_CHAT_ID=726130790, 5664135803  (bir nechta admin — vergul bilan ajratilgan)
 *
 * Bot yaratish: @BotFather dan /newbot
 * Chat ID olish: @userinfobot ga /start
 */
const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_IDS_RAW = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export async function sendToTelegram(formData) {
  if (!BOT_TOKEN || !CHAT_IDS_RAW) {
    console.warn("Telegram: BOT_TOKEN yoki CHAT_ID o'rnatilmagan. .env.example dan nusxa oling.");
    return { ok: false, error: "Telegram sozlanmagan" };
  }

  const chatIds = CHAT_IDS_RAW.split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const { name, phone, formType } = formData;
  const typeLabels = {
    contract: "📄 Получить договор / Shartnoma olish",
    locations: "📍 Получить подборку / Lokatsiyalar",
    businessPlan: "📋 Бизнес-план / Biznes-reja",
    buy: "🛒 Купить кофейню / Kofexona sotib olish",
  };
  const typeLabel = typeLabels[formType] || formType;

  const text = [
    `🆕 <b>Yangi ariza</b>`,
    ``,
    `📌 Turi: ${typeLabel}`,
    `👤 Ism: ${name}`,
    `📞 Telefon: ${phone}`,
    ``,
    `⏰ ${new Date().toLocaleString("ru-RU")}`,
  ].join("\n");

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  let successCount = 0;
  const errors = [];

  for (const chatId of chatIds) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        successCount++;
      } else {
        errors.push(`ID ${chatId}: ${data.description || "xato"}`);
      }
    } catch (e) {
      errors.push(`ID ${chatId}: ${e.message}`);
    }
  }

  if (successCount > 0) {
    return { ok: true };
  }

  const msg = errors.length
    ? `Chat not found. Har bir admin botga /start yuborgan bo'lishi kerak. ${errors.join("; ")}`
    : "Telegram xatosi";
  console.error("Telegram:", msg);
  return { ok: false, error: msg };
}

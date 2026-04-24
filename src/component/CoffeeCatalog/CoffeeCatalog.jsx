import styles from "./CoffeeCatalog.module.css";
import { useLanguage } from "../../i18n/LanguageContext";
import { useLeadFormModal } from "../../context/LeadFormModalContext";
import { useProducts } from "../../hooks/useProducts";
import machine1 from "../../assets/machine1.png";
import machine4 from "../../assets/machine4.png";
import { getPromoBadgeText } from "../../lib/formatPromoUntil";

const DEFAULT_IMAGES = [machine1, machine4];

function catalogImageSrc(url, index) {
  const s = url != null ? String(url).trim() : "";
  if (!s || /^null$/i.test(s) || /^undefined$/i.test(s)) {
    return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  }
  return s;
}

/** Bazadagi narxdan valyuta qismini olib tashlash */
function stripCurrencySuffix(raw) {
  if (raw == null) return "";
  return String(raw)
    .replace(/\s*so['']m\s*$/i, "")
    .replace(/\s*сум\s*$/i, "")
    .replace(/\s*sum\s*$/i, "")
    .trim();
}

function CoffeeCatalog() {
  const { t, lang } = useLanguage();
  const { openModal } = useLeadFormModal();
  const { products, loading } = useProducts();

  const getFeatures = (p) => (lang === "uz" ? (p.features_uz || []) : (p.features_ru || []));
  const getName = (p) => (lang === "uz" ? p.name_uz : p.name_ru);

  const getDeliveryNum = (p) => {
    const raw = p.delivery_days || t("deliveryDays");
    return raw.match(/\d+/)?.[0] || "";
  };

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <div className={styles.catalog}>
      {products.map((machine, index) => {
        const promoText = getPromoBadgeText(machine, lang);
        return (
        <div key={machine.id} className={styles.card}>
          <div className={styles.left}>
            {promoText && (
              <span className={styles.promoBadge}>{promoText}</span>
            )}
            <p className={styles.title}>{t("priceFrom")}</p>
            <h2 className={styles.price}>
              <span className={styles.priceAmount}>{stripCurrencySuffix(machine.price_som)}</span>
              <span className={styles.priceCurrency}> {t("currencySuffix")}</span>
            </h2>
            <div className={styles.features}>
              {getFeatures(machine).map((f, i) => (
                <div key={i} className={styles.feature}>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.center}>
            <img
              src={catalogImageSrc(machine.image_url, index)}
              alt={getName(machine)}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
              }}
            />
          </div>

          <div className={styles.right}>
            <p className={styles.deliveryLabel}>{t("deliveryLabel")}</p>
            <p className={styles.deliveryValue}>
              {lang === "ru" ? (
                <>
                  <span className={styles.deliveryOrange}>
                    {t("deliveryFromPrefix")} {getDeliveryNum(machine)}
                  </span>
                  <span className={styles.deliveryRest}> {t("deliveryDaysUnit")}</span>
                </>
              ) : (
                <>
                  <span className={styles.deliveryOrange}>{getDeliveryNum(machine)}</span>
                  <span className={styles.deliveryRest}> {t("deliveryDaysUnit")}</span>
                </>
              )}
            </p>
            <button type="button" className={styles.button} onClick={() => openModal("buy")}>
              {t("buyCoffee")}
            </button>
          </div>
        </div>
        );
      })}
    </div>
  );
}

export default CoffeeCatalog;

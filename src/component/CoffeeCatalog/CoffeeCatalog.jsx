import styles from "./CoffeeCatalog.module.css";
import { useLanguage } from "../../i18n/LanguageContext";
import { FORM_SECTION_ID } from "../../constants";
import { useProducts } from "../../hooks/useProducts";
import machine1 from "../../assets/machine1.png";
import machine4 from "../../assets/machine4.png";

const DEFAULT_IMAGES = [machine1, machine4];

function CoffeeCatalog() {
  const { t, lang } = useLanguage();
  const { products, loading } = useProducts();

  const scrollToForm = () => {
    document.getElementById(FORM_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
  };

  const getFeatures = (p) => (lang === "uz" ? (p.features_uz || []) : (p.features_ru || []));
  const getName = (p) => (lang === "uz" ? p.name_uz : p.name_ru);
  const getDeliveryText = (p) => {
    const raw = p.delivery_days || t("deliveryDays");
    const num = raw.match(/\d+/)?.[0];
    return num ? `${num} oy` : raw;
  };

  if (loading) return <div className={styles.catalog}><p>Yuklanmoqda...</p></div>;

  return (
    <div className={styles.catalog}>
      {products.map((machine, index) => (
        <div key={machine.id} className={styles.card}>
          <div className={styles.left}>
            <p className={styles.title}>{t("priceFrom")}</p>
            {machine.price_usd && (
              <p className={styles.usdPrice}>
                ${String(machine.price_usd).replace(/[^0-9]/g, "")}
              </p>
            )}
            <h2 className={styles.price}>
              {machine.price_som}
              {machine.price_som && !/so['']m$/i.test(String(machine.price_som)) ? " so'm" : ""}
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
              src={machine.image_url || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}
              alt={getName(machine)}
            />
          </div>

          <div className={styles.right}>
            <p className={styles.delivery}>
              {t("deliveryLabel")} <br />
              <span>{getDeliveryText(machine)}</span>
            </p>
            <button className={styles.button} onClick={scrollToForm}>
              {t("buyCoffee")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CoffeeCatalog;

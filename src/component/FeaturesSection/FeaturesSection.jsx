import styles from "./FeaturesSection.module.css";
import { useLanguage } from "../../i18n/LanguageContext";

const features = [
  { key: "feature1Title", descKey: "feature1Desc", icon: "🛡️" },
  { key: "feature2Title", descKey: "feature2Desc", icon: "📦" },
  { key: "feature3Title", descKey: "feature3Desc", icon: "🗄️" },
  { key: "feature4Title", descKey: "feature4Desc", icon: "🔒" },
];

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t("featuresTitle")}</h2>
      <div className={styles.grid}>
        {features.map((f, i) => (
          <div key={i} className={styles.card}>
            <span className={styles.icon}>{f.icon}</span>
            <h3>{t(f.key)}</h3>
            <p>{t(f.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

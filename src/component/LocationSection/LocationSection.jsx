import styles from "./LocationSection.module.css";
import cup from "../../assets/cup.png";
import { useLanguage } from "../../i18n/LanguageContext";

export default function LocationSection() {
  const { t } = useLanguage();

  return (
    <section className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.left}>
          <p className={styles.text}>{t("locationTitle1")}</p>
          <h1 className={styles.big}>{t("locationTitle2")}</h1>
          <p className={styles.text}>{t("locationTitle3")}</p>
        </div>

        <div className={styles.center}>
          <img src={cup} alt="Kofe" />
        </div>

        <div className={styles.right}>
          <p className={styles.text}>{t("locationSub1")}</p>
          <h1 className={styles.big}>{t("locationSub2")}</h1>
          <p className={styles.text}>{t("locationSub3")}</p>
        </div>
      </div>
    </section>
  );
}

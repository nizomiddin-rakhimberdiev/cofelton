import styles from "./LocationSection.module.css";
import cup from "../../assets/cup.png";
import { useLanguage } from "../../i18n/LanguageContext";
import { FORM_SECTION_ID } from "../../constants";

export default function LocationSection() {
  const { t } = useLanguage();

  const scrollToForm = () => {
    document.getElementById(FORM_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
  };

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

      <div className={styles.orange}>{t("locationOrange")}</div>

      <div className={styles.formBox}>
        <h3>{t("locationFormTitle")}</h3>
        <button className={styles.ctaButton} onClick={scrollToForm}>
          {t("getLocations")}
        </button>
      </div>
    </section>
  );
}

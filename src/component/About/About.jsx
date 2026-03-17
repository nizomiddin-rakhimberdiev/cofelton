import styles from "./About.module.css";
import { useLanguage } from "../../i18n/LanguageContext";

function About() {
  const { t } = useLanguage();

  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.left}>
            <h2 className={styles.mainTitle}>{t("aboutTitle")}</h2>
            <p className={styles.desc}>{t("aboutDesc")}</p>
            <h3 className={styles.title}>{t("aboutListTitle")}</h3>
            <ul className={styles.list}>
              <li>{t("aboutList1")}</li>
              <li>{t("aboutList2")}</li>
              <li>{t("aboutList3")}</li>
              <li>{t("aboutList4")}</li>
            </ul>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.card}>
            <h4>{t("statsNum1")}</h4>
            <p>{t("statsPartners")}</p>
          </div>
          <div className={styles.card}>
            <h4>{t("statsNum2")}</h4>
            <p>{t("statsYears")}</p>
          </div>
          {/* <div className={styles.card}>
            <h4>{t("statsNum3")}</h4>
            <p>{t("statsProduction")}</p>
          </div> */}
          <div className={styles.card}>
            <h4>{t("statsNum4")}</h4>
            <p>{t("statsCities")}</p>
          </div>
          <div className={styles.card}>
            <h4>{t("statsNum5")}</h4>
            <p>{t("statsCountries")} {t("statsCountriesList")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;

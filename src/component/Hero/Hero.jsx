import styles from "./hero.module.css";
import booth from "../../assets/main3.png";
import { useLanguage } from "../../i18n/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { FORM_SECTION_ID } from "../../constants";

function Hero() {
  const { t } = useLanguage();

  const scrollToForm = () => {
    document.getElementById(FORM_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
  };

  const phoneNum = t("phone").replace(/\D/g, "");
  const phoneHref = "tel:+" + (phoneNum.startsWith("8") ? "7" + phoneNum.slice(1) : phoneNum);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.left}>{t("heroHeader")}</div>
          <div className={styles.logo}>
            <span className={styles.logoText}>Cofelton</span>
          </div>
          <div className={styles.right}>
            <LanguageSwitcher />
            <a href={phoneHref} className={styles.phone}>
              {t("phone")}
            </a>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.text}>
            <h1>
              {t("heroTitlePart1")} <br />
              {t("heroTitlePart2")} <span className={styles.orange}>{t("heroTitleHighlight")}</span>{" "}
              <span className={styles.orange}>{t("heroTitleHighlight2")}</span>
              {t("heroTitlePart3") ? ` ${t("heroTitlePart3")}` : ""}
            </h1>

            <button className={styles.button} onClick={scrollToForm}>
              {t("heroCta")}
            </button>

            <p className={styles.profit}>
              <b>{t("heroProfit")}</b>
            </p>
            <p className={styles.time}>{t("heroTime")}</p>
          </div>

          <div className={styles.image}>
            <img src={booth} alt="Cofelton kofexona" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

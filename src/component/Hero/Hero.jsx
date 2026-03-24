import styles from "./hero.module.css";
import booth from "../../assets/main3.png";
import { useLanguage } from "../../i18n/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useLeadFormModal } from "../../context/LeadFormModalContext";

function Hero() {
  const { t } = useLanguage();
  const { openModal } = useLeadFormModal();

  const phoneNum = t("phone").replace(/\D/g, "");
  const phoneHref = "tel:+" + (phoneNum.startsWith("8") ? "7" + phoneNum.slice(1) : phoneNum);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.spacer} />
          <div className={styles.logo}>
            <span className={styles.logoText}>Cofelton</span>
          </div>
          <div className={styles.right}>
            <LanguageSwitcher />
            <a href="https://t.me/cofelton_uz" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Telegram">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            </a>
            <a href="https://www.instagram.com/cofelton.uz" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.766 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
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

            <button className={styles.button} onClick={() => openModal("contract")}>
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

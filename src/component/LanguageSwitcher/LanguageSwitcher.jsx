import { useLanguage } from "../../i18n/LanguageContext";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <button
      type="button"
      className={styles.switcher}
      onClick={toggleLang}
      aria-label={lang === "ru" ? "O'zbek tiliga o'tish" : "Переключить на русский"}
    >
      <span className={lang === "ru" ? styles.active : ""}>{t("langRu")}</span>
      <span className={styles.divider}>/</span>
      <span className={lang === "uz" ? styles.active : ""}>{t("langUz")}</span>
    </button>
  );
}

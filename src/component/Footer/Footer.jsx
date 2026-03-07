import { useLanguage } from "../../i18n/LanguageContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <a href="/privacy.html" className={styles.link}>
        {t("privacy")}
      </a>
    </footer>
  );
}

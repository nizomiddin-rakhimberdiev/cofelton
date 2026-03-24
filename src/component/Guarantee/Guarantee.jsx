import styles from "./Guarantee.module.css";
import { useLanguage } from "../../i18n/LanguageContext";
import { useLeadFormModal } from "../../context/LeadFormModalContext";

export default function Guarantee() {
  const { t } = useLanguage();
  const { openModal } = useLeadFormModal();

  return (
    <section className={styles.guarantee}>
      <div className={styles.formBox}>
        <h3>
          {t("guaranteeFormTitle").replace(t("guaranteeFormHighlight"), "").trim()}{" "}
          <span>{t("guaranteeFormHighlight")}</span>
        </h3>
        <button type="button" className={styles.ctaButton} onClick={() => openModal("contract")}>
          {t("getContract")}
        </button>
      </div>
    </section>
  );
}

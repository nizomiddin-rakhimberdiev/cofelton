import styles from "./Guarantee.module.css";
import { useLanguage } from "../../i18n/LanguageContext";
import LeadForm, { FORM_TYPES } from "../LeadForm/LeadForm";
import { FORM_SECTION_ID } from "../../constants";

export default function Guarantee() {
  const { t } = useLanguage();

  return (
    <section className={styles.guarantee} id={FORM_SECTION_ID}>
      {/* <h2>
        {t("guaranteeTitle").split("—")[0]}— <span>{t("guaranteeTitle").split("—")[1]?.trim()}</span>
      </h2>

      <p className={styles.desc}>{t("guaranteeDesc")}</p> */}

      <div className={styles.formBox}>
        <h3>
          {t("guaranteeFormTitle").replace(t("guaranteeFormHighlight"), "").trim()}{" "}
          <span>{t("guaranteeFormHighlight")}</span>
        </h3>
        <LeadForm formType={FORM_TYPES.contract} variant="dark" />
      </div>
    </section>
  );
}

import styles from "./ReviewsSection.module.css";
import manager from "../../assets/manager.png";
import { useLanguage } from "../../i18n/LanguageContext";
import LeadForm, { FORM_TYPES } from "../LeadForm/LeadForm";

export default function ReviewsSection() {
  const { t } = useLanguage();

  const reviews = [
    { name: t("review1Name"), meta: t("review1Meta"), city: t("review1City"), text: t("review1Text") },
    { name: t("review2Name"), meta: t("review2Meta"), city: t("review2City"), text: t("review2Text") },
    { name: t("review3Name"), meta: t("review3Meta"), city: t("review3City"), text: t("review3Text") },
    { name: t("review4Name"), meta: t("review4Meta"), city: t("review4City"), text: t("review4Text") },
    { name: t("review5Name"), meta: t("review5Meta"), city: t("review5City"), text: t("review5Text") },
    { name: t("review6Name"), meta: t("review6Meta"), city: t("review6City"), text: t("review6Text") },
  ];

  const phoneNum = t("phone").replace(/\D/g, "");
  const phoneHref = "tel:+" + (phoneNum.startsWith("8") ? "7" + phoneNum.slice(1) : phoneNum);

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t("reviewsTitle")}</h2>

      <div className={styles.reviews}>
        {reviews.map((r, i) => (
          <div key={i} className={styles.card}>
            <h4>{r.name}</h4>
            <p className={styles.meta}>{r.meta}</p>
            <p className={styles.city}>{r.city}</p>
            <p>{r.text}</p>
          </div>
        ))}
      </div>

      <div className={styles.managerSection}>
        <div className={styles.managerInfo}>
          <h3>
            {t("managerTitle")} <span>{t("managerName")}</span> {t("managerSubtitle")}{" "}
            <span>{t("managerBrand")}</span>
          </h3>
          <LeadForm formType={FORM_TYPES.businessPlan} variant="dark" />
        </div>
        <img src={manager} alt="Menejer" className={styles.managerImg} />
      </div>

      <div className={styles.contacts}>
        <h2>{t("contactsTitle")}</h2>
        <a href={phoneHref} className={styles.phone}>
          {t("phone")}
        </a>
        <a href={`mailto:${t("email")}`} className={styles.email}>
          {t("email")}
        </a>
      </div>
    </section>
  );
}

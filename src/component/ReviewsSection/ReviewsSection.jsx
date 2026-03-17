import styles from "./ReviewsSection.module.css";
import manager from "../../assets/manager.png";
import { useLanguage } from "../../i18n/LanguageContext";
import LeadForm, { FORM_TYPES } from "../LeadForm/LeadForm";
import { useReviews } from "../../hooks/useReviews";

export default function ReviewsSection() {
  const { t, lang } = useLanguage();
  const { reviews, loading } = useReviews();

  const getText = (r) => (lang === "uz" ? r.text_uz : r.text_ru);

  const phoneNum = t("phone").replace(/\D/g, "");
  const phoneHref = "tel:+" + (phoneNum.startsWith("8") ? "7" + phoneNum.slice(1) : phoneNum);

  if (loading) return <section className={styles.wrapper}><p>Yuklanmoqda...</p></section>;

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t("reviewsTitle")}</h2>

      <div className={styles.reviews}>
        {reviews.map((r) => (
          <div key={r.id} className={styles.card}>
            <h4>{r.name}</h4>
            {r.age && <p className={styles.meta}>{r.age}</p>}
            <p className={styles.city}>{r.city}</p>
            <p>{getText(r)}</p>
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

import { useEffect, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { useLeadFormModal } from "../../context/LeadFormModalContext";
import { sendToTelegram } from "../../services/telegram";
import { saveFormSubmission } from "../../lib/analytics";
import styles from "./LeadFormModal.module.css";

export default function LeadFormModal() {
  const { isOpen, formType, closeModal } = useLeadFormModal();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [commercialProposal, setCommercialProposal] = useState(false);
  const [policy, setPolicy] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !policy) return;

    setStatus("sending");
    const formData = { name: name.trim(), phone: phone.trim(), formType, commercialProposal };
    saveFormSubmission(formData);
    const result = await sendToTelegram(formData);

    if (result.ok) {
      setStatus("success");
      setName("");
      setPhone("");
      setCommercialProposal(false);
      setPolicy(false);
      setTimeout(closeModal, 1500);
    } else {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={closeModal} aria-label="Yopish">
          ×
        </button>
        <h2 className={styles.title}>{t("modalTitle")}</h2>

        {status === "success" ? (
          <div className={styles.success}>
            <span className={styles.successIcon}>✓</span>
            <p>{t("submitSuccess")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status === "sending"}
            />
            <input
              type="tel"
              placeholder={t("phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={status === "sending"}
            />
            <label className={styles.checkbox}>
              <input type="checkbox" checked={commercialProposal} onChange={(e) => setCommercialProposal(e.target.checked)} />
              {t("commercialProposal")}
            </label>
            <label className={styles.policy}>
              <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} required />
              {t("policyText")}
            </label>
            <button type="submit" disabled={status === "sending" || !policy}>
              {status === "sending" ? t("submitSending") : t("submitButton")}
            </button>
            {status === "error" && <p className={styles.error}>{t("submitError")}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

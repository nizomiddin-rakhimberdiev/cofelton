import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { sendToTelegram } from "../../services/telegram";
import styles from "./LeadForm.module.css";

const FORM_TYPES = {
  contract: "contract",
  locations: "locations",
  businessPlan: "businessPlan",
  buy: "buy",
};

export default function LeadForm({ formType = "contract", buttonText, onSuccess, className = "", variant = "light" }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [policy, setPolicy] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const displayButtonText = buttonText ?? (formType === "contract" ? t("getContract") : formType === "locations" ? t("getLocations") : formType === "businessPlan" ? t("getBusinessPlan") : t("buyCoffee"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    if (!policy) return;

    setStatus("sending");
    const result = await sendToTelegram({ name: name.trim(), phone: phone.trim(), formType });

    if (result.ok) {
      setStatus("success");
      setName("");
      setPhone("");
      setPolicy(false);
      onSuccess?.();
    } else {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`${styles.success} ${className}`}>
        <span className={styles.successIcon}>✓</span>
        <p>{t("submitSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${variant === "dark" ? styles.dark : ""} ${className}`}>
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
      <button type="submit" disabled={status === "sending" || !policy}>
        {status === "sending" ? t("submitSending") : displayButtonText}
      </button>
      <label className={styles.policy}>
        <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} />
        {t("policyText")}
      </label>
      {status === "error" && <p className={styles.error}>{t("submitError")}</p>}
    </form>
  );
}

export { FORM_TYPES };

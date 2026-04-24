import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ReviewsSection.module.css";
import manager from "../../assets/manager.png";
import { useLanguage } from "../../i18n/LanguageContext";
import { useLeadFormModal } from "../../context/LeadFormModalContext";
import { useReviews } from "../../hooks/useReviews";
import { phoneToTelHref } from "../../lib/phone";

/** Bo'shliqlar, yopishgan so'zlar (masalan izohO'zbekcha) */
function formatReviewText(s) {
  if (s == null) return "";
  let t = String(s).trim().replace(/\s+/g, " ");
  t = t.replace(/([.!?])([A-Za-zА-Яа-яЁёЎOʻ])/g, "$1 $2");
  t = t.replace(/([a-zа-яё])([A-ZЁА-ЯОЎOʻ])/g, "$1 $2");
  return t;
}

function ReviewCardAvatar({ name, avatarUrl, youtubeUrl }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = Boolean(avatarUrl) && !imgFailed;

  const disk = (
    <>
      {showPhoto && (
        <img src={avatarUrl} alt="" onError={() => setImgFailed(true)} />
      )}
      {!showPhoto && <span className={styles.avatarFallback}>{name?.[0] || "?"}</span>}
      {youtubeUrl && (
        <span className={styles.playBadge} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}
    </>
  );

  if (youtubeUrl) {
    return (
      <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className={styles.avatarLink} aria-label="Video sharh">
        <div className={styles.avatar}>{disk}</div>
      </a>
    );
  }

  return <div className={styles.avatar}>{disk}</div>;
}

export default function ReviewsSection() {
  const { t, lang } = useLanguage();
  const { openModal } = useLeadFormModal();
  const { reviews, loading } = useReviews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const getText = (r) => formatReviewText(lang === "uz" ? r.text_uz : r.text_ru);

  const phoneHref = phoneToTelHref(t("phone"));

  const scrollToIndex = useCallback((index) => {
    const el = scrollRef.current;
    if (!el?.children[0]) return;
    const gap = 24;
    const w = el.children[0].offsetWidth;
    el.scrollTo({ left: index * (w + gap), behavior: "smooth" });
  }, []);

  const next = () => setCurrentIndex((i) => Math.min(i + 1, reviews.length - 1));
  const prev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex, scrollToIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let tmr;
    const onScroll = () => {
      clearTimeout(tmr);
      tmr = setTimeout(() => {
        const card = el.children[0];
        if (!card) return;
        const gap = 24;
        const w = card.offsetWidth + gap;
        const idx = Math.max(0, Math.min(reviews.length - 1, Math.round(el.scrollLeft / w)));
        setCurrentIndex(idx);
      }, 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(tmr);
      el.removeEventListener("scroll", onScroll);
    };
  }, [reviews.length]);

  const atStart = currentIndex <= 0;
  const atEnd = currentIndex >= reviews.length - 1;

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t("reviewsTitle")}</h2>
      <div className={styles.titleAccent} aria-hidden="true" />

      {loading ? (
        <p className={styles.loading}>Yuklanmoqda...</p>
      ) : (
        <div className={styles.carouselWrap}>
          <button
            type="button"
            className={styles.carouselArrow}
            onClick={prev}
            disabled={atStart}
            aria-label="Oldingi"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className={styles.carouselViewport}>
            <div className={styles.carousel} ref={scrollRef}>
              {reviews.map((r) => (
                <article key={r.id} className={styles.card}>
                  <div className={styles.avatarWrap}>
                    <ReviewCardAvatar name={r.name} avatarUrl={r.avatar_url} youtubeUrl={r.youtube_url} />
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <h4 className={styles.reviewerName}>{r.name}</h4>
                      {(r.age || r.profession) && (
                        <p className={styles.reviewerJob}>
                          {[r.age, r.profession].filter(Boolean).join(", ")}
                        </p>
                      )}
                      <p className={styles.city}>{r.city}</p>
                    </div>
                    <p className={styles.reviewText}>{getText(r)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.carouselArrow}
            onClick={next}
            disabled={atEnd}
            aria-label="Keyingi"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      <div className={styles.managerSection}>
        <div className={styles.managerInfo}>
          <h3>{t("managerHeadline")}</h3>
          <button type="button" className={styles.ctaBtn} onClick={() => openModal("businessPlan")}>
            {t("getBusinessPlan")}
          </button>
        </div>
        <img src={manager} alt="Menejer" className={styles.managerImg} />
      </div>

      <div className={styles.contacts}>
        <h2>{t("contactsTitle")}</h2>
        <a href={phoneHref} className={styles.phone}>
          {t("phone")}
        </a>
        <a
          href="https://t.me/sultoncofelton"
          className={styles.telegram}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("telegramAccount")}
        </a>
      </div>
    </section>
  );
}

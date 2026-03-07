import styles from "./CoffeeCatalog.module.css";
import { useLanguage } from "../../i18n/LanguageContext";
import { FORM_SECTION_ID } from "../../constants";

import machine1 from "../../assets/machine1.png";
import machine2 from "../../assets/machine2.png";
import machine3 from "../../assets/machine3.png";
import machine4 from "../../assets/machine4.png";

function CoffeeCatalog() {
  const { t } = useLanguage();

  const scrollToForm = () => {
    document.getElementById(FORM_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
  };

  const machines = [
    {
      price: "38 384 000 so'm",
      oldPrice: "44 784 000 so'm",
      delivery: t("deliveryDays"),
      img: machine1,
      features: [
        "Кофемашина Jetinno JL24/JL25",
        "Мебельная стойка",
        "Два диспенсера",
        "Терминал банковской оплаты",
        "Модем телеметрии",
      ],
    },
    {
      price: "49 584 000 so'm",
      oldPrice: "55 984 000 so'm",
      delivery: t("deliveryDays"),
      img: machine2,
      features: [
        "Кофемашина Jofemar Orion Touch G23",
        "Мебельная стойка",
        "Два диспенсера",
        "Терминал банковской оплаты",
        "Модем телеметрии",
      ],
    },
    {
      price: "27 184 000 so'm",
      oldPrice: "33 584 000 so'm",
      delivery: t("deliveryDays"),
      img: machine3,
      features: [
        "Кофемашина Jetinno JL30",
        "Мебельная стойка",
        "Два диспенсера",
        "Терминал банковской оплаты",
        "Модем телеметрии",
      ],
    },
    {
      price: "33 584 000 so'm",
      oldPrice: null,
      delivery: t("deliveryDays15"),
      img: machine4,
      features: [
        "Металлический каркас",
        "Электрика",
        "Утепление",
        "Регулируемые ножки",
        "Модем телеметрии",
      ],
    },
  ];

  return (
    <div className={styles.catalog}>
      {machines.map((machine, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.left}>
            <p className={styles.title}>{t("priceFrom")}</p>
            <h2 className={styles.price}>{machine.price}</h2>
            {machine.oldPrice && <p className={styles.oldPrice}>{machine.oldPrice}</p>}
            <div className={styles.features}>
              {machine.features.map((f, i) => (
                <div key={i} className={styles.feature}>
                  {f}
                </div>
              ))}
            </div>
            <p className={styles.bonus}>{t("bonus")}</p>
          </div>

          <div className={styles.center}>
            <img src={machine.img} alt="Кофемашина" />
          </div>

          <div className={styles.right}>
            <p className={styles.delivery}>
              {t("deliveryLabel")} <br />
              <span>{machine.delivery}</span>
            </p>
            <button className={styles.button} onClick={scrollToForm}>
              {t("buyCoffee")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CoffeeCatalog;

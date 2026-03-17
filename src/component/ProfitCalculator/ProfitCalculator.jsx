import { useState, useMemo } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import styles from "./ProfitCalculator.module.css";

const AVG_COFFEE_STATION_COST = 55000000; // so'm

function ProfitCalculator() {
  const { t } = useLanguage();

  const [rent, setRent] = useState(300000);
  const [service, setService] = useState(0);
  const [price, setPrice] = useState(20000);
  const [cups, setCups] = useState(20);
  const [machines, setMachines] = useState(1);

  const ranges = {
    rent: { min: 0, max: 3000000, step: 50000 },
    service: { min: 0, max: 1000000, step: 50000 },
    price: { min: 10000, max: 40000, step: 500 },
    cups: { min: 5, max: 100, step: 1 },
    machines: { min: 1, max: 15, step: 1 },
  };

  const { monthlyProfit, yearlyProfit, paybackMonths } = useMemo(() => {
    const revenue = price * cups * 30 * machines;
    const ingredientCost = revenue * 0.35;
    const profit = revenue - ingredientCost - rent - service;
    const yearly = profit * 12;
    const payback = profit > 0 ? Math.ceil(machines * AVG_COFFEE_STATION_COST / profit) : null;
    return { monthlyProfit: profit, yearlyProfit: yearly, paybackMonths: payback };
  }, [rent, service, price, cups, machines]);

  const formatNumber = (n) => `${Number(n).toLocaleString("uz-UZ")} so'm`;

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t("calcTitle")}</h2>

      <div className={styles.calculator}>
        <div className={styles.controls}>
          <div className={styles.control}>
            <label>{t("calcRent")}</label>
            <input
              type="range"
              min={ranges.rent.min}
              max={ranges.rent.max}
              step={ranges.rent.step}
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
            />
            <span>{formatNumber(rent)}</span>
          </div>

          <div className={styles.control}>
            <label>{t("calcService")}</label>
            <input
              type="range"
              min={ranges.service.min}
              max={ranges.service.max}
              step={ranges.service.step}
              value={service}
              onChange={(e) => setService(Number(e.target.value))}
            />
            <span>{formatNumber(service)}</span>
          </div>

          <div className={styles.control}>
            <label>{t("calcPrice")}</label>
            <input
              type="range"
              min={ranges.price.min}
              max={ranges.price.max}
              step={ranges.price.step}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <span>{formatNumber(price)}</span>
          </div>

          <div className={styles.control}>
            <label>{t("calcCups")}</label>
            <input
              type="range"
              min={ranges.cups.min}
              max={ranges.cups.max}
              step={ranges.cups.step}
              value={cups}
              onChange={(e) => setCups(Number(e.target.value))}
            />
            <span>{cups}</span>
          </div>

          <div className={styles.control}>
            <label>{t("calcMachines")}</label>
            <input
              type="range"
              min={ranges.machines.min}
              max={ranges.machines.max}
              step={ranges.machines.step}
              value={machines}
              onChange={(e) => setMachines(Number(e.target.value))}
            />
            <span>{machines}</span>
          </div>
        </div>

        <div className={styles.result}>
          <h3>{t("calcMonthly")}</h3>
          <h1 className={monthlyProfit < 0 ? styles.negative : ""}>
            {formatNumber(monthlyProfit)}
          </h1>
          <p>{t("calcYearly")}</p>
          <h2>{formatNumber(yearlyProfit)}</h2>
          {paybackMonths !== null && monthlyProfit > 0 && (
            <p className={styles.payback}>
              {t("calcPayback")}: <strong>{paybackMonths}</strong> {t("calcMonths")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfitCalculator;

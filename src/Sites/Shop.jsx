import { useState } from "react";
import "./../styles/Shop.css";

function Shop({ setShowShop, upgrades, setUpgrades, score, setScore }) {
  const [error, setError] = useState(null);

  const shopData = [
    {
      name: "Ulepszenia",
      desc: "Ulepszenia trwale ułatwiają rozgrywkę",
      offers: [
        {
          id: "upg_click_1",
          name: "Kliknięcie +1",
          desc: "Do każdego twojego kliknięcia dodawane jest 1 dodatkowe.",
          basePrice: 1000,
        },
        {
          id: "upg_click_2",
          name: "Kliknięcie +2",
          desc: "Do każdego twojego kliknięcia dodawane są 2 dodatkowe.",
          basePrice: 5000,
        },
        {
          id: "upg_click_3",
          name: "Kliknięcie +5",
          desc: "Do każdego twojego kliknięcia dodawane jest 5 dodatkowych.",
          basePrice: 25000,
        },
        {
          id: "upg_crit_chance_1",
          name: "Szczęśliwy Traf",
          desc: "+10% szansy na krytyczne kliknięcie (wartość x5).",
          basePrice: 15000,
        },
        {
          id: "upg_crit_chance_2",
          name: "Szczęśliwy Traf 2",
          desc: "+15% szansy na krytyczne kliknięcie (wartość x5).",
          basePrice: 67000,
        },
      ],
    },
    {
      name: "Autoklikacze",
      desc: "Ty odpoczywasz, kliknięcia same się zdobywają",
      offers: [
        {
          id: "auto_clicker_1",
          name: "Podstawowy autoklikacz",
          desc: "Klika automatycznie 1 raz na sekundę.",
          basePrice: 10000,
        },
      ],
    },
  ];

  const buyItem = (offer) => {
    if (!offer) return;

    if (score >= offer.basePrice) {
      setScore((prev) => {
        const newScore = prev - offer.basePrice;
        localStorage.setItem("score", btoa(newScore.toString()));
        return newScore;
      });

      setUpgrades((prev) => {
        const newUpgrades = [...prev, offer.id];
        localStorage.setItem("upgrades", btoa(JSON.stringify(newUpgrades)));
        return newUpgrades;
      });

      if (offer.id === "auto_clicker_1") {
        localStorage.setItem("auto_clicker_1_active", btoa("true"));
      }

      setError(null);
    } else {
      setError("Masz za mało kliknięć");
    }
  };

  return (
    <>
      <div className="shop-back-overlay" onClick={() => setShowShop(false)} />
      <div className="shop">
        {shopData.map((row, i) => (
          <div key={i} className="shop-row">
            <h2 className="shop-row-title">{row.name}</h2>
            <p className="shop-row-desc">{row.desc}</p>
            <div className="shop-row-offers">
              {row.offers.map((offer, i) => {
                const isBought = upgrades.includes(offer.id);

                return (
                  <div
                    key={i}
                    className={`shop-offer ${isBought ? "is-locked" : ""}`}
                  >
                    <h3 className="shop-offer-name">{offer.name}</h3>
                    <p className="shop-offer-desc">{offer.desc}</p>
                    <span className="shop-offer-price">
                      {offer.basePrice} kliknięć
                    </span>
                    <button
                      className={`shop-offer-button ${isBought ? "bought" : ""}`}
                      onClick={() => !isBought && buyItem(offer)}
                    >
                      {isBought ? "Zakupiono" : "Kup"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Shop;

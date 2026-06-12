import { useState } from "react";
import "./../styles/Shop.css";

function Shop({
  setShowShop,
  upgrades,
  setUpgrades,
  score,
  setScore,
  encryptData,
}) {
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
          basePrice: 500,
        },
        {
          id: "upg_click_2",
          name: "Kliknięcie +2",
          desc: "Do każdego twojego kliknięcia dodawane są 2 dodatkowe.",
          basePrice: 7500,
        },
        {
          id: "upg_click_3",
          name: "Kliknięcie +5",
          desc: "Do każdego twojego kliknięcia dodawane jest 5 dodatkowych.",
          basePrice: 65000,
        },
        {
          id: "upg_crit_chance_1",
          name: "Szczęśliwy Traf",
          desc: "+10% szansy na krytyczne kliknięcie (wartość x5).",
          basePrice: 20000,
        },
        {
          id: "upg_crit_chance_2",
          name: "Szczęśliwy Traf 2",
          desc: "+15% szansy na krytyczne kliknięcie (wartość x5).",
          basePrice: 150000,
        },
        {
          id: "upg_xp_1",
          name: "XP +1",
          desc: "Do każdego twojego kliknięcia dodawany jest 1 dodatkowy punkt doświadczenia.",
          basePrice: 2000,
        },
        {
          id: "upg_xp_2",
          name: "XP +2",
          desc: "Do każdego twojego kliknięcia dodawane są 2 dodatkowe punkty doświadczenia.",
          basePrice: 18000,
        },
        {
          id: "upg_xp_3",
          name: "XP +5",
          desc: "Do każdego twojego kliknięcia dodawane jest 5 dodatkowych punktów doświadczenia.",
          basePrice: 110000,
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
          basePrice: 15000,
        },
      ],
    },
  ];

  const buyItem = (offer) => {
    if (!offer) return;

    if (score >= offer.basePrice) {
      setScore((prev) => {
        const newScore = prev - offer.basePrice;
        localStorage.setItem("score", encryptData(newScore.toString()));
        return newScore;
      });

      setUpgrades((prev) => {
        const newUpgrades = [...prev, offer.id];
        localStorage.setItem("upgrades", encryptData(JSON.stringify(newUpgrades)));
        return newUpgrades;
      });

      if (offer.id === "auto_clicker_1") {
        localStorage.setItem("auto_clicker_1_active", encryptData("true"));
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
        <span className="balance">
          Stan konta: <span>{score} kliknięć</span>
        </span>
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

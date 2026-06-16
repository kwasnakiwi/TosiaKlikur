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
          basePrice: 300,
        },
        {
          id: "upg_click_2",
          name: "Kliknięcie +2",
          desc: "Do każdego twojego kliknięcia dodawane są 2 dodatkowe.",
          basePrice: 2500,
        },
        {
          id: "upg_click_3",
          name: "Kliknięcie +5",
          desc: "Do każdego twojego kliknięcia dodawane jest 5 dodatkowych.",
          basePrice: 15000,
        },
        {
          id: "upg_crit_chance_1",
          name: "Szczęśliwy Traf",
          desc: "+10% szansy na krytyczne kliknięcie (wartość x5).",
          basePrice: 6000,
        },
        {
          id: "upg_crit_chance_2",
          name: "Szczęśliwy Traf 2",
          desc: "+15% szansy na krytyczne kliknięcie (wartość x5).",
          basePrice: 35000,
        },
        {
          id: "upg_xp_1",
          name: "XP +1",
          desc: "Do każdego twojego kliknięcia dodawany jest 1 dodatkowy punkt doświadczenia.",
          basePrice: 800,
        },
        {
          id: "upg_xp_2",
          name: "XP +2",
          desc: "Do każdego twojego kliknięcia dodawane są 2 dodatkowe punkty doświadczenia.",
          basePrice: 5000,
        },
        {
          id: "upg_xp_3",
          name: "XP +5",
          desc: "Do każdego twojego kliknięcia dodawane jest 5 dodatkowych punktów doświadczenia.",
          basePrice: 25000,
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
          basePrice: 8000,
        },
        {
          id: "auto_clicker_2",
          name: "Zaawansowany autoklikacz",
          desc: "Klika automatycznie 5 razy na sekundę.",
          basePrice: 30000,
        },
        {
          id: "auto_clicker_3",
          name: "Epicki autoklikacz",
          desc: "Klika automatycznie 10 razy na sekundę.",
          basePrice: 75000,
        },
        {
          id: "auto_clicker_4",
          name: "Mistrzowski autoklikacz",
          desc: "Klika automatycznie 20 razy na sekundę.",
          basePrice: 150000,
        },
      ],
    },
    {
      name: "Przepustki",
      desc: "Odblokuj tajne sekcje i ukryte przywileje",
      offers: [
        {
          id: "access_misia_corner",
          name: 'Karnet do "Misia corner"',
          desc: "Zyskaj ekskluzywne prawo wejścia do strefy Misia corner!",
          basePrice: 100000,
        },
      ],
    },
  ];

  const buyItem = (offer) => {
    if (!offer) return;

    if (score >= offer.basePrice) {
      setScore((prev) => {
        const newScore = prev - offer.basePrice;
        localStorage.setItem("score", encryptData(newScore));
        return newScore;
      });

      setUpgrades((prev) => {
        const newUpgrades = [...prev, offer.id];
        localStorage.setItem(
          "upgrades",
          encryptData(JSON.stringify(newUpgrades)),
        );
        return newUpgrades;
      });

      if (offer.id.startsWith("auto_clicker_")) {
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
        <header className="shop-header">
          <h1 className="shop-title">Sklep</h1>
          <span className="balance">
            Stan konta: <span>{score.toLocaleString("pl-PL")} kliknięć</span>
          </span>
        </header>
        {error && (
          <div
            className="shop-error-msg"
            style={{ color: "tomato", textAlign: "center", fontWeight: "bold" }}
          >
            {error}
          </div>
        )}
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
                      {offer.basePrice.toLocaleString("pl-PL")} kliknięć
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

import "./../styles/Shop.css";

function Shop({ setShowShop }) {
  const shopData = [
    {
      name: "Boostery",
      desc: "Uczulają palce na zyski – natychmiastowe zwiększenie siły kliknięć",
      offers: [
        {
          id: "click_2x",
          name: "Podwójne Kliknięcie",
          desc: "Każde Twoje kliknięcie generuje 2x więcej punktów.",
          basePrice: 100,
          multiplier: 2,
        },
        {
          id: "click_5x",
          name: "Mega Klik",
          desc: "Zwiększa siłę pojedynczego kliknięcia o 5x.",
          basePrice: 1500,
          multiplier: 5,
        },
        {
          id: "crit_chance",
          name: "Szczęśliwy Traf",
          desc: "+5% szansy na krytyczne kliknięcie (wartość x10).",
          basePrice: 500,
          maxLevel: 10,
        },
      ],
    },
    {
      name: "Autoklikacze",
      desc: "Zatrudnij pomocników, którzy klikają za Ciebie, nawet gdy odpoczywasz",
      offers: [
        {
          id: "auto_cursor",
          name: "Zautomatyzowany Kursor",
          desc: "Klika automatycznie 1 raz na sekundę.",
          basePrice: 50,
          cps: 1,
        },
        {
          id: "auto_bot",
          name: "ClickBot v1.0",
          desc: "Szybki algorytm generujący 10 kliknięć na sekundę.",
          basePrice: 800,
          cps: 10,
        },
        {
          id: "auto_ai",
          name: "Kwantowa Sztuczna Inteligencja",
          desc: "Generuje potężną ilość 150 kliknięć na sekundę.",
          basePrice: 12000,
          cps: 150,
        },
      ],
    },
    {
      name: "Inwestycje",
      desc: "Ulepszenia pasywnego przychodu i bonusy długoterminowe",
      offers: [
        {
          id: "passive_bank",
          name: "Lokalny Bank",
          desc: "Zwiększa ogólny pasywny przychód z Autoklikaczy o 10%.",
          basePrice: 3000,
          perk: "cps_boost_10",
        },
        {
          id: "offline_profit",
          name: "Karnet Nocny",
          desc: "Pozwala zbierać 50% punktów, kiedy aplikacja jest wyłączona.",
          basePrice: 5000,
          maxLevel: 1,
        },
      ],
    },
  ];

  return (
    <>
      <div className="shop-back-overlay" onClick={() => setShowShop(false)} />
      <div className="shop">
        {shopData.map((row, i) => (
          <div key={i} className="shop-row">
            <h2 className="shop-row-title">{row.name}</h2>
            <p className="shop-row-desc">{row.desc}</p>
            <div className="shop-row-offers">
              {row.offers.map((offer, i) => (
                <div key={i} className="shop-offer">
                  <h3 className="shop-offer-name">{offer.name}</h3>
                  <p className="shop-offer-desc">{offer.desc}</p>
                  <span className="shop-offer-price">{offer.basePrice}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Shop;

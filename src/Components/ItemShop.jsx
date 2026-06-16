import "./../styles/ItemShop.css";
import coins from "./../assets/imgs/coins-solid.svg";
import clickPotion from "./../assets/imgs/click_potion.svg";
import xpPotion from "./../assets/imgs/xp_potion.svg";
import critPotion from "./../assets/imgs/crit_potion.svg";
import { useState } from "react";

function ItemShop({
  setShowItemShop,
  items,
  setItems,
  encryptData,
  score,
  setScore,
  boosts,
  setBoosts,
}) {
  const [error, setError] = useState("");
  const shopData = [
    {
      name: "Mikstury",
      desc: "Mikstury dają bonusy na pewien czas.",
      offers: [
        {
          id: "click_potion_1",
          name: "Mikstura Kliknięć x2",
          desc: "Podwaja siłę każdego kliknięcia",
          basePrice: 5000,
          duration: 5 * 60 * 1000,
          img: clickPotion,
          type: "consumable",
          boost: {
            id: "click_boost_1",
            name: "Mnożnik Kliknięć (x2)",
            img: clickPotion,
            type: "click_multiplier",
            value: 2,
          },
        },
        {
          id: "xp_potion_1",
          name: "Mikstura Doświadczenia x2",
          desc: "Podwaja zdobywane punkty doświadczenia",
          basePrice: 3500,
          duration: 5 * 60 * 1000,
          img: xpPotion,
          type: "consumable",
          boost: {
            id: "xp_boost_1",
            name: "Mnożnik XP (x2)",
            img: xpPotion,
            type: "xp_multiplier",
            value: 2,
          },
        },
        {
          id: "crit_potion_1",
          name: "Mikstura Szansy Krytycznej +10%",
          desc: "Dodaje +10% szansy na krytyczne kliknięcie o wartości x5.",
          basePrice: 1500,
          duration: 5 * 60 * 1000,
          img: critPotion,
          type: "consumable",
          boost: {
            id: "crit_boost_1",
            name: "Szansa Krytyczna (+10%)",
            img: critPotion,
            type: "crit_addition",
            value: 0.1,
          },
        },
      ],
    },
  ];

  const formatTime = (ms) => {
    if (ms <= 0) return "0:00";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const paddedMinutes = minutes < 10 && hours > 0 ? `0${minutes}` : minutes;

    if (hours > 0) {
      return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return `${minutes}:${paddedSeconds}`;
  };

  const buyItem = (offer) => {
    if (!offer) return;

    if (score < offer.basePrice) {
      setError("nie stać cie biedaku");
      return;
    }

    setScore((prev) => {
      const newScore = prev - offer.basePrice;
      localStorage.setItem("score", encryptData(newScore));
      return newScore;
    });

    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === offer.id);
      let newItems;

      if (existingItem) {
        newItems = prev.map((item) =>
          item.id === offer.id ? { ...item, amount: item.amount + 1 } : item,
        );
      } else {
        const endTime = Date.now() + offer.duration;
        const newItemBoost = {
          ...offer.boost,
          endTime: endTime,
        };

        const newItem = {
          id: offer.id,
          name: offer.name,
          desc: offer.desc,
          duration: offer.duration,
          img: offer.img,
          type: offer.type,
          boost: newItemBoost,
          amount: 1,
        };

        newItems = [...prev, newItem];
      }

      localStorage.setItem("items", encryptData(newItems));
      return newItems;
    });
  };

  return (
    <>
      <div
        className="shop-back-overlay"
        onClick={() => setShowItemShop(false)}
      />
      <div className="shop">
        <header className="shop-header">
          <h1 className="shop-title">Sklep z przedmiotami</h1>
          <span className="balance">
            Stan konta: <span>{score.toLocaleString("pl-PL")} kliknięć</span>
          </span>
        </header>
        {shopData.map((row, i) => (
          <div key={i} className="shop-row">
            <h2 className="shop-row-title">{row.name}</h2>
            <p className="shop-row-desc">{row.desc}</p>
            <div className="shop-row-offers">
              {row.offers.map((offer, i) => {
                return (
                  <div key={i} className="shop-offer">
                    <img
                      className="shop-offer-img item"
                      src={offer.img}
                      alt=""
                    />
                    <h3 className="shop-offer-name">{offer.name}</h3>
                    <p className="shop-offer-desc">{offer.desc}</p>
                    <span
                      className="shop-offer-price"
                      style={{ color: "cornflowerblue", marginBottom: "5px" }}
                    >
                      Czas trwania: {formatTime(offer.duration)}
                    </span>
                    {items.find((item) => item.id === offer.id)?.amount && (
                      <span
                        className="shop-offer-price"
                        style={{ color: "cornflowerblue", marginBottom: "5px" }}
                      >
                        {items.find((item) => item.id === offer.id)?.amount}
                      </span>
                    )}
                    <span className="shop-offer-price">
                      {offer.basePrice.toLocaleString("pl-PL")} kliknięć
                    </span>
                    <button
                      className="shop-offer-button"
                      onClick={() => buyItem(offer)}
                    >
                      Kup
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

export default ItemShop;

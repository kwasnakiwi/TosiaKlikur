import "./../styles/Skins.css";
import tosia1 from "./../assets/tosia_imgs/tosia1.jpg";
import tosia2 from "./../assets/tosia_imgs/tosia2.jpg";
import tosia3 from "./../assets/tosia_imgs/tosia3.jpg";
import tosia4 from "./../assets/tosia_imgs/tosia4.jpg";
import tosia5 from "./../assets/tosia_imgs/tosia5.jpg";
import tosia6 from "./../assets/tosia_imgs/tosia6.jpg";
import tosiaRozbierajSie from "./../assets/tosia_imgs/tosia_rozbieraj_sie.png";
import { useState } from "react";

function Skins({
  setShowSkins,
  score,
  setScore,
  skins,
  setSkins,
  currentSkin,
  setCurrentSkin,
}) {
  const [error, setError] = useState("");
  const skinsData = [
    {
      name: "Skiny podstawowe",
      desc: "Zmień wygląd Tosi!",
      offers: [
        {
          id: "skin_tosia1",
          name: "Tosia 1",
          desc: "Poprostu inna Tosia",
          img: tosia1,
          price: 0,
          equipped: currentSkin === "skin_tosia1",
          type: "skin",
        },
        {
          id: "skin_tosia2",
          name: "Tosia 2",
          desc: "Poprostu inna Tosia",
          img: tosia2,
          price: 1000,
          equipped: currentSkin === "skin_tosia2",
          type: "skin",
        },
        {
          id: "skin_tosia3",
          name: "Tosia 3",
          desc: "Poprostu inna Tosia",
          img: tosia3,
          price: 1000,
          equipped: currentSkin === "skin_tosia3",
          type: "skin",
        },
        {
          id: "skin_tosia4",
          name: "Tosia 4",
          desc: "Poprostu inna Tosia",
          img: tosia4,
          price: 1000,
          equipped: currentSkin === "skin_tosia4",
          type: "skin",
        },
        {
          id: "skin_tosia5",
          name: "Tosia 5",
          desc: "Poprostu inna Tosia",
          img: tosia5,
          price: 1000,
          equipped: currentSkin === "skin_tosia5",
          type: "skin",
        },
        {
          id: "skin_tosia6",
          name: "Tosia 6",
          desc: "Poprostu inna Tosia",
          img: tosia6,
          price: 1000,
          equipped: currentSkin === "skin_tosia6",
          type: "skin",
        },
      ],
    },
    {
      name: "Skiny dziabonkowe",
      desc: "Zmień wygląd Tosi na jakiegoś dziabonka!",
      offers: [
        {
          id: "skin_tosia_rozbieraj_sie",
          name: "Tosia \"rozbieraj się\"",
          desc: "Czy to wgl jest Tosia?",
          img: tosiaRozbierajSie,
          price: 5000,
          equipped: currentSkin === "skin_tosia_rozbieraj_sie",
          type: "skin",
        },
      ],
    },
  ];

  const buyItem = (offer) => {
    if (score >= offer.price) {
      setSkins((prev) => {
        const newSkins = [...prev, offer.id];
        localStorage.setItem("skins", btoa(JSON.stringify(newSkins)));
        return newSkins;
      });
      setScore((prev) => {
        const newScore = prev - offer.price;
        localStorage.setItem("score", btoa(newScore));
        return newScore;
      });
    } else {
      setError("Nie stać cię żydzie");
    }
  };

  const handleEquip = (offer) => {
    if (skins.includes(offer.id)) {
      setCurrentSkin((prev) => {
        const newSkin = offer.id;
        localStorage.setItem("current_skin", btoa(offer.id));
        return newSkin;
      });
    }
  };

  return (
    <>
      <div className="shop-back-overlay" onClick={() => setShowSkins(false)} />
      <div className="shop">
        {skinsData.map((row, i) => (
          <div key={i} className="shop-row">
            <h2 className="shop-row-title">{row.name}</h2>
            <p className="shop-row-desc">{row.desc}</p>
            <div className="shop-row-offers">
              {row.offers.map((offer, i) => {
                const isBought = skins.includes(offer.id);
                const isEquipped = currentSkin === offer.id;

                return (
                  <div
                    key={i}
                    className={`shop-offer ${isBought ? "is-locked" : ""}`}
                  >
                    <img
                      className="shop-offer-img"
                      src={offer.img}
                      alt={offer.name}
                    />
                    <h3 className="shop-offer-name">{offer.name}</h3>
                    <p className="shop-offer-desc">{offer.desc}</p>
                    <span className="shop-offer-price">
                      {offer.price > 0 ? `${offer.price} kliknięć` : "Za darmo"}
                    </span>
                    <button
                      className={`shop-offer-button ${isEquipped ? "bought" : ""}`}
                      onClick={() =>
                        !isBought ? buyItem(offer) : handleEquip(offer)
                      }
                    >
                      {!isBought ? "Kup" : isEquipped ? "Założony" : "Załóż"}
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

export default Skins;

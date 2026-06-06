import { FaShop as ShopIcon } from "react-icons/fa6";
import title from "./../assets/imgs/tosiaklikur.gif";
import "./../styles/Clicker.css";
import { useEffect, useState } from "react";
import tosia1 from "./../assets/tosia_imgs/tosia1.jpg";
import tosia2 from "./../assets/tosia_imgs/tosia2.jpg";
import tosia3 from "./../assets/tosia_imgs/tosia3.jpg";
import tosia4 from "./../assets/tosia_imgs/tosia4.jpg";
import tosia5 from "./../assets/tosia_imgs/tosia5.jpg";
import tosia6 from "./../assets/tosia_imgs/tosia6.jpg";
import Shop from "./Shop";
import { createPortal } from "react-dom";

function Clicker() {
  const [score, setScore] = useState(
    parseInt(localStorage.getItem("score")) || 0,
  );
  const [tosia, setTosia] = useState(tosia1);
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    if (score >= 1000) setTosia(tosia2);
    if (score >= 5000) setTosia(tosia3);
    if (score >= 10000) setTosia(tosia4);
    if (score >= 25000) setTosia(tosia5);
    if (score >= 100000) setTosia(tosia6);
  }, [score]);

  const addToScore = () => {
    setScore((prev) => prev + 1);

    localStorage.setItem("score", score + 1);
  };

  return (
    <>
      {showShop && <Shop setShowShop={setShowShop} />}
      <div className="main-container">
        <div className="title">
          <img src={title} alt="" />
        </div>
        <div className="side-bar">
          <button onClick={() => setShowShop(true)}>
            <ShopIcon className="side-bar-icon" />
          </button>
        </div>
        <div className="tosia-img">
          <img onClick={addToScore} src={tosia} alt="" />
        </div>
        <div className="score-label">
          <span className="score">{score}</span>
        </div>
      </div>
    </>
  );
}

export default Clicker;

import {
  FaShop as ShopIcon,
  FaArrowPointer as ArrowPointer,
  FaArrowRotateRight as RebirthIcon,
} from "react-icons/fa6";
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
import Rebirths from "./Rebirths";

const getEncryptedScore = () => {
  const saved = localStorage.getItem("score");
  if (!saved) return 0;
  try {
    return parseInt(atob(saved)) || 0;
  } catch (e) {
    return 0;
  }
};

const getEncryptedRebirths = () => {
  const saved = localStorage.getItem("rebirths");
  if (!saved) return 0;
  try {
    return parseInt(atob(saved)) || 0;
  } catch (e) {
    return 0;
  }
};

const getEncryptedUpgrades = () => {
  const saved = localStorage.getItem("upgrades");
  if (!saved) return [];
  try {
    return JSON.parse(atob(saved)) || [];
  } catch (e) {
    return [];
  }
};

const getEncryptedAutoStatus = () => {
  const saved = localStorage.getItem("auto_clicker_1_active");
  if (!saved) return false;
  try {
    return atob(saved) === "true";
  } catch (e) {
    return false;
  }
};

// localStorage.setItem("score", btoa("1000000000"));
// localStorage.setItem("rebirths", btoa("2"));

function Clicker() {
  const [score, setScore] = useState(() => getEncryptedScore());
  const [tosia, setTosia] = useState(tosia1);
  const [showShop, setShowShop] = useState(false);
  const [showRebirths, setShowRebirths] = useState(false);
  const [upgrades, setUpgrades] = useState(() => getEncryptedUpgrades());
  const [autoActive, setAutoActive] = useState(() => getEncryptedAutoStatus());
  const [rebirths, setRebirths] = useState(() => getEncryptedRebirths());
  const [floatingTexts, setFloatingTexts] = useState([]);

  useEffect(() => {
    if (score >= 0) setTosia(tosia1);
    if (score >= 1000) setTosia(tosia2);
    if (score >= 5000) setTosia(tosia3);
    if (score >= 10000) setTosia(tosia4);
    if (score >= 25000) setTosia(tosia5);
    if (score >= 100000) setTosia(tosia6);
  }, [score]);

  useEffect(() => {
    const hasAutoClicker = upgrades.includes("auto_clicker_1");
    if (hasAutoClicker && autoActive) {
      const interval = setInterval(() => {
        addToScore();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [upgrades, autoActive, rebirths]);

  const getClickAddition = () => {
    let addition = 1;
    let isCrit = false;
    let critChance = 0;

    if (upgrades.includes("upg_click_1")) addition += 1;
    if (upgrades.includes("upg_click_2")) addition += 2;
    if (upgrades.includes("upg_crit_chance_1")) critChance += 0.1;
    if (rebirths >= 1) addition *= 2;
    if (rebirths >= 2) critChance += 0.1;

    if (Math.random() < critChance) {
      isCrit = true;
      addition *= 5;
    }

    return { addition, isCrit };
  };

  const addToScore = () => {
    const currentAdditionData = getClickAddition();
    const currentAddition = currentAdditionData.addition;

    const marginX = window.innerWidth * 0.1;
    const marginY = window.innerHeight * 0.1;

    const randomX = marginX + Math.random() * (window.innerWidth - marginX * 2);
    const randomY =
      marginY + Math.random() * (window.innerHeight - marginY * 2);

    const newText = {
      id: Date.now() + Math.random(),
      x: randomX,
      y: randomY,
      value: currentAddition,
      isCrit: currentAdditionData.isCrit,
    };

    setFloatingTexts((prev) => [...prev, newText]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((text) => text.id !== newText.id));
    }, 1000);

    setScore((prev) => {
      const newScore = prev + currentAddition;
      localStorage.setItem("score", btoa(newScore.toString()));
      return newScore;
    });
  };

  const handleAutoClickerChange = () => {
    const hasAutoClicker = upgrades.includes("auto_clicker_1");
    if (!hasAutoClicker) return;

    setAutoActive((prev) => {
      const nextState = !prev;
      localStorage.setItem("auto_clicker_1_active", btoa(nextState.toString()));
      return nextState;
    });
  };

  return (
    <>
      {showShop && (
        <Shop
          setShowShop={setShowShop}
          upgrades={upgrades}
          setUpgrades={setUpgrades}
          score={score}
          setScore={setScore}
        />
      )}
      {showRebirths && (
        <Rebirths
          setShowRebirths={setShowRebirths}
          rebirths={rebirths}
          setRebirths={setRebirths}
          score={score}
          setScore={setScore}
        />
      )}
      <div className="main-container">
        <div className="version-box">
          <p className="version">BETA 1.1.0</p>
          <p className="added-things">+ System rebirthów (2 pierwsze)</p>
        </div>
        <div className="title">
          <img src={title} alt="" />
        </div>
        <div className="side-bar">
          <button onClick={() => setShowShop(true)} title="sklep">
            <ShopIcon className="side-bar-icon" />
          </button>
          <button onClick={handleAutoClickerChange} title="autoklikacz">
            <ArrowPointer className="side-bar-icon blue" />
            <span
              className={`auto-clicker-status ${
                upgrades.includes("auto_clicker_1") && autoActive
                  ? "active"
                  : "inactive"
              }`}
            />
          </button>
          <button onClick={() => setShowRebirths(true)} title="rebirth">
            <RebirthIcon className="side-bar-icon green" />
          </button>
        </div>
        <div className="tosia-img">
          <img onClick={(e) => addToScore(e)} src={tosia} alt="" />
        </div>
        {floatingTexts.map((text) => (
          <span
            key={text.id}
            className="floating-click-text"
            style={{
              top: text.y,
              left: text.x,
              color: text.isCrit ? "tomato" : undefined,
              fontSize: text.isCrit ? "3rem" : undefined,
            }}
          >
            +{text.value}
          </span>
        ))}
        <div className="score-label">
          <span className="score">{score}</span>
        </div>
      </div>
    </>
  );
}

export default Clicker;

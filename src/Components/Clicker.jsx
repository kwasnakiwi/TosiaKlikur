import {
  FaShop as ShopIcon,
  FaArrowPointer as ArrowPointer,
  FaArrowRotateRight as RebirthIcon,
  FaShirt as ShirtIcon,
} from "react-icons/fa6";
import title from "./../assets/imgs/tosiaklikur.gif";
import "./../styles/Clicker.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { encryptData, decryptData } from "./crypto"; // Import Twoich bezpiecznych funkcji
import Shop from "./Shop";
import Rebirths from "./Rebirths";
import tosia1 from "./../assets/tosia_imgs/tosia1.webp";
import tosia2 from "./../assets/tosia_imgs/tosia2.webp";
import tosia3 from "./../assets/tosia_imgs/tosia3.webp";
import tosia4 from "./../assets/tosia_imgs/tosia4.webp";
import tosia5 from "./../assets/tosia_imgs/tosia5.webp";
import tosia6 from "./../assets/tosia_imgs/tosia6.webp";
import tosiaRozbierajSie from "./../assets/tosia_imgs/tosia_rozbieraj_sie.webp";
import tosiaMisia from "./../assets/tosia_imgs/tosia-misia.webp";
import SettingsIcon from "./../assets/imgs/sett.svg";
import Skins from "./Skins";
import LevelBar from "./LevelBar";
import Settings from "./Settings";

const getEncryptedScore = () => {
  const saved = localStorage.getItem("score");
  return saved ? Number(decryptData(saved, 0)) : 0;
};

const getEncryptedRebirths = () => {
  const saved = localStorage.getItem("rebirths");
  return saved ? Number(decryptData(saved, 0)) : 0;
};

const getEncryptedUpgrades = () => {
  const saved = localStorage.getItem("upgrades");
  return saved ? JSON.parse(decryptData(saved, "[]")) : [];
};

const getEncryptedAutoStatus = () => {
  const saved = localStorage.getItem("auto_clicker_1_active");
  if (!saved) return false;
  return decryptData(saved, "false") === "true";
};

const getEncryptedSkins = () => {
  const saved = localStorage.getItem("skins");
  return saved
    ? JSON.parse(decryptData(saved, '["skin_tosia1"]'))
    : ["skin_tosia1"];
};

const getEncryptedCurrentSkin = () => {
  const saved = localStorage.getItem("current_skin");
  return saved ? decryptData(saved, "skin_tosia1") : "skin_tosia1";
};

const getEncryptedXp = () => {
  const saved = localStorage.getItem("xp");
  return saved ? Number(decryptData(saved, 0)) : 0;
};

const getEncryptedSettings = () => {
  const saved = localStorage.getItem("settings");
  if (!saved) return [];
  try {
    return JSON.parse(saved); // Ustawienia zostawiamy jawne dla wygody użytkownika
  } catch (e) {
    return [];
  }
};

const CURRENT_VERSION = "BETA 1.4.2";

if (localStorage.getItem("game_version") !== CURRENT_VERSION) {
  localStorage.removeItem("score");
  localStorage.removeItem("xp");
  localStorage.removeItem("upgrades");
  localStorage.removeItem("rebirths");
  localStorage.removeItem("auto_clicker_1_active");
  localStorage.removeItem("skins");
  localStorage.removeItem("current_skin");

  localStorage.setItem("game_version", CURRENT_VERSION);
}

function Clicker() {
  const [score, setScore] = useState(() => getEncryptedScore());
  const [tosia, setTosia] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showRebirths, setShowRebirths] = useState(false);
  const [upgrades, setUpgrades] = useState(() => getEncryptedUpgrades());
  const [autoActive, setAutoActive] = useState(() => getEncryptedAutoStatus());
  const [rebirths, setRebirths] = useState(() => getEncryptedRebirths());
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [showSkins, setShowSkins] = useState(false);
  const [skins, setSkins] = useState(() => getEncryptedSkins());
  const [currentSkin, setCurrentSkin] = useState(() =>
    getEncryptedCurrentSkin(),
  );
  const [xp, setXp] = useState(() => getEncryptedXp());
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => getEncryptedSettings());
  const saveTimeoutRef = useRef(null);
  const scoreRef = useRef(score);
  const xpRef = useRef(xp);
  const lastClickTime = useRef(0);

  // Synchronizacja refów z aktualnym stanem, aby kolejka zapisu zawsze miała świeże dane
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    xpRef.current = xp;
  }, [xp]);

  const queueSaveToLocalStorage = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem("score", encryptData(scoreRef.current));
      localStorage.setItem("xp", encryptData(xpRef.current));
    }, 1000);
  }, []);

  const getClickAddition = useCallback(() => {
    let addition = 1;
    let isCrit = false;
    let critChance = 0;
    let xpAddition = 1;

    if (upgrades.includes("upg_click_1")) addition += 1;
    if (upgrades.includes("upg_click_2")) addition += 2;
    if (upgrades.includes("upg_click_3")) addition += 5;

    if (upgrades.includes("upg_xp_1")) xpAddition += 1;
    if (upgrades.includes("upg_xp_2")) xpAddition += 2;
    if (upgrades.includes("upg_xp_3")) xpAddition += 5;

    if (upgrades.includes("upg_crit_chance_1")) critChance += 0.1;
    if (upgrades.includes("upg_crit_chance_2")) critChance += 0.15;

    if (rebirths >= 1) addition *= 2;
    if (rebirths >= 2) critChance += 0.1;

    if (Math.random() < critChance) {
      isCrit = true;
      addition *= 5;
      xpAddition *= 5;
    }

    return { addition, isCrit, xpAddition };
  }, [upgrades, rebirths]);

  const addToScore = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current < 40) return;
    lastClickTime.current = now;

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
      xpValue: currentAdditionData.xpAddition,
      isCrit: currentAdditionData.isCrit,
    };

    setFloatingTexts((prev) => [...prev, newText]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((text) => text.id !== newText.id));
    }, 800);

    // Aktualizujemy stany gry bezpiecznie
    setScore((prev) => prev + currentAddition);
    setXp((prev) => prev + currentAdditionData.xpAddition);

    // Wywołujemy bezpieczny zapis z refów, które zsynchronizują się w useEffect
    queueSaveToLocalStorage();
  }, [getClickAddition, queueSaveToLocalStorage]);

  useEffect(() => {
    const hasAutoClicker = upgrades.includes("auto_clicker_1");
    if (hasAutoClicker && autoActive) {
      const interval = setInterval(() => {
        addToScore();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [upgrades, autoActive, addToScore]);

  useEffect(() => {
    setTosia(() => {
      switch (currentSkin) {
        case "skin_tosia1":
          return tosia1;
        case "skin_tosia2":
          return tosia2;
        case "skin_tosia3":
          return tosia3;
        case "skin_tosia4":
          return tosia4;
        case "skin_tosia5":
          return tosia5;
        case "skin_tosia6":
          return tosia6;
        case "skin_tosia_rozbieraj_sie":
          return tosiaRozbierajSie;
        case "skin_tosia_misia":
          return tosiaMisia;
        default:
          return tosia1;
      }
    });
  }, [currentSkin]);

  const isMounted = useRef(false);

  useEffect(() => {
    const handleLevelRewards = (newLevel) => {
      const savedRewards = localStorage.getItem("claimed_rewards");
      let claimedRewards = savedRewards
        ? JSON.parse(decryptData(savedRewards, "[]"))
        : [];

      if (claimedRewards.includes(newLevel)) return;

      let rewardAmount = 0;
      if (newLevel === 2) rewardAmount = 5000;
      if (newLevel === 5) rewardAmount = 15000;
      if (newLevel === 10) rewardAmount = 50000;

      if (rewardAmount > 0) {
        claimedRewards.push(newLevel);
        localStorage.setItem(
          "claimed_rewards",
          encryptData(JSON.stringify(claimedRewards)),
        );

        setScore((prev) => {
          const nScore = prev + rewardAmount;
          localStorage.setItem("score", encryptData(nScore));
          return nScore;
        });
      }
    };

    let calculatedLevel = 1;
    if (xp >= 1000000) calculatedLevel = 20;
    else if (xp >= 840000) calculatedLevel = 19;
    else if (xp >= 705000) calculatedLevel = 18;
    else if (xp >= 585000) calculatedLevel = 17;
    else if (xp >= 480000) calculatedLevel = 16;
    else if (xp >= 390000) calculatedLevel = 15;
    else if (xp >= 315000) calculatedLevel = 14;
    else if (xp >= 250000) calculatedLevel = 13;
    else if (xp >= 195000) calculatedLevel = 12;
    else if (xp >= 150000) calculatedLevel = 11;
    else if (xp >= 115000) calculatedLevel = 10;
    else if (xp >= 85000) calculatedLevel = 9;
    else if (xp >= 60000) calculatedLevel = 8;
    else if (xp >= 40000) calculatedLevel = 7;
    else if (xp >= 25000) calculatedLevel = 6;
    else if (xp >= 15000) calculatedLevel = 5;
    else if (xp >= 8000) calculatedLevel = 4;
    else if (xp >= 3500) calculatedLevel = 3;
    else if (xp >= 1000) calculatedLevel = 2;

    if (calculatedLevel > level) {
      setLevel(calculatedLevel);
      handleLevelRewards(calculatedLevel);

      if (isMounted.current) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000);
      }
    }

    isMounted.current = true;
  }, [xp, level, score]);

  const handleAutoClickerChange = () => {
    const hasAutoClicker = upgrades.includes("auto_clicker_1");
    if (!hasAutoClicker) return;

    setAutoActive((prev) => {
      const nextState = !prev;
      localStorage.setItem(
        "auto_clicker_1_active",
        encryptData(nextState.toString()),
      );
      return nextState;
    });
  };

  const showClickEffects =
    settings.find((sett) => sett.id === "sett_show_click_effects")?.value ??
    true;
  const showLevelBar =
    settings.find((sett) => sett.id === "sett_show_level_bar")?.value ?? true;

  return (
    <>
      {showShop && (
        <Shop
          setShowShop={setShowShop}
          upgrades={upgrades}
          setUpgrades={setUpgrades}
          score={score}
          setScore={setScore}
          encryptData={encryptData}
        />
      )}
      {showSkins && (
        <Skins
          setShowSkins={setShowSkins}
          skins={skins}
          setSkins={setSkins}
          score={score}
          setScore={setScore}
          currentSkin={currentSkin}
          setCurrentSkin={setCurrentSkin}
          encryptData={encryptData}
        />
      )}
      {showRebirths && (
        <Rebirths
          setShowRebirths={setShowRebirths}
          rebirths={rebirths}
          setRebirths={setRebirths}
          score={score}
          setScore={setScore}
          setUpgrades={setUpgrades}
          setXp={setXp}
          encryptData={encryptData}
        />
      )}

      {showLevelUp && (
        <div className="level-up-notification">AWANS! POZIOM {level}</div>
      )}

      {showSettings && (
        <Settings
          setShowSettings={setShowSettings}
          settings={settings}
          setSettings={setSettings}
        />
      )}

      <div className="main-container">
        <div className="version-box">
          <p className="version">{CURRENT_VERSION}</p>
          <p className="added-things">
            + Reset progresu znowu (thanks to TYR_dev (frajer))
          </p>
          <p className="added-things">
            + Dodanie kurwa limitu na kliknięcia (thanks to TYR_dev (frajer))
          </p>
        </div>
        <div className="title">
          <img src={title} alt="" />
        </div>
        <div className="side-bar">
          <button onClick={() => setShowShop(true)} title="sklep">
            <ShopIcon className="side-bar-icon" />
          </button>
          <button onClick={() => setShowSkins(true)} title="skiny">
            <ShirtIcon className="side-bar-icon red" />
          </button>
          <button onClick={handleAutoClickerChange} title="autoklikacz">
            <ArrowPointer className="side-bar-icon blue" />
            <span
              className={`auto-clicker-status ${upgrades.includes("auto_clicker_1") && autoActive ? "active" : "inactive"}`}
            />
          </button>
          <button onClick={() => setShowRebirths(true)} title="rebirth">
            <RebirthIcon className="side-bar-icon green" />
          </button>
          <button onClick={() => setShowSettings(true)} title="ustawienia">
            <img
              src={SettingsIcon}
              className="side-bar-icon lightblue"
              alt=""
            />
          </button>
        </div>
        <div className="tosia-img">
          <img
            className={!showClickEffects ? "tosia-img__no-effects" : ""}
            onClick={addToScore}
            src={tosia}
            alt=""
          />
        </div>
        {showClickEffects &&
          floatingTexts.map((text) => (
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
              <span style={{ fontSize: "0.9rem", color: "cornflowerblue" }}>
                +{text.xpValue}xp
              </span>
            </span>
          ))}
        <div className="score-label">
          <span className="score">{score}</span>
        </div>
        {showLevelBar && <LevelBar level={level} xp={xp} />}
      </div>
    </>
  );
}

export default Clicker;

import {
  FaShop as ShopIcon,
  FaArrowPointer as ArrowPointer,
  FaArrowRotateRight as RebirthIcon,
  FaShirt as ShirtIcon,
} from "react-icons/fa6";
import title from "./../assets/imgs/tosiaklikur.gif";
import "./../styles/Clicker.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { encryptData, decryptData } from "./crypto";
import Shop from "./Shop";
import Rebirths from "./Rebirths";
import tosia1 from "./../assets/tosia_imgs/tosia1.webp";
import tosia2 from "./../assets/tosia_imgs/tosia2.webp";
import tosia3 from "./../assets/tosia_imgs/tosia3.webp";
import tosia4 from "./../assets/tosia_imgs/tosia4.webp";
import tosia5 from "./../assets/tosia_imgs/tosia5.webp";
import tosia6 from "./../assets/tosia_imgs/tosia6.webp";
import tyrosia from "./../assets/tosia_imgs/tyrosia.webp";
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
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};

const CURRENT_VERSION = "BETA 1.4.5";

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
  const isMounted = useRef(false);

  if (localStorage.getItem("game_version") !== CURRENT_VERSION) {
    localStorage.clear();

    localStorage.setItem("game_version", CURRENT_VERSION);
  }

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

  const processScoreGain = useCallback(() => {
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

    setScore((prev) => prev + currentAddition);
    setXp((prev) => prev + currentAdditionData.xpAddition);

    queueSaveToLocalStorage();
  }, [getClickAddition, queueSaveToLocalStorage]);

  const addToScore = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current < 50) return;
    lastClickTime.current = now;

    processScoreGain();
  }, [processScoreGain]);

  useEffect(() => {
    const hasAuto1 = upgrades.includes("auto_clicker_1");
    const hasAuto2 = upgrades.includes("auto_clicker_2");
    const hasAuto3 = upgrades.includes("auto_clicker_3");
    const hasAuto4 = upgrades.includes("auto_clicker_4");

    if (autoActive && (hasAuto1 || hasAuto2 || hasAuto3 || hasAuto4)) {
      let delay = 1000;

      if (hasAuto4) {
        delay = 50;
      } else if (hasAuto3) {
        delay = 100;
      } else if (hasAuto2) {
        delay = 200;
      }

      const interval = setInterval(() => {
        processScoreGain();
      }, delay);
      return () => clearInterval(interval);
    }
  }, [upgrades, autoActive, processScoreGain]);

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
        case "skin_tyrosia":
          return tyrosia;
        default:
          return tosia1;
      }
    });
  }, [currentSkin]);

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
    if (xp >= 1000000) calculatedLevel = 100;
    else if (xp >= 985000) calculatedLevel = 99;
    else if (xp >= 970000) calculatedLevel = 98;
    else if (xp >= 955000) calculatedLevel = 97;
    else if (xp >= 940000) calculatedLevel = 96;
    else if (xp >= 925000) calculatedLevel = 95;
    else if (xp >= 910000) calculatedLevel = 94;
    else if (xp >= 895000) calculatedLevel = 93;
    else if (xp >= 880000) calculatedLevel = 92;
    else if (xp >= 865000) calculatedLevel = 91;
    else if (xp >= 850000) calculatedLevel = 90;
    else if (xp >= 835000) calculatedLevel = 89;
    else if (xp >= 820000) calculatedLevel = 88;
    else if (xp >= 805000) calculatedLevel = 87;
    else if (xp >= 790000) calculatedLevel = 86;
    else if (xp >= 775000) calculatedLevel = 85;
    else if (xp >= 760000) calculatedLevel = 84;
    else if (xp >= 745000) calculatedLevel = 83;
    else if (xp >= 730000) calculatedLevel = 82;
    else if (xp >= 715000) calculatedLevel = 81;
    else if (xp >= 700000) calculatedLevel = 80;
    else if (xp >= 686000) calculatedLevel = 79;
    else if (xp >= 672000) calculatedLevel = 78;
    else if (xp >= 658000) calculatedLevel = 77;
    else if (xp >= 644000) calculatedLevel = 76;
    else if (xp >= 630000) calculatedLevel = 75;
    else if (xp >= 616000) calculatedLevel = 74;
    else if (xp >= 602000) calculatedLevel = 73;
    else if (xp >= 588000) calculatedLevel = 72;
    else if (xp >= 574000) calculatedLevel = 71;
    else if (xp >= 560000) calculatedLevel = 70;
    else if (xp >= 547000) calculatedLevel = 69;
    else if (xp >= 534000) calculatedLevel = 68;
    else if (xp >= 521000) calculatedLevel = 67;
    else if (xp >= 508000) calculatedLevel = 66;
    else if (xp >= 495000) calculatedLevel = 65;
    else if (xp >= 482000) calculatedLevel = 64;
    else if (xp >= 469000) calculatedLevel = 63;
    else if (xp >= 456000) calculatedLevel = 62;
    else if (xp >= 443000) calculatedLevel = 61;
    else if (xp >= 430000) calculatedLevel = 60;
    else if (xp >= 418000) calculatedLevel = 59;
    else if (xp >= 406000) calculatedLevel = 58;
    else if (xp >= 394000) calculatedLevel = 57;
    else if (xp >= 382000) calculatedLevel = 56;
    else if (xp >= 370000) calculatedLevel = 55;
    else if (xp >= 358000) calculatedLevel = 54;
    else if (xp >= 346000) calculatedLevel = 53;
    else if (xp >= 334000) calculatedLevel = 52;
    else if (xp >= 322000) calculatedLevel = 51;
    else if (xp >= 310000) calculatedLevel = 50;
    else if (xp >= 299000) calculatedLevel = 49;
    else if (xp >= 288000) calculatedLevel = 48;
    else if (xp >= 277000) calculatedLevel = 47;
    else if (xp >= 266000) calculatedLevel = 46;
    else if (xp >= 255000) calculatedLevel = 45;
    else if (xp >= 244000) calculatedLevel = 44;
    else if (xp >= 233000) calculatedLevel = 43;
    else if (xp >= 222000) calculatedLevel = 42;
    else if (xp >= 211000) calculatedLevel = 41;
    else if (xp >= 200000) calculatedLevel = 40;
    else if (xp >= 190000) calculatedLevel = 39;
    else if (xp >= 180000) calculatedLevel = 38;
    else if (xp >= 170000) calculatedLevel = 37;
    else if (xp >= 160000) calculatedLevel = 36;
    else if (xp >= 150000) calculatedLevel = 35;
    else if (xp >= 140000) calculatedLevel = 34;
    else if (xp >= 130000) calculatedLevel = 33;
    else if (xp >= 120000) calculatedLevel = 32;
    else if (xp >= 110000) calculatedLevel = 31;
    else if (xp >= 100000) calculatedLevel = 30;
    else if (xp >= 91000) calculatedLevel = 29;
    else if (xp >= 82000) calculatedLevel = 28;
    else if (xp >= 73000) calculatedLevel = 27;
    else if (xp >= 64000) calculatedLevel = 26;
    else if (xp >= 55000) calculatedLevel = 25;
    else if (xp >= 47000) calculatedLevel = 24;
    else if (xp >= 39000) calculatedLevel = 23;
    else if (xp >= 32000) calculatedLevel = 22;
    else if (xp >= 26000) calculatedLevel = 21;
    else if (xp >= 21000) calculatedLevel = 20;
    else if (xp >= 17000) calculatedLevel = 19;
    else if (xp >= 13800) calculatedLevel = 18;
    else if (xp >= 11000) calculatedLevel = 17;
    else if (xp >= 8600) calculatedLevel = 16;
    else if (xp >= 6600) calculatedLevel = 15;
    else if (xp >= 5000) calculatedLevel = 14;
    else if (xp >= 3700) calculatedLevel = 13;
    else if (xp >= 2700) calculatedLevel = 12;
    else if (xp >= 1900) calculatedLevel = 11;
    else if (xp >= 1200) calculatedLevel = 10;
    else if (xp >= 750) calculatedLevel = 9;
    else if (xp >= 450) calculatedLevel = 8;
    else if (xp >= 320) calculatedLevel = 7;
    else if (xp >= 220) calculatedLevel = 6;
    else if (xp >= 160) calculatedLevel = 5;
    else if (xp >= 110) calculatedLevel = 4;
    else if (xp >= 80) calculatedLevel = 3;
    else if (xp >= 50) calculatedLevel = 2;

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
    const hasAnyAuto = upgrades.some((upg) => upg.startsWith("auto_clicker_"));
    if (!hasAnyAuto) return;

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
            + Nowe zbalansowane ceny i progi levelowe (jebać kurwy z
            autoclickerem)
          </p>
          <p className="added-things">
            + Aż 80 nowych leveli (dalej nie ma nagród, jebać was)
          </p>
          <p className="added-things">+ 1 nowy skin</p>
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
              className={`auto-clicker-status ${upgrades.some((u) => u.startsWith("auto_clicker_")) && autoActive ? "active" : "inactive"}`}
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

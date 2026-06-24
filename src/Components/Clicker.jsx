import {
  FaShop as ShopIcon,
  FaArrowPointer as ArrowPointer,
  FaArrowRotateRight as RebirthIcon,
  FaShirt as ShirtIcon,
  FaLock as LockIcon,
  FaCartShopping as ItemShopIcon,
} from "react-icons/fa6";
import { BsBackpack as BackpackIcon } from "react-icons/bs";
import title from "./../assets/imgs/tosiaklikur.gif";
import misiaCorner from "./../assets/imgs/misia_corner.webp";
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
import tosiaMeow from "./../assets/sounds/tosia_meow.mp3";
import letYouDown from "./../assets/sounds/Let You Down.mp3";
import SettingsIcon from "./../assets/imgs/sett.svg";
import Skins from "./Skins";
import LevelBar from "./LevelBar";
import Settings from "./Settings";
import MisiaCorner from "./MisiaCorner";
import ItemShop from "./ItemShop";
import Inventory from "./Inventory";
import clickPotion from "./../assets/imgs/click_potion.svg";
import critPotion from "./../assets/imgs/crit_potion.svg";
import xpPotion from "./../assets/imgs/xp_potion.svg";
import mendolToAnimate from "./../assets/imgs/mendol_totem.png";
import totemOfMendol from "./../assets/imgs/mendol_totem_prawidlowy.png";
import catEars from "./../assets/imgs/kocie_uszka2.png";
import tokens from "./../assets/imgs/zetony.png";
import israelFlag from "./../assets/imgs/flaga_izraela.png";
import misiax from "./../assets/imgs/misiax.png";

const getEncryptedScore = () => {
  const saved = localStorage.getItem("score");
  return saved ? Number(decryptData(saved, 0)) : 0;
};

const getEncryptedCrystals = () => {
  const saved = localStorage.getItem("crystals");
  return saved ? Number(decryptData(saved, 0)) : 0;
};

const getEncryptedRebirths = () => {
  const saved = localStorage.getItem("rebirths");
  return saved ? Number(decryptData(saved, 0)) : 0;
};

const getEncryptedUpgrades = () => {
  const saved = localStorage.getItem("upgrades");
  if (!saved) return [];
  const decrypted = decryptData(saved, []);
  return Array.isArray(decrypted) ? decrypted : [];
};

const getEncryptedAutoStatus = () => {
  const saved = localStorage.getItem("auto_clicker_1_active");
  if (!saved) return false;
  return decryptData(saved, false) === true;
};

const getEncryptedSkins = () => {
  const saved = localStorage.getItem("skins");
  if (!saved) return ["skin_tosia1"];
  const decrypted = decryptData(saved, ["skin_tosia1"]);
  return Array.isArray(decrypted) ? decrypted : ["skin_tosia1"];
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
  const decrypted = decryptData(saved, []);
  return Array.isArray(decrypted) ? decrypted : [];
};

const getEncryptedBoosts = () => {
  const saved = localStorage.getItem("boosts");
  if (!saved) return [];
  const decrypted = decryptData(saved, []);
  return Array.isArray(decrypted) ? decrypted : [];
};

const getEncryptedItems = () => {
  const saved = localStorage.getItem("items");
  if (!saved) return [];
  const decrypted = decryptData(saved, []);
  return Array.isArray(decrypted) ? decrypted : [];
};

const getEncryptedPermUpgrades = () => {
  const saved = localStorage.getItem("perm_upgrades");
  if (!saved) return { perm_click_mult: 0, perm_xp_mult: 0 };

  const decrypted = decryptData(saved, { perm_click_mult: 0, perm_xp_mult: 0 });

  if (decrypted && typeof decrypted === "object" && !Array.isArray(decrypted)) {
    return decrypted;
  }

  return { perm_click_mult: 0, perm_xp_mult: 0 };
};

export const getXpThresholdForLevel = (lvl) => {
  if (lvl <= 1) return 0;

  const START_XP = 50;
  const MULTIPLIER = 1.1;

  let totalXpRequired = 0;
  let currentLevelRequirement = START_XP;

  for (let i = 2; i <= lvl; i++) {
    totalXpRequired += Math.round(currentLevelRequirement);
    currentLevelRequirement *= MULTIPLIER;
  }

  return totalXpRequired;
};

const calculateLevelFromXp = (currentXp) => {
  let lvl = 1;
  while (lvl < 100 && currentXp >= getXpThresholdForLevel(lvl + 1)) {
    lvl++;
  }
  return lvl;
};

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
  const [level, setLevel] = useState(() => {
    const initialXp = getEncryptedXp();
    return calculateLevelFromXp(initialXp);
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => getEncryptedSettings());
  const [showMisiaCorner, setShowMisiaCorner] = useState(false);
  const [boosts, setBoosts] = useState(() => getEncryptedBoosts());
  const [timeTicker, setTimeTicker] = useState(Date.now());
  const [showItemShop, setShowItemShop] = useState(false);
  const [items, setItems] = useState(() => getEncryptedItems());
  const [showInventory, setShowInventory] = useState(false);
  const [clickStreak, setClickStreak] = useState(0);
  const [maxClickStreak, setMaxClickStreak] = useState(225); // +150 = +1
  const [droppedItem, setDroppedItem] = useState(null);
  const [crystals, setCrystals] = useState(() => getEncryptedCrystals());
  const [showMendolAnimation, setShowMendolAnimation] = useState(false);
  const [permUpgrades, setPermUpgrades] = useState(() =>
    getEncryptedPermUpgrades(),
  );

  const saveTimeoutRef = useRef(null);
  const scoreRef = useRef(score);
  const xpRef = useRef(xp);
  const crystalsRef = useRef(crystals);
  const lastClickTime = useRef(0);
  const isMounted = useRef(false);

  const hasCatEars = items.some(
    (item) => item.id === "cat_ears" && item.amount > 0,
  );
  const hasTotemOfMendol = items.some(
    (item) => item.id === "totem_of_mendol" && item.amount > 0,
  );
  const hasTokens = items.some(
    (item) => item.id === "poker_tokens" && item.amount > 0,
  );
  const hasIsraelFlag = items.some(
    (item) => item.id === "israel_flag" && item.amount > 0,
  );

  const effectsVolume =
    settings?.find((sett) => sett.id === "sett_change_effects_volume")?.value ??
    0.5;

  const musicVolume =
    settings?.find((sett) => sett.id === "sett_change_music_volume")?.value ??
    0.5;

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    xpRef.current = xp;
  }, [xp]);

  useEffect(() => {
    crystalsRef.current = crystals;
  }, [crystals]);

  useEffect(() => {
    const timer = setInterval(() => setTimeTicker(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (rebirths >= 3) setMaxClickStreak(600);
    if (rebirths >= 4) setMaxClickStreak(1350);
    if (rebirths >= 6) setMaxClickStreak(2100);
  }, [rebirths]);

  useEffect(() => {
    if (clickStreak === 0) return;

    const checkStreak = setInterval(() => {
      const now = Date.now();
      if (now - lastClickTime.current >= 2500) {
        setClickStreak(0);
      }
    }, 100);

    return () => clearInterval(checkStreak);
  }, [clickStreak]);

  useEffect(() => {
    const backgroundSound = new Audio(letYouDown);

    backgroundSound.loop = true;
    backgroundSound.volume = parseFloat(musicVolume);

    backgroundSound.play().catch((error) => {
      "";
    });

    return () => {
      backgroundSound.pause();
      backgroundSound.currentTime = 0;
    };
  }, [settings]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();

      e.returnValue =
        "Czy na pewno chcesz wyjść? Twój postęp z ostatniej sekundy może się nie zapisać!";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const CURRENT_VERSION = "BETA 1.8.0";

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch(`/version.json?t=${Date.now()}`);
        if (!response.ok) return;

        const data = await response.json();

        if (data.version && data.version !== CURRENT_VERSION) {
          localStorage.setItem("game_version", data.version);

          window.location.reload(true);
        }
      } catch (error) {
        console.error("Błąd podczas sprawdzania aktualizacji:", error);
      }
    };

    checkForUpdates();

    const interval = setInterval(checkForUpdates, 60000);

    return () => clearInterval(interval);
  }, []);

  const queueSaveToLocalStorage = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem("score", encryptData(scoreRef.current));
      localStorage.setItem("xp", encryptData(xpRef.current));
      localStorage.setItem("crystals", encryptData(crystalsRef.current));
    }, 1000);
  }, []);

  const getClickAddition = useCallback(
    (addition = 1, xpAddition = 1, crystalsAddition = 0) => {
      let isCrit = false;
      let isSuperCrit = false;
      let isTokenAplied = false;
      let critChance = 0;
      let superCritChance = 0;
      let crystalsChance = 0;
      let clickStreakMultiplier = 1;
      let rebirthClickMultiplier = 1;
      let rebirthXpMultiplier = 1;

      const clickLvl = permUpgrades?.perm_click_mult || 0;
      const xpLvl = permUpgrades?.perm_xp_mult || 0;

      const permClickMult = 1 + clickLvl * 0.05;
      const permXpMult = 1 + xpLvl * 0.05;

      if (upgrades.includes("upg_click_1")) addition += 1;
      if (upgrades.includes("upg_click_2")) addition += 2;
      if (upgrades.includes("upg_click_3")) addition += 5;

      if (upgrades.includes("upg_xp_1")) xpAddition += 1;
      if (upgrades.includes("upg_xp_2")) xpAddition += 2;
      if (upgrades.includes("upg_xp_3")) xpAddition += 5;

      if (upgrades.includes("upg_crit_chance_1")) critChance += 0.1;
      if (upgrades.includes("upg_crit_chance_2")) critChance += 0.15;

      const misiaBoost = boosts?.find((b) => b.id === "misia_boost");
      const clickBoost = boosts?.find((b) => b.type === "click_multiplier");
      const xpBoost = boosts?.find((b) => b.type === "xp_multiplier");
      const critBoost = boosts?.find((b) => b.type === "crit_addition");

      if (misiaBoost && misiaBoost.endTime > Date.now()) addition *= 3;
      if (clickBoost && clickBoost.endTime > Date.now())
        addition *= clickBoost.value;
      if (xpBoost && xpBoost.endTime > Date.now()) xpAddition *= xpBoost.value;
      if (critBoost && critBoost.endTime > Date.now())
        critChance += critBoost.value;

      for (let i = 15; i <= maxClickStreak; i += 15) {
        if (clickStreak >= i) clickStreakMultiplier += 0.1;
      }
      addition *= clickStreakMultiplier;
      xpAddition *= clickStreakMultiplier;

      if (rebirths >= 1) rebirthClickMultiplier = 2;
      if (rebirths >= 2) critChance += 0.1;
      if (rebirths >= 3) rebirthXpMultiplier = 2;
      if (rebirths >= 4) rebirthClickMultiplier = 3;
      if (rebirths >= 5) {
        superCritChance += 0.01;
        rebirthXpMultiplier = 3;
        crystalsChance += 0.005;
      }
      if (rebirths >= 6) {
        superCritChance += 0.02;
        crystalsChance += 0.007;
      }

      addition *= rebirthClickMultiplier;
      xpAddition *= rebirthXpMultiplier;

      const random = Math.random();

      if (Math.random() < crystalsChance) crystalsAddition += 1;

      if (random < superCritChance) {
        isSuperCrit = true;
        addition *= 25;
        xpAddition *= 25;
        crystalsAddition *= 25;
      } else if (random < critChance) {
        isCrit = true;
        addition *= 5;
        xpAddition *= 5;
        crystalsAddition *= 5;
      }

      if (hasTokens && Math.random() < 0.05) {
        isTokenAplied = true;

        if (Math.random() < 0.4) {
          addition *= 50;
        } else {
          addition -= addition * 25;
        }
      }

      if (hasIsraelFlag) addition = 0;

      addition *= permClickMult;
      xpAddition *= permXpMult;

      addition = Math.round(addition);
      xpAddition = Math.round(xpAddition);
      crystalsAddition = Math.round(crystalsAddition);

      return {
        addition,
        isCrit,
        xpAddition,
        isSuperCrit,
        crystalsAddition,
        isTokenAplied,
      };
    },
    [upgrades, rebirths, boosts, clickStreak, items],
  );

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
      crystalsValue: currentAdditionData.crystalsAddition,
      isCrit: currentAdditionData.isCrit,
      isSuperCrit: currentAdditionData.isSuperCrit,
      isTokenAplied: currentAdditionData.isTokenAplied,
    };

    setFloatingTexts((prev) => [...prev, newText]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((text) => text.id !== newText.id));
    }, 800);

    setScore((prev) => prev + currentAddition);
    setXp((prev) => prev + currentAdditionData.xpAddition);
    setCrystals((prev) => prev + currentAdditionData.crystalsAddition);

    queueSaveToLocalStorage();
  }, [getClickAddition, queueSaveToLocalStorage]);

  const handleItemDrop = () => {
    const itemsToDrop = [
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
    ];

    const randomItemIndex = Math.floor(Math.random() * itemsToDrop.length);
    let dropChance = 0.002;

    if (rebirths >= 2) dropChance += 0.001;
    if (rebirths >= 3) dropChance += 0.001;
    if (rebirths >= 4) dropChance += 0.002;
    if (rebirths >= 5) dropChance += 0.002;
    if (rebirths >= 6) dropChance += 0.003;

    if (hasCatEars) dropChance += 0.005;

    if (Math.random() <= dropChance) {
      const droppedItemNow = itemsToDrop[randomItemIndex];

      setDroppedItem(droppedItemNow);
      setItems((prev) => {
        const existingItem = prev.find((item) => item.id === droppedItemNow.id);
        let newItems;
        if (existingItem) {
          newItems = prev.map((item) =>
            item.id === droppedItemNow.id
              ? { ...item, amount: item.amount + 1 }
              : item,
          );
        } else {
          const endTime = Date.now() + droppedItemNow.duration;
          const newItemBoost = {
            ...droppedItemNow.boost,
            endTime: endTime,
          };

          const newItem = {
            id: droppedItemNow.id,
            name: droppedItemNow.name,
            desc: droppedItemNow.desc,
            duration: droppedItemNow.duration,
            img: droppedItemNow.img,
            type: droppedItemNow.type,
            boost: newItemBoost,
            amount: 1,
          };

          newItems = [...prev, newItem];
        }

        localStorage.setItem("items", encryptData(newItems));
        return newItems;
      });

      const timeout = setTimeout(() => {
        setDroppedItem(null);
      }, 1000);
    }
  };

  const addToScore = useCallback(
    (isManual = false) => {
      const now = Date.now();

      if (now - lastClickTime.current < 50) return;
      lastClickTime.current = now;

      if (isManual) {
        setClickStreak((prev) => {
          if (prev >= maxClickStreak) return prev;
          return prev + 1;
        });

        const audio = new Audio(tosiaMeow);
        audio.volume = parseFloat(effectsVolume);

        audio.currentTime = 1;

        audio.play().catch((error) => {
          console.log(
            "Przeglądarka zablokowała audio przed interakcją:",
            error,
          );
        });

        setTimeout(() => {
          audio.pause();
          audio.currentTime = 1;
        }, 1000);

        handleItemDrop();
      }

      processScoreGain();

      return () => clearTimeout(timeout);
    },
    [processScoreGain],
  );

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

  const justAddAndShowScore = useCallback(
    (
      value = 0,
      xpValue = 0,
      isCrit = false,
      isSuperCrit = false,
      isMendol = false,
    ) => {
      setScore((prev) => prev + value);

      if (xpValue > 0) {
        setXp((prev) => prev + xpValue);
      }

      const marginX = window.innerWidth * 0.1;
      const marginY = window.innerHeight * 0.1;
      const randomX =
        marginX + Math.random() * (window.innerWidth - marginX * 2);
      const randomY =
        marginY + Math.random() * (window.innerHeight - marginY * 2);

      const newText = {
        id: Date.now() + Math.random(),
        x: randomX,
        y: randomY,
        value: value,
        xpValue: xpValue,
        isCrit: isCrit,
        isSuperCrit: isSuperCrit,
        isMendol: isMendol,
      };

      setFloatingTexts((prev) => [...prev, newText]);

      setTimeout(() => {
        setFloatingTexts((prev) =>
          prev.filter((text) => text.id !== newText.id),
        );
      }, 800);
      queueSaveToLocalStorage();
    },
    [queueSaveToLocalStorage],
  );

  useEffect(() => {
    let intervalId = null;
    let timeoutId = null;

    if (hasTotemOfMendol) {
      intervalId = setInterval(() => {
        if (Math.random() < 0.5) {
          const additionData = getClickAddition(1000, 250);

          justAddAndShowScore(
            additionData.addition,
            additionData.xpAddition,
            additionData.isCrit,
            additionData.isSuperCrit,
            true,
          );
          setShowMendolAnimation(true);
          console.log("Mendol!");

          timeoutId = setTimeout(() => {
            setShowMendolAnimation(false);
          }, 3000);
        }
      }, 1000 * 30);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [items, getClickAddition]);

  useEffect(() => {
    const handleLevelRewards = (newLevel) => {
      const savedRewards = localStorage.getItem("claimed_rewards");
      let claimedRewards = savedRewards ? decryptData(savedRewards, []) : [];

      if (claimedRewards.includes(newLevel)) return;

      let rewardAmount = 0;
      if (newLevel === 2) rewardAmount = 1000;
      if (newLevel === 5) rewardAmount = 3000;
      if (newLevel === 10) rewardAmount = 10000;

      if (rewardAmount > 0) {
        claimedRewards.push(newLevel);
        localStorage.setItem("claimed_rewards", encryptData(claimedRewards));

        setScore((prev) => {
          const nScore = prev + rewardAmount;
          localStorage.setItem("score", encryptData(nScore));
          return nScore;
        });
      }
    };

    const calculatedLevel = calculateLevelFromXp(xp);

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

  const hasAccessToMisiaCorner = upgrades.includes("access_misia_corner");
  const showClickEffects =
    settings.find((sett) => sett.id === "sett_show_click_effects")?.value ??
    true;
  const showLevelBar =
    settings.find((sett) => sett.id === "sett_show_level_bar")?.value ?? true;
  const showBoosts =
    settings.find((sett) => sett.id === "sett_show_boosts")?.value ?? true;
  const showClickStreakBar =
    settings.find((sett) => sett.id === "sett_show_streak_bar")?.value ?? true;
  const showItemsOnTosia =
    settings.find((sett) => sett.id === "sett_show_tosia_items")?.value ?? true;

  const currentBonusMultiplier = 1 + Math.floor(clickStreak / 15) * 0.1;
  const maxBonusMultiplier = 1 + Math.floor(maxClickStreak / 15) * 0.1;

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
          crystals={crystals}
          setCrystals={setCrystals}
          permUpgrades={permUpgrades}
          setPermUpgrades={setPermUpgrades}
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
          level={level}
          setScore={setScore}
          setUpgrades={setUpgrades}
          setXp={setXp}
          setLevel={setLevel}
          setBoosts={setBoosts}
          setItems={setItems}
          setCrystals={setCrystals}
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
          encryptData={encryptData}
        />
      )}

      {showMisiaCorner && (
        <MisiaCorner
          setScore={setScore}
          setShowMisiaCorner={setShowMisiaCorner}
          encryptData={encryptData}
          avaiable={upgrades.includes("access_misia_corner")}
          boosts={boosts}
          setBoosts={setBoosts}
          effectsVolume={effectsVolume}
        />
      )}

      {showItemShop && (
        <ItemShop
          setShowItemShop={setShowItemShop}
          items={items}
          setItems={setItems}
          encryptData={encryptData}
          score={score}
          setScore={setScore}
          boosts={boosts}
          setBoosts={setBoosts}
        />
      )}

      {showInventory && (
        <Inventory
          setShowInventory={setShowInventory}
          items={items}
          setItems={setItems}
          encryptData={encryptData}
          boosts={boosts}
          setBoosts={setBoosts}
        />
      )}

      <div className="main-container">
        <div className="version-box">
          <p className="version">{CURRENT_VERSION}</p>
          <p className="added-things">
            + Szansa na drop itemów poprostu klikając w Tosię
          </p>
          <p className="added-things">+ Nowa waluta - Misiaxy</p>
          <p className="added-things">+ Zmiany w rebirthach</p>
          <p className="added-things">+ Rebirth 3, 4, 5 oraz 6</p>
          <p className="added-things">+ Nowe itemy w sklepie z przedmiotami!</p>
        </div>
        <div className="title">
          <img src={title} alt="" />
        </div>
        <div className="side-bar">
          <button onClick={() => setShowShop(true)} categoryname="Sklep">
            <ShopIcon className="side-bar-icon" />
          </button>
          <button
            onClick={() => setShowItemShop(true)}
            categoryname="Sklep z przedmiotami"
          >
            <ItemShopIcon className="side-bar-icon orange" />
          </button>
          <button
            onClick={() => setShowSkins(true)}
            categoryname="Sklep ze skinami"
          >
            <ShirtIcon className="side-bar-icon red" />
          </button>
          <button onClick={handleAutoClickerChange} categoryname="Autoklikacz">
            <ArrowPointer className="side-bar-icon blue" />
            <span
              className={`auto-clicker-status ${upgrades.some((u) => u.startsWith("auto_clicker_")) && autoActive ? "active" : "inactive"}`}
            />
          </button>
          <button onClick={() => setShowRebirths(true)} categoryname="Rebirth">
            <RebirthIcon className="side-bar-icon green" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            categoryname="Ustawienia"
          >
            <img
              src={SettingsIcon}
              className="side-bar-icon lightblue"
              alt=""
            />
          </button>
          <button
            onClick={() => setShowInventory(true)}
            categoryname="Ekwipunek"
          >
            <BackpackIcon className="side-bar-icon pink" />
          </button>
        </div>
        <div className="tosia-img">
          <img
            className={!showClickEffects ? "tosia-img__no-effects" : ""}
            onClick={() => addToScore(true)}
            src={tosia}
            alt="TOSIA"
          />
          {showItemsOnTosia && (
            <>
              {hasCatEars && (
                <div className="cat-ears-wrapper">
                  <img src={catEars} alt="" />
                </div>
              )}
              {hasTotemOfMendol && (
                <div className="totem-of-mendol-wrapper">
                  <img src={totemOfMendol} alt="" />
                </div>
              )}
              {hasTokens && (
                <div className="tokens-wrapper">
                  <img src={tokens} alt="" />
                </div>
              )}
              {hasIsraelFlag && (
                <div className="israel-wrapper">
                  <img src={israelFlag} alt="" />
                </div>
              )}
            </>
          )}
          {showMendolAnimation && (
            <div className="mendol-animated">
              <img src={mendolToAnimate} alt="" />
            </div>
          )}
          {showClickStreakBar && (
            <div className="click-streak-wrapper">
              <span className="click-streak-bonus">
                x{currentBonusMultiplier.toFixed(1)}
              </span>
              <div className="click-streak-bar">
                <div
                  className="click-streak-progress"
                  style={{
                    maxWidth: `${(clickStreak / maxClickStreak) * 100}%`,
                  }}
                />
              </div>
              <span className="click-streak-bonus">
                x{maxBonusMultiplier.toFixed(1)}
              </span>
            </div>
          )}
          {droppedItem && (
            <div className="dropped-item">
              <img src={droppedItem.img} alt="" />
              <span className="dropped-item-name">{droppedItem.name}</span>
            </div>
          )}
        </div>
        {showClickEffects &&
          floatingTexts.map((text) => {
            const isSuperCrit = text.isSuperCrit;
            const isCrit = text.isCrit;
            const isMendol = text.isMendol;
            const isTokenAplied = text.isTokenAplied;

            const critStyle = {
              color: "tomato",
              fontSize: "3rem",
            };

            const superCritStyle = {
              color: "limegreen",
              fontSize: "5rem",
            };

            const mendolStyle = {
              color: "black",
              fontSize: "4rem",
            };

            const tokenAppliedStyle = {
              color: "pink",
              fontSize: "5rem",
            };

            let textStyle = undefined;

            if (isCrit) textStyle = critStyle;
            if (isSuperCrit) textStyle = superCritStyle;
            if (isMendol) textStyle = mendolStyle;
            if (isTokenAplied) textStyle = tokenAppliedStyle;

            const symbol = text.value >= 0 ? "+" : "";

            return (
              <span
                key={text.id}
                className="floating-click-text"
                style={{
                  top: text.y,
                  left: text.x,
                  ...textStyle,
                }}
              >
                {symbol}
                {text.value.toLocaleString("pl-PL")}
                {text.xpValue > 0 && (
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "cornflowerblue",
                      marginTop: "-10px",
                    }}
                  >
                    +{text.xpValue.toLocaleString("pl-PL")}xp
                  </span>
                )}
                {text.crystalsValue > 0 && (
                  <span
                    style={{
                      fontSize: "1.1rem",
                      color: "rgb(154, 224, 236)",
                      marginTop: "-6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    +{text.crystalsValue.toLocaleString("pl-PL")}
                    <img src={misiax} style={{ width: "16px" }} alt="" />
                  </span>
                )}
              </span>
            );
          })}
        <div className="score-label">
          <span className="score">{score.toLocaleString("pl-PL")}</span>
          {rebirths > 0 && (
            <span className="score crystals">
              <img src={misiax} alt="" />
              {crystals.toLocaleString("pl-PL")}
            </span>
          )}
        </div>
        {showLevelBar && <LevelBar level={level} xp={xp} />}
        {showBoosts && (
          <div className="boosts-wrapper">
            {boosts
              ?.filter((boost) => boost.endTime > Date.now())
              .slice(0, 3)
              .map((boost, i) => {
                const msLeft = boost.endTime - Date.now();
                const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

                return (
                  <div className="boost" key={boost.id || i}>
                    <img src={boost.img} alt="" />
                    <div className="boost-info">
                      <span className="name">{boost.name}</span>
                      <span className="time-left">{formattedTime}</span>
                    </div>
                  </div>
                );
              })}
            {boosts?.filter((boost) => boost.endTime > Date.now()).length >
              3 && (
              <span className="more-boosts">{boosts?.length - 3} więcej</span>
            )}
          </div>
        )}
        <div className="misia-corner-wrapper">
          <img
            className={!hasAccessToMisiaCorner ? "disabled" : ""}
            src={misiaCorner}
            alt="misia corner"
            onClick={() => setShowMisiaCorner(true)}
          />
          {!hasAccessToMisiaCorner && <LockIcon className="lock-icon" />}
        </div>
      </div>
    </>
  );
}

export default Clicker;

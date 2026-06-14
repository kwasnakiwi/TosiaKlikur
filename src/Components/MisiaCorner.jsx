import "./../styles/MisiaCorner.css";
import misiaSpi from "./../assets/imgs/misia_spi.webp";
import misiaSpiPetPet from "./../assets/imgs/misia_spi_pet_pet.gif";
import misiaNieSpiPetPet from "./../assets/imgs/misia_nie_spi_pat_pat.gif";
import misiaNieSpi from "./../assets/imgs/misia_nie_spi.webp";
import pawIcon from "./../assets/imgs/paw-solid.svg";
import { useState, useEffect } from "react";

function MisiaCorner({ setShowMisiaCorner, encryptData, boosts, setBoosts }) {
  const [timeTicker, setTimeTicker] = useState(Date.now());
  const [misiaPet, setMisiaPet] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeTicker(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentBoost = boosts?.find((b) => b.id === "misia_boost");
  const isMisiaActiveNow = currentBoost && currentBoost.endTime > Date.now();

  const isMisiaOnCooldown =
    currentBoost && currentBoost.cooldownEnd > Date.now();

  const wakeUp = () => {
    if (isMisiaActiveNow || isMisiaOnCooldown) return;

    const BOOST_DURATION = 20 * 60 * 1000;
    const COOLDOWN_DURATION = 3 * 60 * 60 * 1000;

    const now = Date.now();
    const endTime = now + BOOST_DURATION;
    const cooldownEnd = endTime + COOLDOWN_DURATION;

    const newBoost = {
      id: "misia_boost",
      name: "Szał Misi",
      endTime: endTime,
      cooldownEnd: cooldownEnd,
      img: pawIcon,
    };

    setBoosts((prev) => {
      const filtered = prev.filter((b) => b.id !== "misia_boost");
      const nextBoosts = [...filtered, newBoost];
      localStorage.setItem("boosts", encryptData(nextBoosts));
      return nextBoosts;
    });
  };

  const pet = () => {
    setMisiaPet(true);

    const timer = setTimeout(() => {
      setMisiaPet(false);
    }, 1300);

    const audio = new Audio(
      "https://us-tuna-sounds-files.voicemod.net/ba1fe939-a503-4774-8434-428b59658063-1760125636857.mp3",
    );
    audio.volume = 0.5;

    audio.play().catch((error) => {
      console.log(
        "Przeglądarka zablokowała auto-play (użytkownik musi najpierw kliknąć coś na stronie):",
        error,
      );
    });

    return () => clearTimeout(timer);
  };

  const giveTreat = () => {};

  const getFormattedTimeLeft = (targetTime) => {
    const msLeft = targetTime - Date.now();
    if (msLeft <= 0) return "0:00";

    const totalSeconds = Math.floor(msLeft / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    if (hours > 0) {
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return `${minutes}:${paddedSeconds}`;
  };

  let wakeUpButtonName = "Obudź Misię";
  let wakeUpButtonDesc = "Obudź Misię i zyskaj x3 do kliknięć!";
  let isWakeUpDisabled = false;

  if (isMisiaActiveNow) {
    wakeUpButtonName = `Biega! (${getFormattedTimeLeft(currentBoost.endTime)})`;
    wakeUpButtonDesc = "Misia szaleje na polowaniu!";
    isWakeUpDisabled = true;
  } else if (isMisiaOnCooldown) {
    wakeUpButtonName = `Śpi... (${getFormattedTimeLeft(currentBoost.cooldownEnd)})`;
    wakeUpButtonDesc = "Misia jest zmęczona. Musi odespać polowanie.";
    isWakeUpDisabled = true;
  }

  const misiaCornerConfig = [
    {
      name: wakeUpButtonName,
      desc: wakeUpButtonDesc,
      func: wakeUp,
      disabled: isWakeUpDisabled,
    },
    {
      name: "Pogłaszcz Misię",
      desc: "PAT PAT!",
      func: pet,
    },
    {
      name: "Daj smaczka",
      desc: "Yummy!",
      func: giveTreat,
      notAvaiableYet: true,
    },
  ];

  return (
    <>
      <div
        className="shop-back-overlay"
        onClick={() => setShowMisiaCorner(false)}
      />
      <div className="shop">
        <div className="mc-options">
          {misiaCornerConfig.map((opt, i) => (
            <div className="mc-option" key={i}>
              <span className="name">{opt.name}</span>
              <span className="desc">{opt.desc}</span>
              <button
                className={`func ${opt.notAvaiableYet || opt.disabled ? "not" : ""} ${opt.disabled ? "disabled" : ""}`}
                onClick={opt.func}
                disabled={opt.notAvaiableYet || opt.disabled}
              >
                {opt.notAvaiableYet ? "Już wkrótce" : opt.name.split(" ")[0]}
              </button>
            </div>
          ))}
        </div>
        <div className="mc-misia-display">
          <img
            src={
              misiaPet
                ? isMisiaActiveNow
                  ? misiaNieSpiPetPet
                  : misiaSpiPetPet
                : isMisiaActiveNow
                  ? misiaNieSpi
                  : misiaSpi
            }
            alt="Misia"
            className={isMisiaActiveNow ? "misia-awake-animation" : ""}
          />
        </div>
      </div>
    </>
  );
}

export default MisiaCorner;

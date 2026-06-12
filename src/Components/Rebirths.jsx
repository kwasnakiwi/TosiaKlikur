import { useState } from "react";
import "./../styles/Rebirths.css";

function Rebirths({
  setShowRebirths,
  rebirths,
  setRebirths,
  score,
  setScore,
  setUpgrades,
  setXp,
  encryptData
}) {
  const rebirthRequirements = [
    { clicks: 250000, label: "250000 kliknięć" },
    { clicks: 1500000, label: "1500000 kliknięć" },
  ];
  const rebirthRewards = [
    { multiplayer: 2, label: "mnożnik x2 do kliknięć!" },
    {
      critChance: 0.1,
      label: "+10% szansy na krytyczne kliknięcie (wartość x5)",
    },
  ];
  const [error, setError] = useState(null);

  const handleRebirth = () => {
    if (score < rebirthRequirements[rebirths].clicks) {
      setError("Za mało kliknięć");
      return;
    }
    setRebirths((prev) => {
      const newRebirths = prev + 1;
      localStorage.setItem("rebirths", encryptData(newRebirths));
      return newRebirths;
    });
    setScore(() => {
      const newScore = 0;
      localStorage.setItem("score", encryptData(newScore));
      return newScore;
    });
    setUpgrades(() => {
      const newUpgrades = [];
      localStorage.setItem("upgrades", encryptData(newUpgrades));
      return newUpgrades;
    });
    setXp(() => {
      const newXp = 0;
      localStorage.setItem("score", encryptData(newXp));
      return newXp;
    });
    setShowRebirths(false);
  };

  return (
    <>
      <div
        className="shop-back-overlay"
        onClick={() => setShowRebirths(false)}
      />
      <div className="shop">
        <h1 className="rebirth-title">
          Rebirth <span>{rebirths + 1}</span>
        </h1>
        {rebirths + 1 <= rebirthRequirements.length ? (
          <>
            <div className="rebirth-requirements">
              <h2 className="rebirth-req-title">Wymagania:</h2>
              <ul className="rebirth-requirements-list">
                {rebirthRequirements
                  .filter((_, i) => i === rebirths)
                  .map((req, i) => (
                    <li key={i}>{req.label}</li>
                  ))}
              </ul>
            </div>
            <div className="rebirth-requirements">
              <h2 className="rebirth-req-title">Nagrody:</h2>
              <ul className="rebirth-rewards-list">
                {rebirthRewards
                  .filter((_, i) => i === rebirths)
                  .map((rew, i) => (
                    <li key={i}>{rew.label}</li>
                  ))}
              </ul>
            </div>
            <p className="rebirth-warning">
              UWAGA, klikając przycisk "Zrebirthuj" zrzekasz się wszelkich praw
              i tracisz wszystkie kliknięcia
            </p>
            <button className="rebirth-button" onClick={handleRebirth}>
              Zrebirthuj
            </button>
          </>
        ) : (
          <div className="no-avaiable-rebirth">JUŻ WKRÓTCE</div>
        )}
      </div>
    </>
  );
}

export default Rebirths;

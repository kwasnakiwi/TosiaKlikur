import { useState } from "react";
import "./../styles/Rebirths.css";

function Rebirths({
  setShowRebirths,
  rebirths,
  setRebirths,
  score,
  level,
  setScore,
  setUpgrades,
  setXp,
  setLevel,
  setBoosts,
  setItems,
  setCrystals,
  encryptData,
}) {
  const rebirthRequirements = [
    {
      clicks: 50000,
      level: 25,
      labels: [
        { text: "50 000 kliknięć", isCompleted: score >= 50000 },
        { text: "25 level", isCompleted: level >= 25 },
      ],
    },
    {
      clicks: 125000,
      level: 35,
      labels: [
        { text: "125 000 kliknięć", isCompleted: score >= 125000 },
        { text: "35 level", isCompleted: level >= 35 },
      ],
    },
    {
      clicks: 200000,
      level: 50,
      labels: [
        { text: "200 000 kliknięć", isCompleted: score >= 200000 },
        { text: "50 level", isCompleted: level >= 50 },
      ],
    },
    {
      clicks: 300000,
      level: 60,
      labels: [
        { text: "300 000 kliknięć", isCompleted: score >= 300000 },
        { text: "60 level", isCompleted: level >= 60 },
      ],
    },
    {
      clicks: 450000,
      level: 70,
      labels: [
        { text: "450 000 kliknięć", isCompleted: score >= 450000 },
        { text: "70 level", isCompleted: level >= 70 },
      ],
    },
    {
      clicks: 700000,
      level: 80,
      labels: [
        { text: "700 000 kliknięć", isCompleted: score >= 700000 },
        { text: "80 level", isCompleted: level >= 80 },
      ],
    },
    {
      clicks: 1000000,
      level: 90,
      labels: [
        { text: "700 000 kliknięć", isCompleted: score >= 1000000 },
        { text: "80 level", isCompleted: level >= 90 },
      ],
    },
  ];

  const rebirthRewards = [
    {
      crystals: 15,
      labels: ["15 misiaxów", "mnożnik x2 do kliknięć!"],
    },
    {
      crystals: 30,
      labels: [
        "30 misiaxów",
        "+10% szansy na krytyczne kliknięcie (wartość x5)",
        "+0.1% szansy na drop itemu z klikania",
      ],
    },
    {
      crystals: 50,
      labels: [
        "50 misiaxów",
        "mnożnik x2 do XPa!",
        "Maksymalna passa kliknięcia zwiększona do x5",
        "+0.1% szansy na drop itemu z klikania",
      ],
    },
    {
      crystals: 75,
      labels: [
        "75 misiaxów",
        "mnożnik x3 do kliknięć!",
        "Maksymalna passa kliknięcia zwiększona do x10",
        "+0.2% szansy na drop itemu z klikania",
      ],
    },
    {
      crystals: 100,
      labels: [
        "100 misiaxów",
        "mnożnik x3 do XPa!",
        "+1% szansy na super-krytyczne kliknięcie (wartość x25)",
        "+0.2% szansy na drop itemu z klikania",
        "+0.5% szansy na drop misiaxów poprostu z klikania!",
      ],
    },
    {
      crystals: 150,
      labels: [
        "150 misiaxów",
        "Maksymalna passa kliknięcia zwiększona do x15",
        "+2% szansy na super-krytyczne kliknięcie (wartość x25)",
        "+0.3% szansy na drop itemu z klikania",
        "+0.7% szansy na drop misiaxów poprostu z klikania!",
      ],
    },
    {
      crystals: 250,
      labels: [
        "250 misiaxów",
        "Maksymalna passa kliknięcia zwiększona do x20",
        "+3% szansy na super-krytyczne kliknięcie (wartość x25)",
        "+0.5% szansy na drop itemu z klikania",
        "+1% szansy na drop misiaxów poprostu z klikania!",
        "+10% do każdego zysku do prestiżu?"
      ],
    },
  ];
  const [error, setError] = useState(null);

  const handleRebirth = () => {
    if (rebirths >= rebirthRequirements.length) return;

    const currentReq = rebirthRequirements[rebirths];
    const currentRew = rebirthRewards[rebirths];

    if (score < currentReq.clicks) {
      setError("Za mało kliknięć");
      return;
    }
    if (level < currentReq.level) {
      setError("Niewystarczający level");
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

    setCrystals((prev) => {
      const newCrystals = prev + currentRew.crystals;
      localStorage.setItem("crystals", encryptData(newCrystals));
      return newCrystals;
    });

    setUpgrades(() => {
      const newUpgrades = [];
      localStorage.setItem("upgrades", encryptData(newUpgrades));
      return newUpgrades;
    });

    setXp(() => {
      const newXp = 0;
      localStorage.setItem("xp", encryptData(newXp));
      localStorage.setItem("claimed_rewards", encryptData([]));
      return newXp;
    });

    setLevel(() => {
      const newLevel = 1;
      localStorage.setItem("level", encryptData(newLevel));
      return newLevel;
    });

    setBoosts(() => {
      const newBoosts = [];
      localStorage.setItem("boosts", encryptData(newBoosts));
      return newBoosts;
    });

    setItems(() => {
      const newItems = [];
      localStorage.setItem("items", encryptData(newItems));
      return newItems;
    });

    setShowRebirths(false);
  };

  return (
    <>
      <div
        className="shop-back-overlay"
        onClick={() => setShowRebirths(false)}
      />
      <div className="shop" style={{ padding: "30px" }}>
        <h1 className="rebirth-title">
          Rebirth <span>{rebirths + 1}</span>
        </h1>

        {rebirths < rebirthRequirements.length ? (
          <>
            <div className="rebirth-requirements">
              <h2 className="rebirth-req-title">Wymagania:</h2>
              <ul className="rebirth-requirements-list">
                {rebirthRequirements[rebirths].labels.map((req, idx) => (
                  <li
                    key={idx}
                    style={{ color: req.isCompleted ? "green" : "red" }}
                  >
                    {req.text} {req.isCompleted ? "✓" : "✗"}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rebirth-requirements">
              <h2 className="rebirth-req-title">Nagrody:</h2>
              <ul className="rebirth-rewards-list">
                {rebirthRewards[rebirths].labels.map((rew, idx) => (
                  <li key={idx}>{rew}</li>
                ))}
              </ul>
            </div>

            {error && (
              <p className="rebirth-error-message" style={{ color: "red" }}>
                {error}
              </p>
            )}

            <p className="rebirth-warning">
              UWAGA, klikając przycisk "Zrebirthuj" zrzekasz się wszelkich praw
              i tracisz wszystkie kliknięcia, poziom doświadczenia, upgrady,
              itemy w ekwipunku, aktywne boosty itp.
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

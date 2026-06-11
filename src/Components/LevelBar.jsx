import "./../styles/LevelBar.css";

function LevelBar({ level, xp }) {
  const levelsConfig = {
    1: { min: 0, max: 500 },
    2: { min: 500, max: 1500 },
    3: { min: 1500, max: 3000 },
    4: { min: 3000, max: 5000 },
    5: { min: 5000, max: 7500 },
    6: { min: 7500, max: 10500 },
    7: { min: 10500, max: 14000 },
    8: { min: 14000, max: 18000 },
    9: { min: 18000, max: 22500 },
    10: { min: 22500, max: 27500 },
    11: { min: 27500, max: 33000 },
    12: { min: 33000, max: 39000 },
    13: { min: 39000, max: 45500 },
    14: { min: 45500, max: 52500 },
    15: { min: 52500, max: 60000 },
    16: { min: 60000, max: 68000 },
    17: { min: 68000, max: 76500 },
    18: { min: 76500, max: 85500 },
    19: { min: 85500, max: 95000 },
    20: { min: 95000, max: 105000 },
  };

  const currentRange = levelsConfig[level];
  const isMaxLevel = level >= 6;

  let progressPercent = 0;
  let xpOnCurrentLevel = xp;
  let xpRequiredForNext = 500;

  if (isMaxLevel) {
    progressPercent = 100;
  } else if (currentRange) {
    xpOnCurrentLevel = xp - currentRange.min;
    xpRequiredForNext = currentRange.max - currentRange.min;

    progressPercent = (xpOnCurrentLevel / xpRequiredForNext) * 100;
    if (progressPercent > 100) progressPercent = 100;
    if (progressPercent < 0) progressPercent = 0;
  }

  return (
    <div className="level-bar-box">
      <span className="next-level">{isMaxLevel ? "MAX" : level + 1}</span>
      <div className="level-bar-back">
        <div
          className="level-bar-value"
          style={{
            height: `${progressPercent}%`,
          }}
        />
      </div>
      <span className="current-level">{level}</span>

      <span
        className="current-xp"
        style={{
          bottom: progressPercent > 0 ? `${progressPercent}%` : "20px",
        }}
      >
        {isMaxLevel ? "" : `${xpOnCurrentLevel}xp`}
      </span>

      <span className="required-xp">
        {isMaxLevel ? "" : `${xpRequiredForNext}xp`}
      </span>
    </div>
  );
}

export default LevelBar;

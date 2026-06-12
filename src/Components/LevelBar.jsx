import React from "react";
import "./../styles/LevelBar.css";

const LevelBar = React.memo(({ level, xp }) => {
  const levelsConfig = {
    1: { min: 0, max: 1000 },
    2: { min: 1000, max: 3500 },
    3: { min: 3500, max: 8000 },
    4: { min: 8000, max: 15000 },
    5: { min: 15000, max: 25000 },
    6: { min: 25000, max: 40000 },
    7: { min: 40000, max: 60000 },
    8: { min: 60000, max: 85000 },
    9: { min: 85000, max: 115000 },
    10: { min: 115000, max: 150000 },
    11: { min: 150000, max: 195000 },
    12: { min: 195000, max: 250000 },
    13: { min: 250000, max: 315000 },
    14: { min: 315000, max: 390000 },
    15: { min: 390000, max: 480000 },
    16: { min: 480000, max: 585000 },
    17: { min: 585000, max: 705000 },
    18: { min: 705000, max: 840000 },
    19: { min: 840000, max: 1000000 },
    20: { min: 1000000, max: 1200000 },
  };

  const currentRange = levelsConfig[level];
  const isMaxLevel = level >= 20;

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
      <div className="level-bar-container">
        <span className="required-xp">
          {isMaxLevel ? "" : `${xpRequiredForNext}xp`}
        </span>
        <div className="level-bar-back">
          <div
            className="level-bar-value"
            style={{
              height: `${progressPercent}%`,
            }}
          />
        </div>
        <span className="current-xp">
          {isMaxLevel ? "MAX XP" : `${xpOnCurrentLevel}xp`}
        </span>
      </div>
      <span className="current-level">LVL {level}</span>
    </div>
  );
});

LevelBar.displayName = "LevelBar";

export default LevelBar;

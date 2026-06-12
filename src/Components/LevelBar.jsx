import React from "react";
import "./../styles/LevelBar.css";

function LevelBar({ level, xp }) {
  const thresholds = [
    { level: 1, xp: 0 },
    { level: 2, xp: 50 },
    { level: 3, xp: 80 },
    { level: 4, xp: 110 },
    { level: 5, xp: 160 },
    { level: 6, xp: 220 },
    { level: 7, xp: 320 },
    { level: 8, xp: 450 },
    { level: 9, xp: 750 },
    { level: 10, xp: 1200 },
    { level: 11, xp: 1900 },
    { level: 12, xp: 2700 },
    { level: 13, xp: 3700 },
    { level: 14, xp: 5000 },
    { level: 15, xp: 6600 },
    { level: 16, xp: 8600 },
    { level: 17, xp: 11000 },
    { level: 18, xp: 13800 },
    { level: 19, xp: 17000 },
    { level: 20, xp: 21000 },
    { level: 21, xp: 26000 },
    { level: 22, xp: 32000 },
    { level: 23, xp: 39000 },
    { level: 24, xp: 47000 },
    { level: 25, xp: 55000 },
    { level: 26, xp: 64000 },
    { level: 27, xp: 73000 },
    { level: 28, xp: 82000 },
    { level: 29, xp: 91000 },
    { level: 30, xp: 100000 },
    { level: 31, xp: 110000 },
    { level: 32, xp: 120000 },
    { level: 33, xp: 130000 },
    { level: 34, xp: 140000 },
    { level: 35, xp: 150000 },
    { level: 36, xp: 160000 },
    { level: 37, xp: 170000 },
    { level: 38, xp: 180000 },
    { level: 39, xp: 190000 },
    { level: 40, xp: 200000 },
    { level: 41, xp: 211000 },
    { level: 42, xp: 222000 },
    { level: 43, xp: 233000 },
    { level: 44, xp: 244000 },
    { level: 45, xp: 255000 },
    { level: 46, xp: 266000 },
    { level: 47, xp: 277000 },
    { level: 48, xp: 288000 },
    { level: 49, xp: 299000 },
    { level: 50, xp: 310000 },
    { level: 51, xp: 322000 },
    { level: 52, xp: 334000 },
    { level: 53, xp: 346000 },
    { level: 54, xp: 358000 },
    { level: 55, xp: 370000 },
    { level: 56, xp: 382000 },
    { level: 57, xp: 394000 },
    { level: 58, xp: 406000 },
    { level: 59, xp: 418000 },
    { level: 60, xp: 430000 },
    { level: 61, xp: 443000 },
    { level: 62, xp: 456000 },
    { level: 63, xp: 469000 },
    { level: 64, xp: 482000 },
    { level: 65, xp: 495000 },
    { level: 66, xp: 508000 },
    { level: 67, xp: 521000 },
    { level: 68, xp: 534000 },
    { level: 69, xp: 547000 },
    { level: 70, xp: 560000 },
    { level: 71, xp: 574000 },
    { level: 72, xp: 574000 },
    { level: 73, xp: 602000 },
    { level: 74, xp: 616000 },
    { level: 75, xp: 630000 },
    { level: 76, xp: 644000 },
    { level: 77, xp: 658000 },
    { level: 78, xp: 672000 },
    { level: 79, xp: 686000 },
    { level: 80, xp: 700000 },
    { level: 81, xp: 715000 },
    { level: 82, xp: 730000 },
    { level: 83, xp: 745000 },
    { level: 84, xp: 760000 },
    { level: 85, xp: 775000 },
    { level: 86, xp: 790000 },
    { level: 87, xp: 805000 },
    { level: 88, xp: 820000 },
    { level: 89, xp: 835000 },
    { level: 90, xp: 850000 },
    { level: 91, xp: 865000 },
    { level: 92, xp: 880000 },
    { level: 93, xp: 895000 },
    { level: 94, xp: 910000 },
    { level: 95, xp: 925000 },
    { level: 96, xp: 940000 },
    { level: 97, xp: 955000 },
    { level: 98, xp: 970000 },
    { level: 99, xp: 985000 },
    { level: 100, xp: 1000000 },
  ];

  const currentLevelData = thresholds.find((t) => t.level === level) || {
    xp: 0,
  };
  const nextLevelData = thresholds.find((t) => t.level === level + 1);

  const isMaxLevel = !nextLevelData;

  let progressPercent = 100;
  let xpOnCurrentLevel = xp;
  let xpRequiredForNext = 0;

  if (!isMaxLevel) {
    const xpInThisLevel = xp - currentLevelData.xp;
    xpRequiredForNext = nextLevelData.xp - currentLevelData.xp;
    xpOnCurrentLevel = Math.max(xpInThisLevel, 0);
    progressPercent = Math.min(
      Math.max((xpOnCurrentLevel / xpRequiredForNext) * 100, 0),
      100,
    );
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
          bottom: "25px",
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

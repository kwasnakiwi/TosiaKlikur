import React from "react";
import "./../styles/LevelBar.css";
import { getXpThresholdForLevel } from "./Clicker";

function LevelBar({ level, xp }) {
  const currentLevelXpStart = getXpThresholdForLevel(level);
  const nextLevelXpStart = getXpThresholdForLevel(level + 1);

  const isMaxLevel = level >= 100;

  let progressPercent = 100;
  let xpOnCurrentLevel = xp;
  let xpRequiredForNext = 0;

  if (!isMaxLevel) {
    xpRequiredForNext = nextLevelXpStart - currentLevelXpStart;

    const xpInThisLevel = xp - currentLevelXpStart;
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

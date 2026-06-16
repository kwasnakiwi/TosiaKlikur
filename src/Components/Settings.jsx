import "./../styles/Settings.css";

function Settings({ setShowSettings, settings, setSettings, encryptData }) {
  const settingsConfig = [
    {
      id: "sett_show_click_effects",
      name: "Pokaż efekty kliknięcia",
      desc: "latające teksty i animacja głównego zdjęcia",
      value:
        settings.find((sett) => sett.id === "sett_show_click_effects")?.value ??
        true,
      type: "boolean",
    },
    {
      id: "sett_show_level_bar",
      name: "Pokaż pasek levela",
      desc: "pasek pokazujący twój level",
      value:
        settings.find((sett) => sett.id === "sett_show_level_bar")?.value ??
        true,
      type: "boolean",
    },
    {
      id: "sett_show_boosts",
      name: "Pokaż aktywne boosty",
      desc: "obiekty pokazujące aktywne boosty",
      value:
        settings.find((sett) => sett.id === "sett_show_boosts")?.value ?? true,
      type: "boolean",
    },
    {
      id: "sett_show_streak_bar",
      name: "Pokaż serie klikania",
      desc: "pasek pod tosią pokazujący twoją serie klikania :3",
      value:
        settings.find((sett) => sett.id === "sett_show_streak_bar")?.value ??
        true,
      type: "boolean",
    },
    {
      id: "sett_change_music_volume",
      name: "Zmień głośność muzyki",
      desc: "Dźwięki tła",
      value:
        settings.find((sett) => sett.id === "sett_change_music_volume")
          ?.value ?? 0.5,
      type: "range",
    },
    {
      id: "sett_change_effects_volume",
      name: "Zmień głośność efektów",
      desc: "Dźwięki klikania, głaskanie misi itp.",
      value:
        settings.find((sett) => sett.id === "sett_change_effects_volume")
          ?.value ?? 0.5,
      type: "range",
    },
  ];

  const handleCheckBoxSettingChange = (id) => {
    const exists = settings.some((sett) => sett.id === id);

    let newSettings;

    if (exists) {
      newSettings = settings.map((sett) =>
        sett.id === id ? { ...sett, value: !sett.value } : sett,
      );
    } else {
      const defaultConfig = settingsConfig.find((c) => c.id === id);
      newSettings = [
        ...settings,
        { id: id, value: !(defaultConfig?.value ?? true) },
      ];
    }

    setSettings(newSettings);

    localStorage.setItem("settings", encryptData(newSettings));
  };

  const handleRangeSettingChange = (id, value) => {
    const exists = settings.some((sett) => sett.id === id);
    const numericValue = parseFloat(value);

    let newSettings;

    if (exists) {
      newSettings = settings.map((sett) =>
        sett.id === id ? { ...sett, value: numericValue } : sett,
      );
    } else {
      newSettings = [...settings, { id: id, value: numericValue }];
    }

    setSettings(newSettings);
    localStorage.setItem("settings", encryptData(newSettings));
  };

  return (
    <>
      <div
        className="shop-back-overlay"
        onClick={() => setShowSettings(false)}
      />
      <div className="shop">
        <header className="shop-header">
          <h1 className="shop-title">Ustawienia</h1>
        </header>
        {settingsConfig.map((sett) => {
          let isChecked = false;
          if (sett.type === "boolean") isChecked = sett.value;

          return (
            <div className="setting" key={sett.id}>
              <div className="left">
                <h3 className="setting-name">{sett.name}</h3>
                <p className="setting-desc">{sett.desc}</p>
              </div>
              <div className="right">
                {sett.type === "boolean" && (
                  <input
                    type="checkbox"
                    name={sett.id}
                    checked={isChecked}
                    onChange={() => handleCheckBoxSettingChange(sett.id)}
                  />
                )}
                {sett.type === "range" && (
                  <div className="input-wrapper">
                    <input
                      type="range"
                      name={sett.id}
                      value={sett.value}
                      max={1}
                      min={0}
                      step={0.01}
                      style={{
                        background: `linear-gradient(to right, var(--status-available) ${sett.value * 100}%, #3e3e3e ${sett.value * 100}%)`,
                      }}
                      onChange={(e) =>
                        handleRangeSettingChange(sett.id, e.target.value)
                      }
                    />
                    <span className="setting-value">
                      {Math.round(sett.value * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Settings;

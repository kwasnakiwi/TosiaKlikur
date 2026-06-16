import "./../styles/Inventory.css";

function Inventory({
  setShowInventory,
  items,
  setItems,
  encryptData,
  boosts,
  setBoosts,
}) {
  const formatTime = (ms) => {
    if (ms <= 0) return "0:00";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const paddedMinutes = minutes < 10 && hours > 0 ? `0${minutes}` : minutes;

    if (hours > 0) {
      return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return `${minutes}:${paddedSeconds}`;
  };

  const useItem = (item) => {
    if (!item || item.amount <= 0) return;

    if (item.type === "consumable") {
      const activeBoost = boosts.find((b) => b.id === item.boost.id);
      const now = Date.now();

      let newEndTime;

      if (activeBoost && activeBoost.endTime > now) {
        newEndTime = activeBoost.endTime + item.duration;
      } else {
        newEndTime = now + item.duration;
      }

      const newBoost = {
        ...item.boost,
        endTime: newEndTime,
      };

      setBoosts((prev) => {
        const filtered = prev.filter((b) => b.id !== item.boost.id);
        const nextBoosts = [...filtered, newBoost];
        localStorage.setItem("boosts", encryptData(nextBoosts));
        return nextBoosts;
      });

      setItems((prev) => {
        const updatedItems = prev
          .map((i) => (i.id === item.id ? { ...i, amount: i.amount - 1 } : i))
          .filter((i) => i.amount > 0)

        localStorage.setItem("items", encryptData(updatedItems));
        return updatedItems;
      });
    }
  };

  return (
    <>
      <div
        className="shop-back-overlay"
        onClick={() => setShowInventory(false)}
      />
      <div className="shop inventory">
        <header className="shop-header">
          <h1 className="shop-title">Ekwipunek</h1>
        </header>
        {items.map((item, i) => {
          return (
            <div key={i} className="shop-offer inv">
              <img className="shop-offer-img inv" src={item.img} alt="" />
              <h3 className="shop-offer-name">{item.name}</h3>
              <p className="shop-offer-desc">{item.desc}</p>
              <span
                className="shop-offer-price"
                style={{ color: "cornflowerblue", marginBottom: "5px" }}
              >
                Czas trwania: {formatTime(item.duration)}
              </span>
              <span
                className="shop-offer-price amount"
                style={{ color: "cornflowerblue", marginBottom: "5px" }}
              >
                Ilość: {item.amount}
              </span>
              <button
                className="shop-offer-button"
                onClick={() =>
                  item.type === "consumable" ? useItem(item) : ""
                }
              >
                {item.type === "consumable" && "Użyj"}
              </button>
            </div>
          );
        })}
        {items.length === 0 && <div className="no-items">BRAK PRZEDMIOTÓW</div>}
      </div>
    </>
  );
}

export default Inventory;

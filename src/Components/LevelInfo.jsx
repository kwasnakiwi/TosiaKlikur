import "./../styles/LevelBar.css";

function LevelInfo({ currentLevel, setShowInfo }) {
  return (
    <>
      <div className="shop-back-overlay" onClick={() => setShowInfo(false)} />
      <div className="shop">
        <header className="shop-header">
          <h1 className="shop-title">System nagród</h1>
        </header>
        <div className="reward-section">
          <h3>Punkty za awans</h3>
          <p>
            Za każdy zdobyty poziom otrzymujesz darmowy zastrzyk kliknięć.
            Liczba ta rośnie wraz z Twoim levelem według poniższego wzoru
            matematycznego:
          </p>
          <div className="formula-box">
            <strong>
              Nagroda = 100 &times; (Poziom)<sup>1.3</sup>
            </strong>
          </div>
          <h3>Misiaxy</h3>
          <p>
            Misiaxy to waluta premium, którą otrzymujesz za kluczowe postępy w
            grze. Oto dokładna rozpiska, za co je dostaniesz:
          </p>
          <table className="misiaxy-table">
            <thead>
              <tr>
                <th>Osiągnięcie</th>
                <th>Nagroda</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Co 5 poziomów (5, 15, 20...)</td>
                <td>
                  <strong>+([Poziom] / 2) Misiaxów</strong>
                </td>
              </tr>
              <tr>
                <td>Poziom 10</td>
                <td>
                  <strong>+25 Misiaxów</strong>
                </td>
              </tr>
              <tr>
                <td>Poziom 25</td>
                <td>
                  <strong>+50 Misiaxów</strong>
                </td>
              </tr>
              <tr>
                <td>Poziom 50</td>
                <td>
                  <strong>+100 Misiaxów</strong>
                </td>
              </tr>
              <tr>
                <td>Poziom 100</td>
                <td>
                  <strong>+200 Misiaxów</strong>
                </td>
              </tr>
              <tr>
                <td>Poziom 200</td>
                <td>
                  <strong>+400 Misiaxów</strong>
                </td>
              </tr>
              <tr>
                <td>Poziom 250</td>
                <td>
                  <strong>+500 Misiaxów</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="hint">
            <em>*Wynik jest zawsze zaokrąglany do pełnej liczby.</em>
          </p>
        </div>
      </div>
    </>
  );
}

export default LevelInfo;

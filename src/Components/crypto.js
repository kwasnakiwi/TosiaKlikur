const SECRET_KEY = "Tyr_devtojebanycfellito2137!#2445";

// Funkcja szyfrująca (zmienia tekst/liczbę w nieczytelny ciąg znaków)
export const encryptData = (data) => {
  const stringData = String(data);
  let result = "";

  for (let i = 0; i < stringData.charCodeAt(i); i++) {
    // Pobieramy kod znaku z danych i kod znaku z klucza
    const charCode = stringData.charCodeAt(i);
    const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);

    // Operacja XOR (^) oraz przesunięcie bitowe (+13) dla zmylenia przeciwnika
    const encryptedChar = (charCode ^ keyChar) + 13;

    // Łączymy znaki specjalnym separatorem, żeby liczby się nie zlepiły
    result += encryptedChar + "-";
  }

  // Na koniec wrzucamy to w Base64, żeby w localStorage nie było dziwnych znaków nowej linii
  return btoa(result.slice(0, -1));
};

// Funkcja deszyfrująca (przywraca oryginalną wartość)
export const decryptData = (cipherText, defaultValue = "") => {
  if (!cipherText) return defaultValue;

  try {
    // Odkodowujemy z Base64 do naszych liczb z myślnikami
    const decodedRaw = atob(cipherText);
    const charArray = decodedRaw.split("-");
    let result = "";

    for (let i = 0; i < charArray.length; i++) {
      const encryptedChar = parseInt(charArray[i], 10) - 13;
      const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);

      const originalChar = String.fromCharCode(encryptedChar ^ keyChar);
      result += originalChar;
    }

    return result;
  } catch (error) {
    // Jeśli kolega majstrował przy pliku i skasował jakiś znak,
    // funkcja się wywali - wtedy zwracamy wartość domyślną (np. 0), czyli resetujemy gościa!
    return defaultValue;
  }
};

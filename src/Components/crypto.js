const SECRET_KEY = "Tyr_devtojebanycfellito2137!#2445";

// Funkcja szyfrująca (zmienia tekst/liczbe/obiekt w nieczytelny ciąg znaków)
export const encryptData = (data) => {
  if (data === undefined || data === null) return "";

  // Jeśli przekazano obiekt lub tablicę, zamieniamy na JSON string, inaczej na zwykły string
  const stringData =
    typeof data === "object" ? JSON.stringify(data) : String(data);
  let result = "";

  // POPRAWIONO: Pętla musi iść do końca długości stringa (stringData.length)
  for (let i = 0; i < stringData.length; i++) {
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

// Funkcja deszyfrująca (przywraca oryginalną wartość i odpowiedni typ)
export const decryptData = (cipherText, defaultValue = "") => {
  if (!cipherText) return defaultValue;

  try {
    // Odkodowujemy z Base64 do naszych liczb z myślnikami
    const decodedRaw = atob(cipherText);
    const charArray = decodedRaw.split("-");
    let result = "";

    for (let i = 0; i < charArray.length; i++) {
      if (!charArray[i]) continue; // Zabezpieczenie przed pustym elementem

      const encryptedChar = parseInt(charArray[i], 10) - 13;
      const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);

      const originalChar = String.fromCharCode(encryptedChar ^ keyChar);
      result += originalChar;
    }

    // AUTOMATYCZNE PRZYWRACANIE TYPÓW (ułatwia życie w React):

    // 1. Jeśli to tablica lub obiekt JSON (np. upgrades lub skins) -> parsujemy
    if (
      (result.startsWith("{") && result.endsWith("}")) ||
      (result.startsWith("[") && result.endsWith("]"))
    ) {
      return JSON.parse(result);
    }

    // 2. Jeśli to liczba (np. score) -> zwracamy jako typ Number
    if (!isNaN(result) && result.trim() !== "") {
      return Number(result);
    }

    // 3. Jeśli to boolean (np. auto_clicker_active)
    if (result === "true") return true;
    if (result === "false") return false;

    return result;
  } catch (error) {
    // Jeśli kolega majstrował przy pliku i skasował jakiś znak,
    // funkcja się wywali - wtedy zwracamy wartość domyślną
    console.warn("Wykryto manipulację przy zapisie lub błąd dekodowania!");
    return defaultValue;
  }
};

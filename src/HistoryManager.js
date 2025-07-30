import { gameState } from "./gameState";
import refs from "./refs";

const STAT_KEY = "stat";

export function localStorageUpdate() {
  const localStorageStat = localStorage.getItem(STAT_KEY);

  if (localStorageStat !== null) {
    try {
      savedHistory = JSON.parse(localStorageStat);
      if (!Array.isArray(savedHistory)) {
        savedHistory = [];
      }
    } catch (e) {
      console.warn("Invalid JSON в localStorage. History cleaned.");
      savedHistory = [];
    }
  }

  const totalStat = {
    cards: gameState.countOfCards,
    mistakes: gameState.totalMistakes,
    time: refs.timer.textContent,
  };

  gameState.history.push(totalStat);

  localStorage.setItem(STAT_KEY, JSON.stringify(gameState.history));
}

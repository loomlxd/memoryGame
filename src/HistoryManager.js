import { gameState } from "./gameState";
import refs from "./refs";

export function localStorageUpdate() {
  if (localStorage.getItem("stat") !== null) {
    const savedHistory = localStorage.getItem("stat");
    gameState.history = JSON.parse(savedHistory);
  }

  const totalStat = {
    cards: gameState.countOfCards,
    mistakes: gameState.totalMistakes,
    time: refs.timer.textContent,
  };

  gameState.history.push(totalStat);

  localStorage.setItem("stat", JSON.stringify(gameState.history));
}

export function historyPageUpdate() {
  const allHistory = localStorage.getItem("stat");
  if (allHistory === null) {
    return;
  }

  const textHistoryForHtml = JSON.parse(allHistory)
    .map(({ cards, mistakes, time }, id) => {
      return `<div class="inside-history">
            <span>${
              id + 1
            }:</span> <span>cards: ${cards}</span> <span>mistakes: ${mistakes}</span>
            <span>time: ${time}</span>
          </div>`;
    })
    .join("");

  refs.historyInfo.innerHTML = textHistoryForHtml;
}

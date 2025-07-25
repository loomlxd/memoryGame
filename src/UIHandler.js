import refs from "./refs";
import { showGameProcess } from "./GameEngine";
import { gameState } from "./gameState";

refs.levelButtons[0].classList.add("active");

refs.startBtn.addEventListener("click", onStartBtnClick);

function onStartBtnClick() {
  refs.startPage.classList.add("disable");
  showGameProcess();
}

refs.retryBtn.addEventListener("click", onRetryBtnClick);

function onRetryBtnClick() {
  refs.endPage.classList.remove("active");
  refs.mistakesCount.textContent = gameState.totalMistakes;
  showGameProcess();
}

refs.checkHistoryBtn.forEach((btn) => {
  btn.addEventListener("click", onCheckHistoryBtnClick);
});

function onCheckHistoryBtnClick(e) {
  e.target.classList.add("disable");
  refs.historyPage.classList.add("active");
  refs.closeHisBtn.classList.add("active");
}

refs.closeHisBtn.addEventListener("click", onCloseHisBtnClick);

function onCloseHisBtnClick(e) {
  refs.historyPage.classList.remove("active");
  refs.checkHistoryBtn.forEach((btn) => {
    btn.classList.remove("disable");
  });
}

refs.clearHisBtn.addEventListener("click", onClearHisBtnClick);

function onClearHisBtnClick() {
  refs.historyInfo.innerHTML = "";
  localStorage.removeItem("stat");
  gameState.history = [];
}

export function reverseCards() {
  gameState.trueAnswers.splice(-2);
  gameState.totalMistakes += 1;
  showMistakeCount();
  setTimeout(() => {
    reverseCardsToBack();
  }, 500);
}

function reverseCardsToBack() {
  const reverseFront = document.querySelectorAll(".front-card.active");
  reverseFront.forEach((activeElement) => {
    if (!gameState.checkCards.includes(activeElement)) {
      return;
    }
    activeElement.classList.remove("active");
  });
  gameState.checkCards = [];
  setTimeout(() => {
    const reverseBack = document.querySelectorAll(".back-card.active");
    reverseBack.forEach((activeElement) => {
      if (gameState.trueAnswers.includes(activeElement)) {
        return;
      }
      activeElement.classList.remove("active");
    });
  }, 200);
}

function showMistakeCount() {
  refs.mistakesCount.textContent = gameState.totalMistakes;
}

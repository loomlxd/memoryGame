import { reverseCards } from "./UIHandler";
import {
  changeCardsStyles,
  animateBackground,
  createBlockByAllCards,
} from "./CardRenderer";
import refs from "./refs";
import { localStorageUpdate } from "./HistoryManager";
import { historyPageUpdate } from "./UIHandler";
import Timer from "./timer";
import { gameState } from "./gameState";

const timer = new Timer(refs.timer);

const cards = [
  "🐸",
  "🐸",
  "🐋",
  "🐋",
  "🦞",
  "🦞",
  "🐥",
  "🐥",
  "🐵",
  "🐵",
  "🐶",
  "🐶",
  "🍀",
  "🍀",
  "🦜",
  "🦜",
  "☀️",
  "☀️",
  "🌈",
  "🌈",
  "🔥",
  "🔥",
  "🌚",
  "🌚",
  "🍎",
  "🍎",
  "🍇",
  "🍇",
  "⚽️",
  "⚽️",
  "🚗",
  "🚗",
];

export function shuffleCardsForFirstRound(cards, count) {
  const splicedCards = cards.slice(0, count);
  for (let i = splicedCards.length - 1; i > 0; i -= 1) {
    const random = Math.floor(Math.random() * (i + 1));
    [splicedCards[i], splicedCards[random]] = [
      splicedCards[random],
      splicedCards[i],
    ];
  }

  return splicedCards;
}

export let randomCards = shuffleCardsForFirstRound(
  cards,
  gameState.countOfCards
);

let clickEventOn;

export function onBackCardClick(e) {
  const allBackCards = document.querySelectorAll(".back-card");
  allBackCards.forEach((backCard) => {
    backCard.removeEventListener("click", onBackCardClick);
  });
  e.target.classList.add("active");

  setTimeout(() => {
    const allFrontCards = document.querySelectorAll(".front-card");
    const elements = [...allFrontCards];
    const element = elements.find(
      (frontCard) => frontCard.dataset.id === e.target.dataset.id
    );
    element.classList.add("active");
    gameState.checkCards.push(element);
    gameState.trueAnswers.push(e.target);
    if (gameState.checkCards.length === 2) {
      clearTimeout(clickEventOn);
      allBackCards.forEach((backCard) => {
        backCard.removeEventListener("click", onBackCardClick);
      });
      setTimeout(() => {
        allBackCards.forEach((backCard) => {
          backCard.addEventListener("click", onBackCardClick);
        });
      }, 700);
      if (
        gameState.checkCards[0].textContent ===
        gameState.checkCards[1].textContent
      ) {
        gameState.checkCards = [];
        if (elements.every((element) => element.classList.contains("active"))) {
          showEndPage();
        }
      } else {
        reverseCards();
      }
    }
  }, 200);
  clickEventOn = setTimeout(() => {
    allBackCards.forEach((backCard) => {
      backCard.addEventListener("click", onBackCardClick);
    });
  }, 200);
}

export function reverseCardsToBackInEnd() {
  const reverseFront = document.querySelectorAll(".front-card.active");
  reverseFront.forEach((activeElement) => {
    activeElement.classList.remove("active");
  });
  gameState.checkCards = [];
  setTimeout(() => {
    const reverseBack = document.querySelectorAll(".back-card.active");
    reverseBack.forEach((activeElement) => {
      activeElement.classList.remove("active");
    });
  }, 200);
}
function showEndPage() {
  setTimeout(() => {
    refs.mistakes.classList.remove("active");
    timer.stop();
    refs.timer.textContent = "00:00:00";
    refs.timer.classList.remove("active");
    refs.endPage.classList.add("active");
  }, 500);

  localStorageUpdate();
  historyPageUpdate();

  refs.finishTime.textContent = refs.timer.textContent;
  refs.mistakesCountInEndPage.textContent = gameState.totalMistakes;

  setTimeout(() => {
    reverseCardsToBackInEnd();
    setTimeout(() => {
      animateBackground();
    }, 700);
  }, 500);

  const allLevelbtns = document.querySelectorAll(".button-level");
  allLevelbtns.forEach((btn) => {
    if (Number(btn.textContent) === gameState.countOfCards) {
      btn.classList.add("active");
    }
  });

  gameState.checkCards = [];
  gameState.trueAnswers = [];
  gameState.totalMistakes = 0;
  randomCards = shuffleCardsForFirstRound(cards, gameState.countOfCards);
}

export function showGameProcess() {
  refs.mistakes.classList.add("active");
  refs.timer.classList.add("active");
  const allBackCards = document.querySelectorAll(".back-card");
  let elements = [...allBackCards];
  for (let i = 0; i < allBackCards.length; i += 1) {
    elements[i].style.transition = "transform 0.2s linear";
    elements[i].style.transform = `translateX(0px) translateY(0px)`;
  }
  setTimeout(() => {
    refs.backCards.innerHTML = createBlockByAllCards(randomCards, "back");
    refs.frontCards.innerHTML = createBlockByAllCards(randomCards, "front");
    const allBackCards = document.querySelectorAll(".back-card");
    changeCardsStyles(gameState.countOfCards);
    allBackCards.forEach((backCard) => {
      backCard.style.transition = "transform 0.2s linear";
      backCard.addEventListener("click", onBackCardClick);
    });
    setTimeout(() => {
      reverseCardsToFrontInStart();
      if (gameState.countOfCards === 8) {
        setTimeout(() => {
          reverseCardsToBackInEnd();
          timer.start();
        }, 2000);
      } else if (gameState.countOfCards === 16) {
        setTimeout(() => {
          reverseCardsToBackInEnd();
          timer.start();
        }, 4000);
      } else if (gameState.countOfCards === 32) {
        setTimeout(() => {
          reverseCardsToBackInEnd();
          timer.start();
        }, 6000);
      }
    }, 200);
  }, 200);
}

function reverseCardsToFrontInStart() {
  const reverseBack = document.querySelectorAll(".back-card");
  reverseBack.forEach((activeElement) => {
    activeElement.classList.add("active");
  });
  gameState.checkCards = [];
  setTimeout(() => {
    const reverseFront = document.querySelectorAll(".front-card");
    reverseFront.forEach((activeElement) => {
      activeElement.classList.add("active");
    });
  }, 200);
}

refs.levelButtons.forEach((btn) => {
  btn.addEventListener("click", onLevelButtonClick);
});

function onLevelButtonClick(e) {
  if (e.target.classList.contains("active")) {
    return;
  }

  const activeLevelBtn = document.querySelectorAll(".button-level.active");
  activeLevelBtn.forEach((btn) => {
    btn.classList.remove("active");
  });

  e.target.classList.add("active");

  gameState.countOfCards = Number(e.target.textContent);

  randomCards = shuffleCardsForFirstRound(cards, gameState.countOfCards);
  animateBackground();
  changeCardsStyles(gameState.countOfCards);
}

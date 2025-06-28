import "./style.css";
import Timer from "./timer";

const refs = {
  gameBoard: document.querySelector(".game-board"),
  frontCards: document.querySelector(".front"),
  backCards: document.querySelector(".back"),
  startBtn: document.querySelector(".start-button"),
  startPage: document.querySelector(".start-page"),
  mistakes: document.querySelector(".mistakes"),
  endPage: document.querySelector(".end-page"),
  retryBtn: document.querySelector(".retry-button"),
  mistakesCount: document.querySelector(".mistakes > span"),
  mistakesCountInEndPage: document.querySelector(".end-mis > span"),
  levelButtons: document.querySelectorAll(".button-level"),
  timer: document.querySelector(".timer"),
  finishTime: document.querySelector(".end-time > span"),
  checkHistoryBtn: document.querySelectorAll(".check-history-img"),
  historyPage: document.querySelector(".history-page"),
  closeHisBtn: document.querySelector(".close-his-btn"),
  clearHisBtn: document.querySelector(".clear-his-btn"),
  historyInfo: document.querySelector(".stats-his"),
};

const newTimer = new Timer(refs.timer);

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

let checkCards = [];
let trueAnswers = [];
let totalMistakes = 0;
let countOfCards = 8;
let animationInterval = null;
let history = [];

historyPageUpdate();

function shuffleCardsForFirstRound(cards, count) {
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

let randomCards = shuffleCardsForFirstRound(cards, countOfCards);

function createBlockByAllFrontCards(randomCards) {
  return randomCards
    .map((card, i) => `<div class='front-card' data-id='${i}'>${card}</div>`)
    .join("");
}

function createBlockByAllBackCards(arr) {
  return arr
    .map(
      (card, i) =>
        `<img src="https://i.pinimg.com/736x/38/52/18/385218163958b5817ded6373dd9f01a6.jpg" alt="" class='back-card' data-id='${i}'>`
    )
    .join("");
}

animateBackground();

function animateBackground() {
  clearInterval(animationInterval);
  refs.backCards.innerHTML = createBlockByAllBackCards(randomCards);
  refs.frontCards.innerHTML = createBlockByAllFrontCards(randomCards);
  changeCardsStyles(countOfCards);
  refs.allBackCards = document.querySelectorAll(".back-card");
  setTimeout(() => {
    let elements = [...refs.allBackCards];
    for (let i = 0; i < refs.allBackCards.length; i += 1) {
      let y = Math.floor(Math.random() * 401) - 200;
      let x = Math.floor(Math.random() * 801) - 400;
      elements[i].style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
    animationInterval = setInterval(() => {
      for (let i = 0; i < refs.allBackCards.length; i += 1) {
        let y = Math.floor(Math.random() * 401) - 200;
        let x = Math.floor(Math.random() * 801) - 400;
        elements[i].style.transform = `translateX(${x}px) translateY(${y}px)`;
      }
    }, 6000);
  }, 100);
}

refs.levelButtons[0].classList.add("active");

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

  countOfCards = Number(e.target.textContent);

  randomCards = shuffleCardsForFirstRound(cards, countOfCards);
  animateBackground();
  changeCardsStyles(countOfCards);
}

function changeCardsStyles(count) {
  if (count === 8) {
    refs.backCards.style.gridTemplateColumns = "repeat(4, 1fr)";
    refs.backCards.style.gridTemplateRows = "repeat(2, 1fr)";
    refs.frontCards.style.gridTemplateColumns = "repeat(4, 1fr)";
    refs.frontCards.style.gridTemplateRows = "repeat(2, 1fr)";
  } else if (count === 16) {
    refs.backCards.style.gridTemplateColumns = "repeat(8, 1fr)";
    refs.backCards.style.gridTemplateRows = "repeat(2, 1fr)";
    refs.frontCards.style.gridTemplateColumns = "repeat(8, 1fr)";
    refs.frontCards.style.gridTemplateRows = "repeat(2, 1fr)";
    const elementsBackCards = [...refs.backCards.children];
    const elementsFrontCards = [...refs.frontCards.children];
    elementsBackCards.forEach((card) => {
      card.style.width = "170px";
      card.style.height = "250px";
    });
    elementsFrontCards.forEach((card) => {
      card.style.width = "170px";
      card.style.height = "250px";
    });
  } else if (count === 32) {
    refs.backCards.style.gridTemplateColumns = "repeat(8, 1fr)";
    refs.backCards.style.gridTemplateRows = "repeat(4, 1fr)";
    refs.frontCards.style.gridTemplateColumns = "repeat(8, 1fr)";
    refs.frontCards.style.gridTemplateRows = "repeat(4, 1fr)";
    const elementsBackCards = [...refs.backCards.children];
    const elementsFrontCards = [...refs.frontCards.children];
    elementsBackCards.forEach((card) => {
      card.style.width = "125px";
      card.style.height = "200px";
    });
    elementsFrontCards.forEach((card) => {
      card.style.width = "125px";
      card.style.height = "200px";
    });
  }
}

refs.startBtn.addEventListener("click", onStartBtnClick);

function onStartBtnClick() {
  refs.startPage.classList.add("disable");
  showGameProcess();
}

function onBackCardClick(e) {
  refs.allBackCards.forEach((backCard) => {
    backCard.removeEventListener("click", onBackCardClick);
  });
  e.target.classList.add("active");

  setTimeout(() => {
    const elements = [...refs.allFrontCards];
    const element = elements.find(
      (frontCard) => frontCard.dataset.id === e.target.dataset.id
    );
    element.classList.add("active");
    checkCards.push(element);
    trueAnswers.push(e.target);
    if (checkCards.length === 2) {
      clearTimeout(clickEventOn);
      refs.allBackCards.forEach((backCard) => {
        backCard.removeEventListener("click", onBackCardClick);
      });
      setTimeout(() => {
        refs.allBackCards.forEach((backCard) => {
          backCard.addEventListener("click", onBackCardClick);
        });
      }, 700);
      if (checkCards[0].textContent === checkCards[1].textContent) {
        checkCards = [];
        if (elements.every((element) => element.classList.contains("active"))) {
          showEndPage();
        }
      } else {
        reverseCards();
      }
    }
  }, 200);
  const clickEventOn = setTimeout(() => {
    refs.allBackCards.forEach((backCard) => {
      backCard.addEventListener("click", onBackCardClick);
    });
  }, 200);
}

function reverseCards() {
  trueAnswers.splice(-2);
  totalMistakes += 1;
  showMistakeCount();
  setTimeout(() => {
    reverseCardsToBack();
  }, 500);
}

function reverseCardsToBack() {
  const reverseFront = document.querySelectorAll(".front-card.active");
  reverseFront.forEach((activeElement) => {
    if (!checkCards.includes(activeElement)) {
      return;
    }
    activeElement.classList.remove("active");
  });
  checkCards = [];
  setTimeout(() => {
    const reverseBack = document.querySelectorAll(".back-card.active");
    reverseBack.forEach((activeElement) => {
      if (trueAnswers.includes(activeElement)) {
        return;
      }
      activeElement.classList.remove("active");
    });
  }, 200);
}

function reverseCardsToBackInEnd() {
  const reverseFront = document.querySelectorAll(".front-card.active");
  reverseFront.forEach((activeElement) => {
    activeElement.classList.remove("active");
  });
  checkCards = [];
  setTimeout(() => {
    const reverseBack = document.querySelectorAll(".back-card.active");
    reverseBack.forEach((activeElement) => {
      activeElement.classList.remove("active");
    });
  }, 200);
}

function reverseCardsToFrontInStart() {
  const reverseBack = document.querySelectorAll(".back-card");
  reverseBack.forEach((activeElement) => {
    activeElement.classList.add("active");
  });
  checkCards = [];
  setTimeout(() => {
    const reverseFront = document.querySelectorAll(".front-card");
    reverseFront.forEach((activeElement) => {
      activeElement.classList.add("active");
    });
  }, 200);
}

function showEndPage() {
  setTimeout(() => {
    refs.mistakes.classList.remove("active");
    newTimer.stop();
    refs.timer.textContent = "00:00:00";
    refs.timer.classList.remove("active");
    refs.endPage.classList.add("active");
  }, 500);

  localStorageUpdate();
  historyPageUpdate();

  refs.finishTime.textContent = refs.timer.textContent;
  refs.mistakesCountInEndPage.textContent = totalMistakes;

  setTimeout(() => {
    reverseCardsToBackInEnd();
    setTimeout(() => {
      animateBackground();
    }, 700);
  }, 500);

  const allLevelbtns = document.querySelectorAll(".button-level");
  allLevelbtns.forEach((btn) => {
    if (Number(btn.textContent) === countOfCards) {
      btn.classList.add("active");
    }
  });

  checkCards = [];
  trueAnswers = [];
  totalMistakes = 0;
  randomCards = shuffleCardsForFirstRound(cards, countOfCards);
}

refs.retryBtn.addEventListener("click", onRetryBtnClick);

function onRetryBtnClick() {
  refs.endPage.classList.remove("active");
  refs.mistakesCount.textContent = totalMistakes;
  showGameProcess();
}

function showGameProcess() {
  refs.mistakes.classList.add("active");
  refs.timer.classList.add("active");
  let elements = [...refs.allBackCards];
  for (let i = 0; i < refs.allBackCards.length; i += 1) {
    elements[i].style.transition = "transform 0.2s linear";
    elements[i].style.transform = `translateX(0px) translateY(0px)`;
  }
  setTimeout(() => {
    refs.backCards.innerHTML = createBlockByAllBackCards(randomCards);
    refs.frontCards.innerHTML = createBlockByAllFrontCards(randomCards);
    refs.allFrontCards = document.querySelectorAll(".front-card");
    refs.allBackCards = document.querySelectorAll(".back-card");
    changeCardsStyles(countOfCards);
    refs.allBackCards.forEach((backCard) => {
      backCard.style.transition = "transform 0.2s linear";
      backCard.addEventListener("click", onBackCardClick);
    });
    setTimeout(() => {
      reverseCardsToFrontInStart();
      if (countOfCards === 8) {
        setTimeout(() => {
          reverseCardsToBackInEnd();
          newTimer.start();
        }, 1000);
      } else if (countOfCards === 16) {
        setTimeout(() => {
          reverseCardsToBackInEnd();
          newTimer.start();
        }, 2000);
      } else if (countOfCards === 32) {
        setTimeout(() => {
          reverseCardsToBackInEnd();
          newTimer.start();
        }, 4000);
      }
    }, 200);
  }, 200);
}

function showMistakeCount() {
  refs.mistakesCount.textContent = totalMistakes;
}

function localStorageUpdate() {
  if (localStorage.getItem("stat") !== null) {
    const savedHistory = localStorage.getItem("stat");
    history = JSON.parse(savedHistory);
  }

  const totalStat = {
    cards: countOfCards,
    mistakes: totalMistakes,
    time: refs.timer.textContent,
  };

  history.push(totalStat);

  localStorage.setItem("stat", JSON.stringify(history));
}

function historyPageUpdate() {
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
  history = [];
}

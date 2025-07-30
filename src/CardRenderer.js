import { gameState } from "./gameState";
import refs from "./refs";
import { randomCards } from "./GameEngine";

const CARD_CONFIG = {
  8: { cols: 4, rows: 2 },
  16: { cols: 8, rows: 2, w: 170, h: 250 },
  32: { cols: 8, rows: 4, w: 125, h: 200 },
};

function changeCardsStyle(count) {
  const cfg = CARD_CONFIG[count];

  [refs.backCards, refs.frontCards].forEach((container) => {
    container.style.gridTemplateColumns = `repeat(${cfg.cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${cfg.rows}, 1fr)`;

    [...container.children].forEach((card) => {
      if (cfg.w) {
        card.style.width = `${cfg.w}px`;
        card.style.height = `${cfg.h}px`;
      } else {
        card.style.removeProperty("width");
        card.style.removeProperty("height");
      }
    });
  });
}

export function changeCardsStyles(count) {
  if (count === 8) {
    changeCardsStyle(8);
  } else if (count === 16) {
    changeCardsStyle(16);
  } else if (count === 32) {
    changeCardsStyle(32);
  } else {
    changeCardsStyle(8);
  }
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function createBlockByAllCards(cards, type) {
  return cards
    .map((card, i) => {
      switch (type) {
        case "front":
          return `<div class='front-card' data-id='${i}'>${escapeHTML(
            card
          )}</div>`;
        case "back":
          return `<img src="https://i.pinimg.com/736x/38/52/18/385218163958b5817ded6373dd9f01a6.jpg" alt="" class='back-card' data-id='${i}'>`;
        default:
          return console.error("Bad type of card");
      }
    })
    .join("");
}

export function transformBackCards(elements, cards) {
  for (let i = 0; i < cards.length; i += 1) {
    let y = Math.floor(Math.random() * 401) - 200;
    let x = Math.floor(Math.random() * 801) - 400;
    elements[i].style.transform = `translateX(${x}px) translateY(${y}px)`;
  }
}

export function animateBackground() {
  clearInterval(gameState.animationInterval);
  refs.backCards.innerHTML = "";
  refs.backCards.insertAdjacentHTML(
    "beforeend",
    createBlockByAllCards(randomCards, "back")
  );
  changeCardsStyles(gameState.countOfCards);
  const allBackCards = document.querySelectorAll(".back-card");
  setTimeout(() => {
    let elements = [...allBackCards];
    transformBackCards(elements, allBackCards);
    gameState.animationInterval = setInterval(() => {
      transformBackCards(elements, allBackCards);
    }, 6000);
  }, 100);
}

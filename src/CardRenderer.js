import { gameState } from "./gameState";
import refs from "./refs";
import { randomCards } from "./GameEngine";

export function changeCardsStyles(count) {
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

export function createBlockByAllCards(cards, type) {
  return cards
    .map((card, i) => {
      switch (type) {
        case "front":
          return `<div class='front-card' data-id='${i}'>${card}</div>`;
        case "back":
          return `<img src="https://i.pinimg.com/736x/38/52/18/385218163958b5817ded6373dd9f01a6.jpg" alt="" class='back-card' data-id='${i}'>`;
        default:
          return;
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
  refs.backCards.innerHTML = createBlockByAllCards(randomCards, "back");
  refs.frontCards.innerHTML = createBlockByAllCards(randomCards, "front");
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

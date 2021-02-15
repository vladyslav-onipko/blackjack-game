class Deck {
  _names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  _suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];

  cards = [];

  constructor() {
    this.makeDeck();
    this.startDrag();
  }

  makeDeck() {
    for (let i = 0; i < this._suits.length; i++) {
      for (let j = 0; j < this._names.length; j++) {
        let value = j+1;
        let name = this._names[j];
        let suit = this._suits[i];
        const card = new Card(value, name, suit);
        this.cards.push(card);
      }
    }
    return this.cards;
  }

  takeCard() {
    if (this.cards.length) {
      const randomNumber  = Math.floor(Math.random() * (51 - 1 + 1) + 1);
      return this.cards[randomNumber];
    }
  }

  startDrag() {
    const deck = document.querySelector('.deck__img');
    deck.addEventListener('dragstart', event => {
      event.dataTransfer.affectAllowed = 'move';
    });
  }
}

class Card {
  constructor (value, name, suit) {
    this.value = value;
    this.name = name;
    this.suit = suit;
  };
}

class Computer {

  putCard(position) {
    const img = '<img src="./images/deck.jpg" alt="card">';
    const card = document.querySelector(`.cards__list :nth-child(${position})`);
    card.innerHTML = img;
  }
}

class Score {
  playerScoreElement = document.getElementById('user').querySelector('p');
  computerScoreElement = document.getElementById('computer').querySelector('p');

  checkWinner(playerScore, computerScore) {
    if (playerScore > 21 && computerScore <= 21) {
      document.getElementById('lost').classList.add('show');
      document.querySelector('.backdrop').classList.add('open');
      setTimeout(() => {
        document.getElementById('lost').classList.remove('show');
        document.querySelector('.backdrop').classList.remove('open');
        Game.newGame();
      }, 3000)

    } else if (playerScore <= 21 && computerScore > 21) {
      document.getElementById('won').classList.add('show');
      document.querySelector('.backdrop').classList.add('open');
      setTimeout(() => {
        document.querySelector('.backdrop').classList.remove('open');
        document.getElementById('won').classList.remove('show');
        Game.newGame();
      }, 3000)

    } else if (playerScore >= 21 && computerScore >= 21) {
      document.getElementById('draw').classList.add('show');
      document.querySelector('.backdrop').classList.add('open');
      setTimeout(() => {
        document.querySelector('.backdrop').classList.remove('open');
        document.getElementById('draw').classList.remove('show');
        Game.newGame();
      }, 3000)
    }
  }

  calcScore(playerCard, computerCard) {
    let currentPlayerScore = +this.playerScoreElement.textContent;
    let currentComputerScore = +this.computerScoreElement.textContent;

    const score = {
      player: currentPlayerScore + playerCard,
      computer: currentComputerScore + computerCard,
    };

    if (currentPlayerScore < 21 && currentComputerScore < 21) {
      this.playerScoreElement.textContent = score.player;
      this.computerScoreElement.textContent = score.computer;

    } else {
      this.checkWinner(score.player, score.computer);
    }
    return score;
  }
}

class Player extends Deck {
  playerCards = document.querySelector('.cards').nextElementSibling;
  static position = 1;

  constructor() {
    super();
    this.connectDroppable();
  }
  
  getCardTarget(event) {
    return event.target.closest('.card');
  }

  drowCard(card, event) {
    const suitElement = document.createElement('div');
    const nameElement = document.createElement('div');

    const target = this.getCardTarget(event);

    switch(card.suit) {
      case 'Hearts' : suitElement.innerHTML = '&#9829';
                      suitElement.style.color = '#DD4312';
      break;

      case 'Diamonds' : suitElement.innerHTML = '&#9830';
                        suitElement.style.color = '#DD4312';
      break;

      case 'Spades' : suitElement.innerHTML = '&#9830';
      break;

      case 'Clubs' : suitElement.innerHTML = '&#9827';
      break;
    }

    suitElement.className = 'card-suit'
    nameElement.className = 'card-name-top';
    nameElement.textContent = card.name;

    const nameElement2 = nameElement.cloneNode(true);
    nameElement2.className = 'card-name-bottom';

    if (!target.textContent) {
      target.append(nameElement, nameElement2, suitElement);
    }
  }

  connectDroppable() {
   this.playerCards.addEventListener('dragenter', event => {
    const target = this.getCardTarget(event);
    if (target && !target.textContent) target.classList.add('droppable');
    event.preventDefault();
   });

   this.playerCards.addEventListener('dragover', event => {
    if (this.getCardTarget(event)) {
      event.preventDefault();
    }
   });

   this.playerCards.addEventListener('dragleave', event => {
    const target = this.getCardTarget(event);
    if (target) target.classList.remove('droppable');
   });

   this.playerCards.addEventListener('drop', event => {
    const score = new Score();
    const computer = new Computer();
    const playerCard = this.takeCard();
    const computerCard = this.takeCard();
    const target = this.getCardTarget(event);
    

    if (target && !target.textContent) {
      score.calcScore(+playerCard.value, +computerCard.value);
    }

    computer.putCard(Player.position++);
    this.drowCard(playerCard, event);
    target.classList.remove('droppable');
   });
  }
}

class Game {

  static newGame() {
    const computerCards = Array.from(document.querySelector('.cards').querySelectorAll('li'));
    const playerCards = Array.from(document.querySelector('.cards').nextElementSibling.querySelectorAll('li'));

    computerCards.forEach(card => card.innerHTML = '');
    playerCards.forEach(card => card.innerHTML = '');
    document.getElementById('user').querySelector('p').textContent = 0;
    document.getElementById('computer').querySelector('p').textContent = 0;
    Player.position = 1;
  } 

  static play() {
    new Player();
  }
}

Game.play();
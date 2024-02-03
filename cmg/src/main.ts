import { startSimpleKit, 
  setSKDrawCallback,
  SKEvent,
  SKKeyboardEvent,
  SKMouseEvent,
  SKResizeEvent,
  setSKEventListener,
 } 
  from "simplekit/canvas-mode";
import { Cat } from "./cat";
import { Star } from "./stars";
import { Bullseye } from "./bullseye";
import { Square } from "./square";
import { Card } from "./card";

startSimpleKit();


setSKDrawCallback((mainContext) => {
  game(mainContext);
});

// Set initial game state
let gameState: GameState = 'start';
let numPairs=1;

function drawStartScreen(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  context.fillStyle = 'darkgrey';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPressSpaceMessage(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement ){
  context.fillStyle = 'white';
  context.font = '24px sans-serif';
  context.textAlign = 'center';

  //deal with pluralising the # of pairs 
  const pairText = numPairs === 1 ? 'pair' : 'pairs';
  context.fillText(`${numPairs} ${pairText}: Press SPACE to play `, canvas.width / 2, canvas.height / 2);
}

function drawWinMessage(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  context.fillStyle = 'white';
  context.font = '24px sans-serif';
  context.textAlign = 'center';
  context.fillText('You finished! Press SPACE to continue', canvas.width / 2, canvas.height / 2);
}

function resetGame() {
  cards = []; 
  matchedCards = []; 
  flippedCards = []; 
  gameState = 'start'; 
}

function game(context: CanvasRenderingContext2D) {

  if (gameState === 'start') {
    drawStartScreen(context, context.canvas);
    drawPressSpaceMessage(context, context.canvas);
    cardGen1(context, context.canvas);
  }
  else if(gameState === 'playing'){
    context.clearRect(0,0, context.canvas.width, context.canvas.height);
    drawStartScreen(context, context.canvas);
    cardGen1(context, context.canvas);
    
  }
  else if (gameState === 'win') {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawStartScreen(context, context.canvas);
    drawWinMessage(context, context.canvas);
    
}
}

function shuffleCards() {
  //console.log("cards shuffled");
  for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]; // Swap cards randomly
  }
}

let flippedCards: Card[] =[];
let matchedCards: Card[] =[];

function handleEvent(e: SKEvent){
  switch(e.type){
    case "keydown":
      const { key } = e as SKKeyboardEvent;
      if(key === " "){
        console.log("Space pressed");
        if(gameState === 'start') {
          gameState = 'playing';
          shuffleCards();
          cards.forEach(card => card.flip());
        }
        else if (gameState === 'win') {
          numPairs++;
          if (numPairs > 15) {
              numPairs = 15; // Limit maximum pairs to 15
          }
          resetGame();
      }
      }
      if(key === "+" && gameState === "start" && numPairs < 15){
        numPairs = Math.min(numPairs + 1, 15);
        resetGame();
      }
      else if (key === "-" && gameState === "start" && numPairs >0) {
        // Decrease the number of pairs (down to a minimum of 1)
        numPairs = Math.max(numPairs - 1, 1);
        resetGame(); // Reset the game with the new number of pairs
      }
      if(key === 'q' && !(gameState === 'start')){
        gameState = 'start';
      }
      break;

    case "mousedown":
      const { x , y }= e as SKMouseEvent;
      if(gameState === 'playing' && flippedCards.length >= 0 && flippedCards.length < 3){
        cards.forEach(card => {
          if (card.hitTest(x, y) && !matchedCards.includes(card)) {
            card.flip();
            if(card.isFlipped){
              flippedCards.push(card);
            }
            else{
              flippedCards.pop();
            }
            
            console.log("# of flipped cards: ", flippedCards.length);
            if (flippedCards.length === 2) {
                // Two cards flipped, check for match
                if(checkForMatch()){
                  //console.log("Match!");
                  matchedCards.push(...flippedCards);
                  //console.log("matched cards", matchedCards.length);
                  if(matchedCards.length === cards.length){
                    gameState = 'win';
                  }
                  flippedCards = [];
                  
                }
              }
            }
        });
      }
      break;

      case 'mousemove':
        const { x: mouseX, y: mouseY } = e as SKMouseEvent;
        cards.forEach(card => {
          card.isHovered = card.hitTest(mouseX, mouseY);
        });
      break;
  }
}

function checkForMatch(): boolean {
  if (flippedCards.length === 2) {
    const cardcode1 = flippedCards[0].cardCode;
    const cardcode2 = flippedCards[1].cardCode;

    console.log("card codes: ", cardcode1, cardcode2);
    if(cardcode1 === cardcode2){
     return true;
    }
    else{
      //flippedCards=[];
      console.log("no match");
      return false;
    }
  }
  else{
    return false;
  }
}

setSKEventListener(handleEvent);

function catGen(): string {
  //color generator for the cats 
  const colors = ["#CEA242", "#FF6833", "#33ACFF", "#145253", "#6F7B7B"];

  const randomIndex = Math.floor(Math.random() * 5);
  return colors[randomIndex];

}

function starGen(): string{
  const colors = ["#F7C731", "#F78831", "#FFFF00" ];
  const randomIndex = Math.floor(Math.random() * 3);
  return colors[randomIndex];
}

function bullsEyeGen(){

  const colorPair: {[key: string]: string[]} = {
    pair1:["red", "blue"],
    pair2:["black", "white"],
    pair3:["blue", "red"],
    pair4:["orange", "yellow"],
    pair5:["green", "yellow"]
  };
  const pairKeys = Object.keys(colorPair);
  const randomKeyIndex = Math.floor(Math.random() * pairKeys.length);
  const randomPairKey = pairKeys[randomKeyIndex];
  const randomPair = colorPair[randomPairKey];

  return randomPair;
}


//prototype to generate the cards 
let cards: Card[] = []; //card array 

//image types:
const imageTypes = [Cat, Star, Bullseye];

function cardGen1 (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
  const cardWidth =  80;
  const cardHeight = 80;
  const cardSpacing = 10;
  const horizontalMargin = 5;

  const totalCards = numPairs * 2;
  let totalWidth: number = numPairs * (cardWidth + cardSpacing) - cardSpacing;
  let startX: number = (canvas.width - totalWidth) /2;
  let startY: number = (canvas.height - cardHeight) /2 + 100;

  const cardsPerRow = Math.floor((canvas.width - 2 * horizontalMargin + cardSpacing) / (cardWidth + cardSpacing));
  const numRows = Math.ceil(totalCards / cardsPerRow);
  const rowSpacing = 10;

  if(cards.length === 0){
    for(let i = 0; i< numPairs; i++){
      let row = Math.floor(i / cardsPerRow);
      let col = i % cardsPerRow;
      
      let x: number = startX + col * (cardWidth + cardSpacing) + horizontalMargin;
      let y: number = startY + row * (cardHeight + rowSpacing);

      if (row > 0) {
        startY += cardHeight + rowSpacing;
        startX = (canvas.width - totalWidth) / 2 + horizontalMargin;
      }

      //generate first card
      let card1: Card = new Card(x, y);
      const square1 = new Square(x,y);
      card1.add(square1);
      console.log("first card generated");

      //generate second card 
      let card2: Card= new Card(x + cardWidth + cardSpacing, y);
      const square2 = new Square(x + cardWidth + cardSpacing, y);
      card2.add(square2);
      console.log("second card generated");

      //randomly select an image type for each pair 
      const randomIndex = Math.floor(Math.random() * imageTypes.length);
      const imageChosen = imageTypes[randomIndex];
      let cardCodes: string ="";
      switch (imageChosen){
        
        case Cat:
          const catColor = catGen();
          let leftEye: number = -16;
          let rightEye: number = 16;
          if ( catColor === "#FF6833"){
            leftEye =-20;
            rightEye = 12;
            cardCodes = "rc";
            
          }
          else if( catColor === "#33ACFF"){
            leftEye = -12;
            rightEye = 20;
            cardCodes= "bc"
          }
          else if(catColor === "#CEA242"){
            cardCodes = "yc";
          }
          else if(catColor === "#145253"){
            cardCodes = "gc";
          }
          else if(catColor === "#6F7B7B"){
            cardCodes = "ec";
          }

          //generate cats
          const cat1 = new Cat(x, y, catColor, leftEye, rightEye);
          const cat2 = new Cat(x + cardWidth + cardSpacing, y, catColor, leftEye, rightEye);
          card1.cardCode = cardCodes;
          card2.cardCode = cardCodes;
          card1.add(cat1);
          card2.add(cat2);
          break;

        case Star:
          console.log("star");
          const starColor= starGen();
          let starSides: number = 5;
          if(starColor === "#FFFF00"){
            const sides = [5, 7, 10];
            const randomSide = Math.floor(Math.random() * 3);
            starSides = sides[randomSide];
            if(starSides = 5){
              cardCodes = "5s";
            }
            else if(starSides = 7){
              cardCodes = "7s";
            }
            else if(starSides = 10){
              cardCodes = "10s";
            }
          }
          else if(starColor === "#F7C731"){
            starSides = 4;
            cardCodes = "4s";
          }
          else if(starColor === "#F78831"){
            starSides = 6;
            cardCodes = "6s";
          }

          const starSize = Math.min(cardWidth, cardHeight);
          const starX = x + (cardWidth - starSize) / 2;
          const starY = y + (cardHeight - starSize) / 2;

          //generate stars
          const star1 = new Star(starX, starY, starSides, starColor);
          const star2 = new Star(starX + cardWidth + cardSpacing, starY, starSides, starColor);
          card1.cardCode = cardCodes;
          card2.cardCode = cardCodes;
          card1.add(star1);
          card2.add(star2);

          break;
        
        case Bullseye:
          console.log("bullseye");
          const bColor = bullsEyeGen();
          let numRings: number = 3;
          let scale: number = 0.5;

          if(bColor[0]=== "red"){
            numRings = 3;
            scale = 0.5;
            cardCodes = "rb3";
          }
          else if(bColor[0] === "black"){
            numRings = 7;
            scale = 0.25;
            cardCodes = "bw7";
          }
          else if(bColor[0] === "blue"){
            numRings = 5;
            scale = 0.35;
            cardCodes = "br5";
          }
          else if(bColor[0] === "orange"){
            numRings = 4;
            scale = 0.4;
            cardCodes = "oy4";
          }
          else if(bColor[0] === "green"){
            numRings = 3;
            scale = 0.5;
            cardCodes = "gy3";
          }
          const bullseye1 = new Bullseye(x,y,numRings, bColor, scale);
          const bullseye2 = new Bullseye(x + cardWidth + cardSpacing, y,numRings, bColor, scale);
          
          card1.add(bullseye1);
          card2.add(bullseye2);

          card1.cardCode = cardCodes;
          card2.cardCode = cardCodes;

          break;
      }
    cards.push(card1, card2);
    startX+=90;
    }
  }
  //draw cards
  //console.log("Number of cards", cards.length);
  cards.forEach(card => card.draw(context, gameState));
}

// Define the GameState type
type GameState = 'start' | 'playing' | 'win';

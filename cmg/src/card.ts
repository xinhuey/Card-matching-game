import { Drawable } from "./drawable";
import{
  edgeHitTestSquare,
  insideHitTestSquare,
} from  "./hittest";

export class Card {
  list: Drawable[] = [];
  public isFlipped: boolean = true;
  angle: number = 0;
  isHovered: boolean =false;
  flipAnimationDuration: number = 500; // milliseconds
  flipAnimationStartTime: number = 0;
  cardWidth: number = 80;
  cardHeight: number = 80;
  cardCode: string='';
  innerColor: string = 'lightblue';
  

  constructor(public x: number, public y: number, public size =80,  public lineWidth?: number){}

  add(drawable: Drawable) {
    this.list = [...this.list, drawable];
  }

  remove(drawable: Drawable) {
    this.list = this.list.filter((d) => d !== drawable);
  }

  startFlipAnimation() {
    this.flipAnimationStartTime = performance.now();
    requestAnimationFrame(this.flipAnimation.bind(this));
  }


  flip(){
    console.log("card is flipped");
    if(this.isFlipped){
      this.isFlipped = false;
    }
    else{
      this.isFlipped=true;
    }
    this.startFlipAnimation();
  }
 
  flipAnimation(timestamp: number) {
    const elapsedTime = timestamp - this.flipAnimationStartTime;
    const progress = Math.min(elapsedTime / this.flipAnimationDuration, 1);

    // Ease-in-out animation function (optional)
    const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);

    this.angle = easedProgress * Math.PI;

    if (progress < 1) { 
      requestAnimationFrame(this.flipAnimation.bind(this));
    } else {
      // Flip animation completed 
      //this.isFlipped = !this.isFlipped;
      this.angle = 0;
    }
  }



  draw(gc: CanvasRenderingContext2D, gameState: string) {
    //gc.save();
    //gc.translate(this.x + this.cardWidth / 2, this.y + this.cardHeight / 2); // Translate to the center of the card
    
    //gc.rotate(this.angle);
    if(!this.isFlipped){
        //draw the backside of the card
      //console.log("flipped around");
      gc.beginPath();
    
    // Draw the outer white square
    gc.fillStyle = "white";
    gc.strokeStyle = "black";
    if (this.lineWidth) gc.lineWidth = this.lineWidth;
    gc.rect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
    );
    gc.fill();
    gc.stroke();

    // Draw the inner blue square
    const innerSize = this.size * 0.8; // Adjust the size as needed
    gc.fillStyle = "lightblue";
    gc.fillRect(
        this.x - innerSize / 2,
        this.y - innerSize / 2,
        innerSize,
        innerSize
    );

    }
    
    else{
      //console.log("not flipped");
      this.list.forEach((d) => {
      //console.log("does it come in here");
      d.draw(gc);
    });
    }

    if(this.isHovered && gameState === 'playing'){
      gc.strokeStyle = 'yellow';
            gc.lineWidth = 3;
            gc.strokeRect(
                this.x - this.size / 2,
                this.y - this.size / 2,
                this.size,
                this.size
            );
    }
    
    
    
    //gc.restore();
  }

  hitTest(mx: number, my: number){
    if (this.lineWidth) lineWidth = this.lineWidth;
    return insideHitTestSquare(mx, my, this.x, this.y, this.size, this.size) || edgeHitTestSquare(mx, my, this.x, this.y, this.size, 1);
  }
  


}
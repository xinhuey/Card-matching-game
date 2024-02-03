import { SKMouseEvent } from "simplekit/canvas-mode";
import { Drawable } from "./drawable";
import{
  edgeHitTestSquare,
  insideHitTestSquare,
} from  "./hittest";

export class Square implements Drawable{
  cardWidth: number = 80;
  cardHeight: number = 80;
  isMouseOver: boolean = false;
    constructor(
        public x: number,
        public y: number,
        public size = 80,
        public fill?: string, // optional parameters
        public stroke?: string,
        public lineWidth?: number
      ) {}
    
      draw(gc: CanvasRenderingContext2D) {
        gc.save();
        gc.beginPath();
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

        //this.hoverOutline(gc);

        gc.restore();

        //console.log("done drawing square");
      }

      hoverOutline(gc: CanvasRenderingContext2D){
        if(this.isHovered){
          gc.strokeStyle = 'yellow';
          gc.lineWidth= 3;
          gc.strokeRect(
            this.x - this.cardWidth / 2 ,
            this.y - this.cardHeight / 2,
            this.cardWidth,
            this.cardHeight
          );
        }
      }

      

      

}
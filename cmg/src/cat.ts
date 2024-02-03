import { Drawable } from "./drawable";

export class Cat implements Drawable {
  constructor(public x: number, public y: number, public fillColor: string, public leftEye?: number, public rightEye?: number, public scale = 0.5) {}
  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    //console.log("draws cat");
    gc.translate(this.x, this.y);
    gc.scale(this.scale, this.scale);

    //deal with the color problem

    
    gc.fillStyle = this.fillColor;

    gc.strokeStyle = this.fillColor;
    gc.lineWidth = 8;

    // head white outline
    gc.beginPath();
    gc.arc(0, 0, 40, 0, 2 * Math.PI);
    gc.stroke();

    // ears
    gc.beginPath();
    // left
    gc.moveTo(-40, -48);
    gc.lineTo(-8, -36);
    gc.lineTo(-35, -14);
    gc.closePath();
    // right
    gc.moveTo(40, -48);
    gc.lineTo(8, -36);
    gc.lineTo(35, -14);
    gc.closePath();
    gc.stroke();
    gc.fill();

    // head
    gc.beginPath();
    gc.arc(0, 0, 40, 0, 2 * Math.PI);
    gc.fill();

    // whites of eyes
    gc.strokeStyle = "black";
    gc.fillStyle = "white";
    gc.lineWidth = 1;
    gc.beginPath();
    // left
    gc.ellipse(-16, -9, 8, 14, 0, 0, Math.PI * 2);
    gc.fill();
    gc.stroke();
    // right
    gc.beginPath();
    gc.ellipse(16, -9, 8, 14, 0, 0, Math.PI * 2);
    gc.fill();
    gc.stroke();

    // eyeballs
    gc.fillStyle = "black";
    gc.beginPath();
    // left
    if(this.leftEye){
        gc.arc(this.leftEye, -9, 5,0, Math.PI*2);
    }
    else{
        gc.arc(-16, -9, 5, 0, Math.PI * 2);
    }
    gc.fill();
    // right
    gc.beginPath();
    if(this.rightEye){
        gc.arc(this.rightEye, -9, 5,0, Math.PI*2);
    }
    else{
        gc.arc(16, -9, 5, 0, Math.PI * 2);
    }
    gc.fill();
    //console.log("done drawing cat");
    gc.restore();
  }
}
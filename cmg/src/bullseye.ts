import { Drawable } from "./drawable";

export class Bullseye implements Drawable{
    constructor(public x: number, public y: number, public rings: number, public colorpair: string[], public scale : number){}

    draw(gc: CanvasRenderingContext2D){
        gc.save();
        //gc.translate(this.x, this.y);
        //gc.scale(this.scale, this.scale);
        

        const ringSpace=20;
        

        for (let i =0; i< this.rings; i++){
            var radius = (this.rings - i) * ringSpace * this.scale;
            gc.strokeStyle="black";
            gc.lineWidth=6;
            gc.beginPath();
            gc.arc(this.x, this.y,radius, 0, Math.PI *2);
            gc.stroke();
            gc.closePath();

            if(i%2 === 0){
                gc.fillStyle=this.colorpair[0];
            }
            else{
                gc.fillStyle=this.colorpair[1];
            }

            gc.fill();
            }

            gc.restore();
        
    }
}
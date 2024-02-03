import { Drawable } from "./drawable";

export class Star implements Drawable {
    constructor(public x: number, public y: number, public spikes: number, public color:string, public scale = 0.5) {}

    draw(gc: CanvasRenderingContext2D ) {
        gc.save();
        //console.log("draw star ", this.color, " ", this.spikes, this.x, this.y);
        //gc.translate(this.x, this.y);
        //gc.scale(this.scale, this.scale);

        var radius=30;
        var points = this.spikes;
        gc.fillStyle = this.color ;
        gc.strokeStyle="black";
        gc.lineWidth=4;
        gc.beginPath();
        gc.moveTo(this.x, this.y + radius);
        for (var i = 0; i < 2 * points + 1; i++) {
          var r = (i % 2 == 0) ? radius : radius / 2;
          var a = Math.PI * i / points;
          gc.lineTo(this.x + r * Math.sin(a), this.y + r * Math.cos(a));
        };
        gc.closePath();

        gc.stroke();
        gc.fill();

        gc.closePath();
        
        

        gc.restore();
    }
}




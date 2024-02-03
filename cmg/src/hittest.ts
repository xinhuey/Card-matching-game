import {
    distance,
    closestPoint,
    Point2,
    point,
  } from "simplekit/utility";
  
  export function insideHitTestSquare(
    mx: number,
    my: number,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    return mx >= x && mx <= x + w && my >= y && my <= y + h;
  }

  export function edgeHitTestSquare(
    mx: number,
    my: number,
    x: number,
    y: number,
    size: number,
    strokeWidth: number
  ) {
    // Similar to insideHitTestSquare, we only need to check against one dimension
    const s = strokeWidth / 2; // width of stroke on either side of edges
    const outer = mx >= x - s && mx <= x + size + s && my >= y - s && my <= y + size + s;
    const inner = mx > x + s && mx < x + size - s && my > y + s && my < y + size - s;
    return outer && !inner;
  }
  
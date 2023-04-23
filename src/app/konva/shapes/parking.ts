import Konva from "konva";

export class ParkingShape {
  stage: Konva.Stage;
  x: number;
  y: number;
  width: number;
  height: number;
  draggable: boolean;
  constructor(stage: Konva.Stage, x: number, y: number, width: number, height: number, draggable = false) {
    this.stage = stage;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draggable = draggable;
  }

  draw(layer: Konva.Layer) {
    layer.add(this.shape());
  }

  shape() {
    return new Konva.Rect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: this.draggable,
    });
  }
}

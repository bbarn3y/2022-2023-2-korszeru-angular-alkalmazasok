import Konva from "konva";

export class HouseShape {
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
    return new Konva.Line({
      points: [
        this.x,
        this.y + this.height / 2,
        this.x + this.width / 2,
        this.y,
        this.x + this.width,
        this.y + this.height / 2,
        this.x + this.width,
        this.y + this.height,
        this.x,
        this.y + this.height
      ],
      closed: true,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 5,
      draggable: this.draggable,
      strokeScaleEnabled: true,
      perfectDrawEnabled: false,
      shadowForStrokeEnabled: false,
    });
  }
}

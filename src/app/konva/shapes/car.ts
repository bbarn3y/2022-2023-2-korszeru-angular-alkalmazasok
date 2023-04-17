import Konva from "konva";
import {ShapeType} from "src/app/_models/shape-type";

export class CarShape {
  stage: Konva.Stage;
  x: number;
  y: number;
  width: number;
  height: number;
  draggable: boolean;

  constructor(stage: Konva.Stage, x: number, y: number, width: number, height: number, draggable: boolean = true) {
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

  shape(): Konva.Group {
    const group = new Konva.Group({
      draggable: this.draggable,
      type: ShapeType.CAR
    });
    const body = new Konva.Line({
      points: [
        this.x,
        this.y,
        this.x + this.width,
        this.y,
        this.x + 4 * this.width / 5,
        this.y + this.height,
        this.x + this.width / 5,
        this.y + this.height,
        this.x,
        this.y
      ],
      closed: true,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 5,
      strokeScaleEnabled: true,
      perfectDrawEnabled: false,
      shadowForStrokeEnabled: false
    });
    const leftTyre = new Konva.Circle({
      x: this.x + this.width / 5,
      y: this.y + this.height,
      radius: this.height / 5,
      stroke: 'black',
      strokeWidth: 5,
    })
    const rightTyre = new Konva.Circle({
      x: this.x + 4 * this.width / 5,
      y: this.y + this.height,
      radius: this.height / 5,
      stroke: 'black',
      strokeWidth: 5,
    })

    group.add(body, leftTyre, rightTyre)
    return group;
  }
}

import Konva from "konva";
import {Shapes} from "src/app/konva/shapes/shape";

export class CarShape {
  stage: Konva.Stage;
  x: number;
  y: number;
  width: number;
  height: number;
  draggable: boolean;
  constructor(stage: Konva.Stage, x: number, y: number, width: number, height: number, draggable = true) {
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
    const group = new Konva.Group({
      draggable: true,
      fixed: true,
      strokeScaleEnabled: true,
      perfectDrawEnabled: false,
      shadowForStrokeEnabled: false,
      type: Shapes.CAR
  });
    const body = new Konva.Line({
      points: [
        this.x,
        this.y + 4 * this.height / 5,
        this.x + this.width,
        this.y + 4 * this.height / 5,
        this.x + 4 * this.width / 5,
        this.y,
        this.x + this.width / 5,
        this.y,
        this.x,
        this.y + 4 * this.height / 5
      ],
      closed: true,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 5,
      strokeScaleEnabled: true,
      perfectDrawEnabled: false,
      shadowForStrokeEnabled: false,
    })
    const leftTyre = new Konva.Circle({
      x: this.x + this.width / 5,
      y: this.y + this.height,
      radius: this.height / 5,
      stroke: 'black',
      strokeWidth: 5
    });
    const rightTyre = new Konva.Circle({
      x: this.x + 4 * this.width / 5,
      y: this.y + this.height,
      radius: this.height / 5,
      stroke: 'black',
      strokeWidth: 5
    })

    group.add(leftTyre, rightTyre, body);
    return group;
  }
}

import Konva from "konva";
import {Colors} from "src/app/_constants/colors";
import {ShapeType} from "src/app/_models/shape-type";

export class ParkingShape {
  stage: Konva.Stage;
  x: number;
  y: number;
  width: number;
  height: number;
  draggable: boolean;
  highlighted: boolean;

  constructor(stage: Konva.Stage, x: number, y: number, width: number, height: number, draggable = false, highlighted: boolean = false) {
    this.stage = stage;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draggable = draggable;
    this.highlighted = highlighted;
  }

  draw(layer: Konva.Layer, clickHandler?: () => void) {
    const shape = this.shape();
    // if (clickHandler) {
    //   console.log('has click handler!')
    //   shape.addEventListener('click', clickHandler);
    // }
    layer.add(shape);
  }

  shape() {
    return new Konva.Rect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: Colors.defaultBg,
      stroke: 'black',
      strokeWidth: 4,
      draggable: this.draggable,
      type: ShapeType.PARKING
    });
  }
}

import Konva from "konva";
import {HouseShape} from "src/app/konva/shapes/house";
import {ParkingShape} from "src/app/konva/shapes/parking";

export class HouseWithParking {
  stage: Konva.Stage;
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(stage: Konva.Stage, x: number, y: number, width: number, height: number) {
    this.stage = stage;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
    });
    const house = new HouseShape(this.stage, this.x, this.y, this.width / 2, this.height);
    const parking = new ParkingShape(this.stage, this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2);
    group.add(house.shape(), parking.shape());
    return group;
  }
}

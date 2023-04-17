import {Component, OnInit} from '@angular/core';
import Konva from "konva";
import {ShapeType} from "src/app/_models/shape-type";
import {UserService} from "src/app/_services/user.service";
import {CarShape} from "src/app/konva/shapes/car";

@Component({
  selector: 'app-konva',
  templateUrl: './konva.component.html',
  styleUrls: ['./konva.component.less']
})
export class KonvaComponent implements OnInit {
  selectedLayer?: Konva.Layer;
  selectedShape: ShapeType = ShapeType.CAR;
  stage?: Konva.Stage;

  ShapeType = ShapeType;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // add canvas element
    const layer = new Konva.Layer();
    this.stage.add(layer);

    this.selectedLayer = this.stage.getLayers()[0];

    // create shape
    const box = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: false,
    });
    layer.add(box);

    this.addEventListeners();
  }

  addEventListeners() {
    if (this.stage) {
      this.stage.on('click', (event) => {
        this.drawShape(this.selectedShape, event.evt.offsetX, event.evt.offsetY);
      })
    }
  }

  drawShape(shapeType: ShapeType, x: number, y: number) {
    if (this.stage && this.selectedLayer) {
      switch(this.selectedShape) {
        case ShapeType.CAR:
          const carShape = new CarShape(this.stage, x, y, 60, 30);
          carShape.draw(this.selectedLayer);
          break;
        case ShapeType.HOUSE:
          break;
        case ShapeType.HOUSE_WITH_PARKING:
          break;
        case ShapeType.PARKING:
          break;
      }
    }
  }

}

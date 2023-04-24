import {Component, OnInit, ViewChild} from '@angular/core';
import Konva from "konva";
import {ShapeType} from "src/app/_models/shape-type";
import {UserService} from "src/app/_services/user.service";
import {CarShape} from "src/app/konva/shapes/car";
import {HouseShape} from "src/app/konva/shapes/house";
import {HouseWithParking} from "src/app/konva/shapes/house-with-parking";
import {ParkingShape} from "src/app/konva/shapes/parking";
import {StorageKeys} from "src/app/_constants/storage.keys";
import Shape = Konva.Shape;
import {Colors} from "src/app/_constants/colors";
import Group = Konva.Group;
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-konva',
  templateUrl: './konva.component.html',
  styleUrls: ['./konva.component.less']
})
export class KonvaComponent implements OnInit {
  @ViewChild('contextMenuTrigger') contextMenuTriggerEl?: MatMenuTrigger;
  clickedShape?: Shape | Group;
  intersectingObjects?: { dragged: Shape | Group, newHighlight: Shape | Group};
  menuPositionLeft?: number;
  menuPositionTop?: number;
  selectedLayer?: Konva.Layer;
  selectedShape: ShapeType = ShapeType.CAR;
  stage?: Konva.Stage;

  ShapeType = ShapeType;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.initState();

    this.addEventListeners();
  }

  addEventListeners() {
    if (this.stage) {
      let outerThis = this;
      this.stage.on('click', (event) => {
        if (event.target instanceof Shape) {
          if (event.target.parent instanceof Group) {
            this.clickedShape = event.target.parent;
          } else  {
            this.clickedShape = event.target;
          }
          this.menuPositionLeft = event.target.getClientRect().x;
          this.menuPositionTop = event.target.getClientRect().y;
          this.contextMenuTriggerEl?.openMenu();
        } else {
          this.drawShape(this.selectedShape, event.evt.offsetX, event.evt.offsetY);
        }
      });

      this.stage.on('dragmove', function(event) {
        outerThis.intersectingObjects = undefined;
        (outerThis.selectedLayer?.children ?? [])
          .filter((shape) => shape.attrs.type === ShapeType.PARKING)
          .forEach((shape) => {
            const target = event.target as Shape;
            const targetRect = event.target.getClientRect();
            if (Konva.Util.haveIntersection(shape.getClientRect(), targetRect)) {
              if (shape instanceof Shape) {
                shape.fill(Colors.highlightBg);
                outerThis.intersectingObjects = { dragged: target, newHighlight: shape};
              }
            } else {
              // @todo Buggy
              (shape as Shape).fill(Colors.defaultBg);
            }
          })
      });

      this.stage.on('dragend', function(event) {
        if (outerThis.intersectingObjects) {
          outerThis.intersectingObjects.dragged.setPosition({
            x: outerThis.intersectingObjects.dragged.x() +
              (outerThis.intersectingObjects.newHighlight.getClientRect().x - outerThis.intersectingObjects.dragged.getClientRect().x),
            y: outerThis.intersectingObjects.dragged.y() +
              (outerThis.intersectingObjects.newHighlight.getClientRect().y - outerThis.intersectingObjects.dragged.getClientRect().y),
          });
          outerThis.intersectingObjects = undefined;
        }
      });
    }
  }

  deleteShape() {
    this.clickedShape?.destroy();
  }

  drawShape(shapeType: ShapeType, x: number, y: number) {
    if (this.stage && this.selectedLayer) {
      let shape;
      switch(this.selectedShape) {
        case ShapeType.CAR:
          shape = new CarShape(this.stage, x, y, 50, 25);
          break;
        case ShapeType.HOUSE:
          shape = new HouseShape(this.stage, x, y, 50, 100);
          break;
        case ShapeType.HOUSE_WITH_PARKING:
          shape = new HouseWithParking(this.stage, x, y, 100, 100);
          break;
        case ShapeType.PARKING:
          shape = new ParkingShape(this.stage, x, y, 50, 50);
          break;
      }

      if (shape) {
        shape.draw(this.selectedLayer);
      }
    }
  }

  initState() {
    const stateString = localStorage.getItem(StorageKeys.KONVA_STATE);
    if (stateString) {
      const stateObject = JSON.parse(stateString);
      console.log(stateObject);

      // let stage = { stage: stateObject };
      this.stage = Konva.Node.create(stateObject, 'container');
    } else {
      this.stage = new Konva.Stage({
        container: 'container',
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (this.stage) {
      const layer = new Konva.Layer();
      this.stage.add(layer);

      this.selectedLayer = this.stage.getLayers()[0];

      // create shape
      // const box = new Konva.Rect({
      //   x: 50,
      //   y: 50,
      //   width: 100,
      //   height: 50,
      //   fill: '#00D2FF',
      //   stroke: 'black',
      //   strokeWidth: 4,
      //   draggable: false,
      // });
      // layer.add(box);
    }
  }

  saveData() {
    if (this.stage) {
      let actBaseJson = this.stage.toJSON();
      localStorage.setItem(StorageKeys.KONVA_STATE, actBaseJson);
    }
  }

  shapeToBottom() {
    this.clickedShape?.moveToBottom();
  }

  shapeToTop() {
    this.clickedShape?.moveToTop();
  }

  snapToTheClosest() {
    // this.selectedLayer?.children
    //   ?.filter((child) => child.attrs.type === ShapeType)
    //   .sort((shape1, shape2) => {
    //
    //   })
  }

}

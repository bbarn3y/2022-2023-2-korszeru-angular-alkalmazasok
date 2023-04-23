// TODO +1: kill the performance

import {Component, OnInit, ViewChild} from '@angular/core';
import Konva from "konva";
import {ShapeType} from "src/app/_models/shape-type";
import {CarShape} from "src/app/konva/shapes/car";
import {HouseShape} from "src/app/konva/shapes/house";
import {HouseWithParking} from "src/app/konva/shapes/house-with-parking";
import {ParkingShape} from "src/app/konva/shapes/parking";
import {StorageKeys} from "src/app/_constants/storage.keys";
import Shape = Konva.Shape;
import Group = Konva.Group;
import {Colors} from "src/app/_constants/colors";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {CalculationService} from "src/app/_services/calculation.service";

@Component({
  selector: 'app-konva',
  templateUrl: './konva.component.html',
  styleUrls: ['./konva.component.less']
})
export class KonvaComponent implements OnInit {
  @ViewChild('contextMenuTrigger') contextMenuTriggerEl?: MatMenuTrigger;
  @ViewChild('contextMenu') contextMenu?: MatMenu;
  clickedShape?: Shape | Group;
  intersectingObjects?: { dragged: Shape | Group, newHighlight: Shape | Group };
  menuLeftPosition = 0;
  menuTopPosition = 0;
  selectedLayer?: Konva.Layer;
  selectedShape: ShapeType = ShapeType.CAR;
  stage?: Konva.Stage;

  ShapeType = ShapeType;

  constructor(private calculationService: CalculationService) { }

  ngOnInit(): void {
    this.initState();

    this.addEventListeners();
  }

  addEventListeners() {
    const outerThis = this;
    if (this.stage) {
      this.stage.on('click', (event) => {
        if ((event.target instanceof Shape)) {
          if (event.target.parent instanceof Group) {
            this.clickedShape = event.target.parent;
          } else {
            this.clickedShape = event.target;
          }
          this.menuLeftPosition = event.target.getClientRect().x;
          this.menuTopPosition = event.target.getClientRect().y;
          this.contextMenuTriggerEl?.openMenu();
          console.log('opening menu at', this.menuLeftPosition, this.menuTopPosition);
        } else {
          this.drawShape(this.selectedShape, event.evt.offsetX, event.evt.offsetY);
        }
      })

      this.stage.on('dragmove', function (event) {
        // console.log('drag on stage', event);
        // Demo: https://konvajs.org/docs/sandbox/Collision_Detection.html
        if (outerThis.selectedLayer) {
          const target = event.target;
          const targetRect = event.target.getClientRect();
          // console.log('target', target, targetRect);
          (outerThis.selectedLayer.children ?? []).forEach((group) => {
            // console.log('g', group, group.attrs.type)
            // do not check intersection with itself
            if (group === target || group.attrs.type === ShapeType.CAR) {
              return;
            }
            if (Konva.Util.haveIntersection(group.getClientRect(), targetRect)) {
              if (group instanceof  Shape) {
                group.fill(Colors.highlightBg);
              } else if (group instanceof Group) {
                group.children
                  ?.filter(c => c instanceof  Shape)
                  .forEach(c => (c as Shape).fill(Colors.highlightBg));
              }
              outerThis.intersectingObjects = { dragged: event.target as Shape, newHighlight: group };
            } else {
              if (group instanceof  Shape) {
                group.fill(Colors.defaultBg);
              } else if (group instanceof Group) {
                group.children
                  ?.filter(c => c instanceof Shape)
                  .forEach(c => (c as Shape).fill(Colors.defaultBg));
              }
              outerThis.intersectingObjects = undefined;
            }
          });
        }
      })

      this.stage.on('dragend', (event) => {
        console.log('dragend', event);
        if (this.stage && this.intersectingObjects) {
          console.log(this.intersectingObjects);
          // const centerX = this.stage.width() / 2;
          console.log('dragged', this.intersectingObjects.dragged.x(), 'new', this.intersectingObjects.newHighlight, this.intersectingObjects.newHighlight.x())
         //  console.log('dragged', this.intersectingObjects.dragged, 'new', this.intersectingObjects.newHighlight.attrs.points[0])

          console.log('pos', this.intersectingObjects.dragged, this.intersectingObjects.dragged.getPosition(), 'new', this.intersectingObjects.newHighlight.getPosition())
          console.log('offset', this.intersectingObjects.dragged, this.intersectingObjects.dragged.offsetX(), 'new', this.intersectingObjects.newHighlight.offsetY())
          console.log('rect', this.intersectingObjects.dragged, this.intersectingObjects.dragged.getClientRect(), 'new', this.intersectingObjects.newHighlight.getClientRect())
          // this.intersectingObjects.dragged.setPosition(this.intersectingObjects.newHighlight.getPosition());
          if (this.intersectingObjects) {
            console.log('setPosition', this.intersectingObjects)
            // this.intersectingObjects.dragged.x(this.intersectingObjects.newHighlight.x());
            // this.intersectingObjects.dragged.attrs.x = this.intersectingObjects.newHighlight.x();
            // this.intersectingObjects.dragged.attrs.y = this.intersectingObjects.newHighlight.y();
            // this.intersectingObjects.dragged.setPosition( { x: this.intersectingObjects.dragged.x() + 10, y: this.intersectingObjects.dragged.y() + 10 })
            // event.evt.preventDefault();
            // event.evt.cancelBubble = true;
            // this.intersectingObjects.dragged.stopDrag();
            this.intersectingObjects.dragged.setPosition( {
              x: this.intersectingObjects.dragged.x() + (this.intersectingObjects.newHighlight.getClientRect().x - this.intersectingObjects.dragged.getClientRect().x),
              // x: this.intersectingObjects.dragged.x() + 10,
              y: this.intersectingObjects.dragged.y() + (this.intersectingObjects.newHighlight.getClientRect().y - this.intersectingObjects.dragged.getClientRect().y)
              // y: this.intersectingObjects.dragged.y() + 10
            })
            this.intersectingObjects = undefined;
            console.log(this.intersectingObjects)
          }
        }
      });
    }
  }

  deleteShape() {
    if (this.clickedShape) {
      console.log('clickedShape', this.clickedShape);
      this.clickedShape.destroy();
    }
  }

  drawShape(shapeType: ShapeType, x: number, y: number) {
    let shape;
    if (this.stage && this.selectedLayer) {
      switch(this.selectedShape) {
        case ShapeType.CAR:
          shape = new CarShape(this.stage, x, y, 60, 30);
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
        // const outerThis = this;
        // shape.draw(this.selectedLayer, function (this: Shape) {
        //   console.log('clicky event', this)
        //   outerThis.menuLeftPosition = this.getClientRect().x;
        //   outerThis.menuTopPosition = this.getClientRect().y;
        //   outerThis.contextMenuTriggerEl?.openMenu();
        // });
      }
    }

    return shape;
  }

  initState() {
    const initialStateString = localStorage.getItem(StorageKeys.KONVA_STATE);
    if (initialStateString) {
      const initialState = JSON.parse(initialStateString);
      console.log('load stage', initialState);
      initialState.container = 'container';
      this.stage = Konva.Node.create(initialState.stage, 'container');
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
    }

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

  saveState() {
    if (this.stage) {
      this.stage.scale({x: 1, y: 1});
      let actBaseJson = this.stage.toJSON();
      let actParsedJson = JSON.parse(actBaseJson);
      const exportableJson = JSON.stringify({stage: actParsedJson});
      localStorage.setItem(StorageKeys.KONVA_STATE, exportableJson);
      return exportableJson;
    } else {
      return undefined;
    }
  }

  shapeToBottom() {
    this.clickedShape?.zIndex(0)
  }

  shapeToTop() {
    const zIndex = this.clickedShape?.getLayer()?.children?.length;
    this.clickedShape?.zIndex(zIndex ? zIndex - 1 : this.clickedShape?.zIndex())
  }

  snapToClosest() {
    console.log('snap', this.clickedShape, this.selectedLayer?.children);
    // this.selectedLayer?.children
    //   ?.filter((child) => child.attrs.type === ShapeType.PARKING)
    //   .reduce((closestChild, nextChild) => {
    //     const x = nextChild.attrs.x - (this.clickedShape?.getClientRect().x ?? 0);
    //     const y = nextChild.attrs.y - (this.clickedShape?.getClientRect().y ?? 0);
    //     const distance = this.calculationService.calculateDistance(
    //       nextChild.attrs.x,
    //       nextChild.attrs.y,
    //       (this.clickedShape?.getClientRect().x ?? 0),
    //       (this.clickedShape?.getClientRect().y) ?? 0
    //     );
    //     console.log('distance', this.clickedShape?.x(), x, y, distance);
    //     return distance < this;
    // })
    const sortedParkingSpots = this.selectedLayer?.children
      ?.filter((child) => child.attrs.type === ShapeType.PARKING)
      .sort((shape1, shape2) => {
        const distance1 = this.calculationService.calculateDistance(
          shape1.attrs.x,
          shape1.attrs.y,
          (this.clickedShape?.getClientRect().x ?? 0),
          (this.clickedShape?.getClientRect().y) ?? 0
        );
        const distance2 = this.calculationService.calculateDistance(
          shape2.attrs.x,
          shape2.attrs.y,
          (this.clickedShape?.getClientRect().x ?? 0),
          (this.clickedShape?.getClientRect().y) ?? 0
        );
        return distance1 - distance2;
      })
    if (sortedParkingSpots && sortedParkingSpots.length > 0) {
      // this.clickedShape?.x(
      //   sortedParkingSpots[0].getClientRect().x
      // )
      // this.clickedShape?.y(
      //   sortedParkingSpots[0].getClientRect().y
      // )

      this.clickedShape?.setPosition( {
        x: this.clickedShape?.x() + (sortedParkingSpots[0].getClientRect().x - this.clickedShape?.getClientRect().x),
        y: this.clickedShape?.y() + (sortedParkingSpots[0].getClientRect().y - this.clickedShape?.getClientRect().y)
      })
    }

  }

}

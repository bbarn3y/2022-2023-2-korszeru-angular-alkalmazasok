/**
 * snapToTheClosest
 * dragmove highlight fix
 * zoom: 'wheel' event
 * click positioning fix for scaling
 * zoomToFit
 * generate
 * drawShape: use the parameter!
 */


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
import {CalculationService} from "src/app/_services/calculation.service";
import {Subscription, timer} from "rxjs";

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

  constructor(private calculationService: CalculationService,
              public userService: UserService) { }

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
          if (this.stage) {
            // We must use the stage's relative position instead of the event offset!
            const pos = this.stage?.getRelativePointerPosition();
            this.drawShape(this.selectedShape, pos.x, pos.y);
          }
        }
      });

      this.stage.on('dragmove', function(event) {
        outerThis.intersectingObjects = undefined;
        (outerThis.selectedLayer?.children ?? [])
          .filter((shape) => shape.attrs.type === ShapeType.PARKING)
          .forEach((parking) => {
            const target = event.target as Shape;
            const targetRect = event.target.getClientRect();
            if (Konva.Util.haveIntersection(parking.getClientRect(), targetRect)) {
              if (parking instanceof Shape) {
                parking.fill(Colors.highlightBg);
                outerThis.intersectingObjects = { dragged: target, newHighlight: parking};
              }
            } else {
              const cars = (outerThis.selectedLayer?.children ?? [])
                .filter((shape) => shape.attrs.type === ShapeType.CAR);
              // Bug fix, support multiple highlightable objects
              if (cars.some((car) => {
                return Konva.Util.haveIntersection(parking.getClientRect(), car.getClientRect())
              })) {
                (parking as Shape).fill(Colors.highlightBg);
              } else {
                (parking as Shape).fill(Colors.defaultBg);
              }
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

      // Zoom
      // Demo: https://konvajs.org/docs/sandbox/Zooming_Relative_To_Pointer.html
      let scaleBy = 1.005;
      let pendingScaleBy = 1.0;
      let scaleSubscription: Subscription | null;
      this.stage.on('wheel', e => {
        if (this.stage) {
          // stop default scrolling
          e.evt.preventDefault();
          // if (scaleSubscription) {
            pendingScaleBy *= scaleBy;
          // scaleSubscription.unsubscribe();
          // } else {
          //   pendingScaleBy = scaleBy;
          // }
          // scaleSubscription = timer(20).subscribe(() => {
            if (this.stage) {
              scaleSubscription = null;
              let oldScale = this.stage.scaleX();
              let pointer = this.stage.getPointerPosition();
              if (pointer) {
                let mousePointTo = {
                  x: (pointer.x - this.stage.x()) / oldScale,
                  y: (pointer.y - this.stage.y()) / oldScale,
                };

                // Zoom in or out
                let direction = e.evt.deltaY > 0 ? -1 : 1;

                let newScale = direction > 0 ? oldScale * pendingScaleBy : oldScale / pendingScaleBy;

                let newPos = {
                  x: pointer.x - mousePointTo.x * newScale,
                  y: pointer.y - mousePointTo.y * newScale,
                };

                this.stage.scale({
                  x: newScale,
                  y: newScale,
                })
                this.stage.position(newPos);
              }
            }
          // });
        }
      });
    }
  }

  deleteShape() {
    this.clickedShape?.destroy();
  }

  drawShape(shapeType: ShapeType, x: number, y: number) {
    if (this.stage && this .selectedLayer) {
      let shape;
      // Use the parameter instead of the component variable!
      switch(shapeType) {
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

  generate(count: number): void {
    if (this.stage) {
      for (let i = 0; i <= Math.abs(count); i++) {
        // Random enum value
        const enumValues = (Object.values(ShapeType) as unknown) as ShapeType[keyof ShapeType][];
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        const randomShapeType = enumValues[randomIndex] as ShapeType;
        const randomXPosition = Math.floor(Math.random() * this.stage?.width());
        const randomYPosition = Math.floor(Math.random() * this.stage?.height());
        this.drawShape(randomShapeType, randomXPosition, randomYPosition);
      }
    }
  }

  getCoordinates(shape: Konva.Shape | Konva.Group) {
    const shapeRect = shape.getClientRect();
    return  {
      minX: shapeRect.x,
      maxX: shapeRect.x + shapeRect.width,
      minY: shapeRect.y,
      maxY: shapeRect.y + shapeRect.height
    };
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
    if (this.clickedShape !== undefined) {
      const sortedParkingSpots = this.selectedLayer
        ?.children
        ?.filter((child) => child.attrs.type === ShapeType.PARKING &&
          (child as Shape).fill() !== Colors.highlightBg)
        .sort((shape1, shape2) => {
          const distance1 = this.calculationService.calculateDistance(
            shape1.getClientRect().x,
            shape1.getClientRect().y,
            (this.clickedShape?.getClientRect().x ?? Number.MAX_SAFE_INTEGER),
            (this.clickedShape?.getClientRect().y) ?? Number.MAX_SAFE_INTEGER
          );
          const distance2 = this.calculationService.calculateDistance(
            shape2.getClientRect().x,
            shape2.getClientRect().y,
            (this.clickedShape?.getClientRect().x ?? Number.MAX_SAFE_INTEGER),
            (this.clickedShape?.getClientRect().y) ?? Number.MAX_SAFE_INTEGER
          );
          return distance1 - distance2;
        })
      if (sortedParkingSpots && sortedParkingSpots.length > 0 && this.stage) {
        this.shapeToTop();
        // this.clickedShape?.setPosition({
        //   x: this.clickedShape?.x() + (sortedParkingSpots[0].getClientRect().x - this.clickedShape?.getClientRect().x),
        //   y: this.clickedShape?.y() + (sortedParkingSpots[0].getClientRect().y - this.clickedShape?.getClientRect().y)
        // });
        let actScale = this.stage.scale();
        if (!actScale || actScale.x === 0 || actScale.y === 0) {
          actScale = {x: 1, y: 1};
        }
        this.clickedShape?.to({
          x: (this.clickedShape?.x() + (sortedParkingSpots[0].getClientRect().x - this.clickedShape?.getClientRect().x)) / actScale.x,
          y: (this.clickedShape?.x() + (sortedParkingSpots[0].getClientRect().y - this.clickedShape?.getClientRect().y)) / actScale.y,
        });
        // Highlight the parking spot
        if (sortedParkingSpots[0] instanceof Shape) {
          sortedParkingSpots[0].fill(Colors.highlightBg);
          this.intersectingObjects = { dragged: this.clickedShape, newHighlight: sortedParkingSpots[0]};
        }
      }
    }
  }

  zoomToFit() {
    let minX: number | undefined;
    let maxX: number | undefined;
    let minY: number | undefined;
    let maxY: number | undefined;
    if (this.selectedLayer) {
      if (this.selectedLayer.visible()) {
        this.selectedLayer.children?.forEach(child => {
          if (
            (child instanceof Konva.Shape || child instanceof Konva.Group)
          ) {
            const actCoordinates = this.getCoordinates(child);
            if (!minX || actCoordinates.minX < minX) {
              minX = actCoordinates.minX;
            }
            if (!minY || actCoordinates.minY < minY) {
              minY = actCoordinates.minY;
            }
            if (!maxX || actCoordinates.maxX > maxX) {
              maxX = actCoordinates.maxX;
            }
            if (!maxY || actCoordinates.maxY > maxY) {
              maxY = actCoordinates.maxY;
            }
          }
        });
      }
    }

    if (this.stage) {
      // Zoom out if we're already zoomed
      const zoomed = this.stage.scaleX() !== 1;
      if (zoomed) {
        this.stage.to({
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1
        });
        return;
      }

      if (minX === undefined && minY === undefined && maxX === undefined && maxY === undefined) {
        minX = 0;
        minY = 0;
        maxX = 1;
        maxY = 1;
      }
      if (minX !== undefined && minY !== undefined && maxX !== undefined && maxY !== undefined) {
        let actScale = this.stage.scale();
        if (!actScale || actScale.x === 0 || actScale.y === 0) {
          actScale = {x: 1, y: 1};
        }
        let scale = Math.min(
          actScale.x * (this.stage.width() / actScale.x / (maxX - minX)),
          actScale.y * (this.stage.height() / actScale.y / (maxY - minY))
        );

        this.stage.to({
          x: - minX * scale,
          y: - minY * scale,
          scaleX: scale,
          scaleY: scale,
        });
      }
    }
  }

}

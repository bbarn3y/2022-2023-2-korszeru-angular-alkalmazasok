import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
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
import {GenerateWorkerEvent, ShapesChangedWorkerEvent, WorkerEventType} from "src/app/_models/worker-events-types";

@Component({
  selector: 'app-konva',
  templateUrl: './konva.component.html',
  styleUrls: ['./konva.component.less']
})
export class KonvaComponent implements OnInit, AfterViewInit {
  @ViewChild('contextMenuTrigger') contextMenuTriggerEl?: MatMenuTrigger;
  clickedShape?: Shape | Group;
  intersectingObjects?: { dragged: Shape | Group, newHighlight: Shape | Group};
  menuPositionLeft?: number;
  menuPositionTop?: number;
  selectedLayer?: Konva.Layer;
  selectedShape: ShapeType = ShapeType.CAR;
  stage?: Konva.Stage;
  worker?: Worker;

  ShapeType = ShapeType;

  constructor(private calculationService: CalculationService,
              public userService: UserService) { }

  ngOnInit(): void {
    this.initState();

    this.addEventListeners();
  }

  ngAfterViewInit() {
    this.worker = new Worker(new URL('src/app/_workers/konva.worker.ts', import.meta.url));
    this.worker.onmessage = ( ({ data }) => {
      if (data.type === WorkerEventType.ADD_LAYER) {
        this.addNewLayersFromJson(data.layers);
      } else if (data.type === WorkerEventType.SHAPES_CHANGED) {
        (data as ShapesChangedWorkerEvent).addShapes?.forEach(shapeList => {
          const actLayer = this.stage?.children?.find(layer => layer.id() === shapeList.layerId);
          if (actLayer) {
            shapeList.shapes.forEach(shapeJson => this.addNewShapeFromJson(shapeJson, actLayer));
          }
        });
        (data as ShapesChangedWorkerEvent).changedShapes?.forEach(shapeList => {
          const actLayer = this.stage?.children?.find(layer => layer.id() === shapeList.layerId);
          if (actLayer) {
            shapeList.shapes.forEach(shapeJson => this.updateShapeFromJson(shapeJson, actLayer));
          }
        });
      }
    });
    this.worker.onerror = (error) => {
      console.log('Worker error', error);
    }
    // this.worker.postMessage( { message: 'Message to worker'} )
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
            const pointerPosition = this.stage.getRelativePointerPosition();
            if (pointerPosition) {
              this.drawShape(this.selectedShape, pointerPosition.x, pointerPosition.y);
            }
          }
        }
      });

      this.stage.on('dragmove', function(event) {
        outerThis.intersectingObjects = undefined;
        (outerThis.selectedLayer?.children ?? [])
          .filter((shape) => shape.attrs.type === ShapeType.PARKING)
          .forEach((shape) => {
            const target = event.target as Shape;
            const cars = (outerThis.selectedLayer?.children ?? [])
              .filter((shape) => shape.attrs.type === ShapeType.CAR);
            const collidesWithP = cars
              .some((car) => Konva.Util.haveIntersection(shape.getClientRect(), car.getClientRect()));
            if (collidesWithP) {
              if (shape instanceof Shape) {
                shape.fill(Colors.highlightBg);
              }
            } else {
              (shape as Shape).fill(Colors.defaultBg);
            }
            if (Konva.Util.haveIntersection(target.getClientRect(), shape.getClientRect())) {
              outerThis.intersectingObjects = { dragged: target, newHighlight: shape};
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

      this.stage.on('wheel', (event) => {
        event.evt.preventDefault();

        if (this.stage) {
          let pendingScaleBy = 1.01;
          let oldScale = this.stage.scaleX();
          let pointer = this.stage.getPointerPosition();
          if (pointer) {
            let mousePointTo = {
              x: (pointer.x - this.stage.x()) / oldScale,
              y: (pointer.y - this.stage.y()) / oldScale,
            }

            let direction = event.evt.deltaY > 0 ? -1 : 1;

            let newScale = direction > 0 ? oldScale * pendingScaleBy : oldScale / pendingScaleBy;

            this.stage.position({
              x: pointer.x - mousePointTo.x * newScale,
              y: pointer.y - mousePointTo.y * newScale
            })
            this.stage.scale({
              x: newScale,
              y: newScale
            })
          }
        }
      });
    }
  }

  addNewLayersFromJson(layerJsons: string[]) {
    layerJsons.forEach((layerJson) => {
      const actLayer = Konva.Node.create(JSON.parse(layerJson));
      if (actLayer instanceof Konva.Layer) {
        this.stage?.children?.push(actLayer);
        this.stage?.add(actLayer);
      }
    });
    console.log(this.stage);
  }

  addNewShapeFromJson(shapeJson: string, layer: Konva.Layer) {
    if (this.stage) {
      const actShape = Konva.Node.create(JSON.parse(shapeJson));
      if (actShape instanceof Konva.Shape || actShape instanceof Konva.Group) {
        const actLayer =  this.stage.children?.find(l => l._id === layer._id);
        if (actLayer) {
          actLayer?.add(actShape);
        }
      }
    }
  }
  updateShapeFromJson(shapeJson: string, layer: Konva.Layer) {
    if (this.stage) {
      const actShape = JSON.parse(shapeJson);
      if (actShape) {
        let existingShape = layer.children?.find(child => child.attrs.elementID === actShape.attrs.elementID);
        if (existingShape && existingShape instanceof Konva.Shape) {
          const keys = Array.from(Object.keys(actShape.attrs))
          keys.forEach(key => {
            existingShape?.setAttr(key, actShape.attrs[key]);
          });
        }
      }
    }
  }

  deleteShape() {
    this.clickedShape?.destroy();
  }

  drawShape(shapeType: ShapeType, x: number, y: number) {
    if (this.stage && this.selectedLayer) {
      let shape;
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

  generate(amount: number) {
    // if (this.stage) {
    //   for (let i = 0; i < amount; i++) {
    //     const enumValues = (Object.values(ShapeType) as any) as ShapeType[keyof ShapeType][];
    //     const randomIndex = Math.floor(Math.random() * enumValues.length);
    //     const randomShapeType = enumValues[randomIndex] as ShapeType;
    //     const randomXPosition = Math.floor(Math.random() * this.stage?.width());
    //     const randomYPosition = Math.floor(Math.random() * this.stage?.height());
    //     this.drawShape(randomShapeType, randomXPosition, randomYPosition);
    //   }
    // }

    this.worker?.postMessage(new GenerateWorkerEvent(amount));

  }

  getCoordinates(child: Shape | Group): { minX: number, minY: number, maxX: number, maxY: number } {
    return {
      minX: child.getClientRect().x,
      minY: child.getClientRect().y,
      maxX: child.getClientRect().x + child.getClientRect().width,
      maxY: child.getClientRect().y + child.getClientRect().height
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
    if (this.clickedShape) {
      const sortedParkingSpots = this.selectedLayer
        ?.children
        ?.filter((shape) => shape.attrs.type === ShapeType.PARKING)
        .sort((shape1, shape2) => {
          const distance1: number = this.calculationService.calculateDistance(
            this.clickedShape?.getClientRect().x ?? 0,
            this.clickedShape?.getClientRect().y ?? 0,
            shape1.getClientRect().x,
            shape1.getClientRect().y
          );
          const distance2: number = this.calculationService.calculateDistance(
            this.clickedShape?.getClientRect().x ?? 0,
            this.clickedShape?.getClientRect().y ?? 0,
            shape2.getClientRect().x,
            shape2.getClientRect().y
          );
          return distance1 - distance2;
        });

      if (this.stage && sortedParkingSpots && sortedParkingSpots.length > 0) {
        let currentScale = this.stage.scale();
        if (!currentScale) {
          currentScale = { x: 1, y: 1};
        }
        console.log('currentScale', currentScale);
        this.clickedShape.to({
          x: this.clickedShape.x() + (sortedParkingSpots[0].getClientRect().x - this.clickedShape.getClientRect().x) / currentScale.x,
          y: this.clickedShape.y() + (sortedParkingSpots[0].getClientRect().y - this.clickedShape.getClientRect().y) / currentScale.y
        });
        // console.log('this.clickedShape', this.clickedShape, sortedParkingSpots[0].getClientRect().x, sortedParkingSpots[0].getClientRect().y);
        if (sortedParkingSpots[0] instanceof Shape) {
          sortedParkingSpots[0].fill(Colors.highlightBg);
        }
      }
    }
  }

  zoomToFit() {
    let minX: number = Number.MAX_SAFE_INTEGER;
    let minY: number = Number.MAX_SAFE_INTEGER;
    let maxX: number = Number.MIN_SAFE_INTEGER;
    let maxY: number = Number.MIN_SAFE_INTEGER;
    this.selectedLayer
      ?.children
      ?.forEach((child) => {
        if (minX > this.getCoordinates(child).minX) {
          minX = this.getCoordinates(child).minX;
        }
        if (minY > this.getCoordinates(child).minY) {
          minY = this.getCoordinates(child).minY;
        }
        if (maxX < this.getCoordinates(child).maxX) {
          maxX = this.getCoordinates(child).maxX;
        }
        if (maxY < this.getCoordinates(child).maxY) {
          maxY = this.getCoordinates(child).maxY;
        }
      });

    if (this.stage) {
      const zoomed = this.stage.scaleX() !== 1;
      if (zoomed) {
        this.stage.to({
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1
        })
        return;
      }

      let actScale = this.stage.scale();
      if (!actScale || actScale.x === 0 || actScale.y === 0) {
        actScale = {x: 1, y: 1};
      }
      let scale = Math.min(
        actScale.x * (this.stage.width() / actScale.x / (maxX - minX)),
        actScale.y * (this.stage.height() / actScale.y / (maxY - minY))
      );


      // zoom to fit

      this.stage.to({
        x: - minX * scale,
        y: - minY * scale,
        scaleX: scale,
        scaleY: scale,
      });
    }
  }
}

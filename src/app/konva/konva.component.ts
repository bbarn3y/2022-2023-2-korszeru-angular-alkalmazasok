import {Component, OnInit} from '@angular/core';
import Konva from "konva";
import {StorageKeys} from "src/app/_constants/storage.keys";
import {HouseShape} from "src/app/konva/shapes/house";
import {Shapes} from "src/app/konva/shapes/shape";
import {ParkingShape} from "src/app/konva/shapes/parking";
import {HouseWithParking} from "src/app/konva/shapes/house-with-parking";
import {CarShape} from "src/app/konva/shapes/car";

@Component({
  selector: 'app-konva',
  templateUrl: './konva.component.html',
  styleUrls: ['./konva.component.less']
})
export class KonvaComponent implements OnInit {
  selectedLayer?: Konva.Layer;
  selectedShape: Shapes = Shapes.CAR;
  stage?: Konva.Stage;

  Shapes = Shapes;
  constructor() { }

  ngOnInit(): void {
    this.initKonva();
  }

  addEventListeners() {
    if (this.stage) {
      console.log('add event listeners', this.stage);
      this.stage.on('click', (event) => {
        console.log('stage clicked', event);
        this.drawShape(this.selectedShape, event.evt.offsetX, event.evt.offsetY);
      });

      this.stage.on('dragmove', (event) => {
        // console.log('drag on stag', event);
        // Demo: https://konvajs.org/docs/sandbox/Collision_Detection.html
        if (this.selectedLayer) {
          const target = event.target;
          const targetRect = event.target.getClientRect();
          console.log('target', target, targetRect);
          (this.selectedLayer.children ?? []).forEach(function (group) {
            // do not check intersection with itself
            if (group === target || group.attrs.type !== Shapes.CAR) {
              return;
            }
            if (Konva.Util.haveIntersection(group.getClientRect(), targetRect)) {
              console.log('intersects')
            } else {
              console.log('nope')
            }
          });
        }
      })
    }
  }

  drawShape(type: Shapes, x: number, y: number) {
    if (this.stage) {
      let shape;
      switch(type) {
        case Shapes.CAR:
          shape = new CarShape(this.stage, x, y, 50, 30);
          break;
        case Shapes.HOUSE:
          shape = new HouseShape(this.stage, x, y, 50, 100);
          break;
        case Shapes.HOUSE_WITH_PARKING:
          shape = new HouseWithParking(this.stage, x, y, 100, 75);
          break;
        case Shapes.PARKING:
          shape = new ParkingShape(this.stage, x, y, 50, 50);
          break;
      }
      if (shape && this.selectedLayer) {
        shape.draw(this.selectedLayer);
      }
    }
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
        width: 600,
        height: 600
      });

      // const layer = new Konva.Layer();
      // this.stage.add(layer);
      //
      // const box = new Konva.Rect({
      //   x: 50,
      //   y: 50,
      //   width: 100,
      //   height: 50,
      //   fill: '#00D2FF',
      //   stroke: 'black',
      //   strokeWidth: 4,
      //   draggable: true,
      // });
      // layer.add(box);
    }

    this.selectedLayer = this.stage?.getLayers()[0];

    // Add listeners
    this.addEventListeners();
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

  initKonva() {
    this.initState();

    const layer = this.stage?.getLayers()[0];
    if (this.stage && layer) {
      const houseShape = new HouseShape(this.stage, 100, 200, 50, 50);
      houseShape.draw(layer);
    }

    // add canvas element
    // const layer = new Konva.Layer();
    // this.stage.add(layer);
    //
    // const box = new Konva.Rect({
    //   x: 50,
    //   y: 50,
    //   width: 100,
    //   height: 50,
    //   fill: '#00D2FF',
    //   stroke: 'black',
    //   strokeWidth: 4,
    //   draggable: true,
    // });
    // layer.add(box);
  }

}

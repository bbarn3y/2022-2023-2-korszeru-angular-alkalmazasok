/// <reference lib="webworker" />
// @todo Is this needed? -^
import {
  GenerateEvent,
  LayerAddedEvent,
  ShapeListChangeByLayerID,
  ShapeListChangedWorkerEvent,
  WorkerEvent,
  WorkerEventType,
} from '../_models/worker-types';
import { interval, Subscription } from 'rxjs';
import 'node_modules/konva/konva.min.js';
let Konva = (globalThis as any).Konva;
let layers: any[] = [];
let idNumber = 0;

let blinkingUpdate: Subscription;
let blinkingElements: any[] = []; // type?

let colors = ['red', 'orange', 'green'];
let amount = 4000;
let rows = Math.ceil(Math.sqrt(amount));
let creationObjectBoxWidth = 1000;
let creationObjectBoxHeight = 1000;

// monkeypatch Konva for offscreen canvas usage
Konva.Util.createCanvasElement = () => {
  const canvas = new (globalThis as any).OffscreenCanvas(1, 1);
  canvas.style = {};
  return canvas;
};

self.onmessage = function (event: MessageEvent<WorkerEvent>) {
  console.log('Worker received message', event);
  const workerEvent = event.data;
  if (workerEvent.type === WorkerEventType.GENERATE) {
    const generateEvent = workerEvent as GenerateEvent;
    addNewLayer();
    addRandomObjects(generateEvent.count);
    startBlinkingUpdate();
  } else {
    console.log('Worker received unhandled event', event);
  }
};

function addNewLayer() {
  const actLayer = new Konva.Layer({ name: 'New Layer ' + (layers.length + 1), id: 'Layer_' + idNumber++ });
  layers.push(actLayer);
  postMessage(new LayerAddedEvent([konvaNodeToJson(actLayer)]));
}

function addRandomObjects(amount: number) {
  rows = Math.ceil(Math.sqrt(amount))
  const addShapes = [] as ShapeListChangeByLayerID[];
  for (let i = 0; i < amount; i++) {
    const actLayerIndex = 0;
    let actShapeListChange = addShapes.find(shapeList => shapeList.layer_id === layers[actLayerIndex].id());
    if (!actShapeListChange) {
      actShapeListChange = new ShapeListChangeByLayerID(layers[actLayerIndex].id(), []);
      addShapes.push(actShapeListChange);
    }
    addRandomArrow(i, layers[actLayerIndex], actShapeListChange);
    addRandomRect(i, layers[actLayerIndex], actShapeListChange);
    addRandomText(i, layers[actLayerIndex], actShapeListChange);
  }
  postMessage(new ShapeListChangedWorkerEvent(addShapes));
}

function addRandomArrow(i: number, layer: any /*Konva.Layer*/, actShapeListChange: ShapeListChangeByLayerID) {
  const points = [] as number[];
  for (let j = 0; j < 3; j++) {
    const x = (i % rows) * (creationObjectBoxWidth / 2) + Math.random() * creationObjectBoxWidth;
    const y = Math.floor(i / rows) * (creationObjectBoxHeight / 2) + Math.random() * creationObjectBoxHeight;
    points.push(x, y);
  }
  const actArrow = new Konva.Arrow({
    points: points,
    stroke: 'black',
    strokeWidth: 5,
    tension: Math.random(),
    elementID: 'Arrow_' + idNumber++,
    strokeScaleEnabled: false,
  });
  layer.add(actArrow);
  actShapeListChange.shapes.push(konvaNodeToJson(actArrow));
}

function addRandomRect(i: number, layer: any /*Konva.Layer*/, actShapeListChange: ShapeListChangeByLayerID) {
  const rectX = (i % rows) * (creationObjectBoxWidth / 2) + Math.random() * creationObjectBoxWidth;
  const rectY = Math.floor(i / rows) * (creationObjectBoxHeight / 2) + Math.random() * creationObjectBoxHeight;
  const rectWidth = Math.random() * creationObjectBoxWidth;
  const rectHeight = Math.random() * creationObjectBoxHeight;
  const fillColor = colors[Math.floor(Math.random() * colors.length)];
  const otherColors = colors.filter(color => color !== fillColor);
  const blinkColor = otherColors[Math.round(Math.random() * otherColors.length)];
  const isBlinking = Math.random() < 0.1;
  const actRect = new Konva.Rect({
    x: rectX,
    y: rectY,
    fill: fillColor,
    stroke: 'black',
    strokeWidth: 5,
    //draggable: true,
    elementID: 'Rect_' + idNumber++,
    width: rectWidth,
    height: rectHeight,
    isBlinking: isBlinking,
    originalFill: fillColor,
    blinkFill: blinkColor,
    strokeScaleEnabled: true,
  });
  layer.add(actRect);
  actShapeListChange.shapes.push(konvaNodeToJson(actRect));
  if (isBlinking) {
    blinkingElements.push(actRect);
  }
}

function addRandomText(i: number, layer: any /*Konva.Layer*/, actShapeListChange: ShapeListChangeByLayerID) {
  const textX = (i % rows) * (creationObjectBoxWidth / 2) + Math.random() * creationObjectBoxWidth;
  const textY = Math.floor(i / rows) * (creationObjectBoxHeight / 2) + Math.random() * creationObjectBoxHeight;
  // const textWidth = Math.random() * creationObjectBoxWidth;
  // const textHeight = Math.random() * creationObjectBoxHeight;
  const actText = new Konva.Text({
    x: textX,
    y: textY,
    text: 'Text ' + idNumber++,
    fontSize: 22,
    fontFamily: 'Calibri',
    fill: colors[Math.floor(Math.random() * colors.length)],
    elementID: 'Text_' + idNumber++,
    // width: textWidth,
    // height: textHeight,
    strokeScaleEnabled: true,
  });
  layer.add(actText);
  actShapeListChange.shapes.push(konvaNodeToJson(actText));
}

function startBlinkingUpdate() {
  if (!blinkingUpdate) {
    blinkingUpdate = interval(1000).subscribe(() => {
      if (blinkingElements && blinkingElements.length > 0) {
        const changeShapes = [] as ShapeListChangeByLayerID[];
        blinkingElements.forEach(element => {
          const layer = element.getLayer();
          if (layer) {
            let actShapeListChange = changeShapes.find(shapeListChange => shapeListChange.layer_id === layer.id());
            if (!actShapeListChange) {
              actShapeListChange = new ShapeListChangeByLayerID(layer.id(), []);
              changeShapes.push(actShapeListChange);
            }
            if (element.attrs.blinkFill && element.attrs.originalFill) {
              if (element.fill() === element.attrs.originalFill) {
                element.attrs.fill = element.attrs.blinkFill;
              } else {
                element.attrs.fill = element.attrs.originalFill;
              }
              actShapeListChange.shapes.push(konvaNodeToJson(element));
            }
          }
        });
        postMessage(new ShapeListChangedWorkerEvent(undefined, changeShapes));
      }
    });
  }
}

function konvaNodeToJson(node: any) {
  // let children: string[] | undefined;
  // if ((node as any).children) {
  //   children = (node as any).children
  //     .map((child: any /*Konva.Node*/) => JSON.parse(konvaNodeToJson(child)));
  // }
  // let actBaseJson = node.toJSON();
  // let actParsedJson = JSON.parse(actBaseJson);
  // if (!(node instanceof Konva.Stage)) {
    // actParsedJson.attrs = JSON.parse(JSON.stringify(node.attrs));
  // }
  // actParsedJson.children = children;
  // return JSON.stringify(node);
  return node.toJSON();
}

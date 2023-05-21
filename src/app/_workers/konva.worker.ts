import {
  AddLayerWorkerEvent,
  GenerateWorkerEvent, ShapeChangeByLayerID, ShapesChangedWorkerEvent,
  WorkerEvent,
  WorkerEventType
} from "src/app/_models/worker-events-types";
import 'node_modules/konva/konva.min.js';
import {interval, Subscription} from "rxjs";

let Konva = (globalThis as any).Konva;

let blinkingUpdate: Subscription;
let blinkingElements: any[] = [];
let colors = ['red', 'black', 'green', 'blue', 'orange'];
const layers: any[] = []; // Konva.Layer

// monkeypatch Konva for offscreen canvas usage
Konva.Util.createCanvasElement = () => {
  const canvas = new (globalThis as any).OffscreenCanvas(1, 1);
  canvas.style = {};
  return canvas;
};

self.onmessage = function (event: MessageEvent<WorkerEvent>) {
  console.log('worker received message', event);
  const workerEvent = event.data;

  if (workerEvent.type === WorkerEventType.GENERATE) {
    // @todo review visitor pattern in TS
    const generateWorkerEvent = workerEvent as GenerateWorkerEvent;
    addNewLayer();
    addRandomObjects(generateWorkerEvent.count);
    startBlinkingUpdate();
  } else {
    console.log('Worker received unhandled event: ' , event);
  }
}

function addNewLayer() {
  const actLayer = new Konva.Layer( { name: `Layer_${layers.length}`, id: `Layer_${layers.length}` } );
  layers.push(actLayer);
  postMessage( new AddLayerWorkerEvent([actLayer.toJSON()]));
}

function addRandomObjects(amount: number) {
  const addShapes = [] as ShapeChangeByLayerID[];
  for (let i = 0; i < amount; i++) {
    const actLayerIndex = 0;
    let actShapeListChange = addShapes.find(shapeList => shapeList.layerId === layers[actLayerIndex].id());
    if (!actShapeListChange) {
      actShapeListChange = new ShapeChangeByLayerID(layers[actLayerIndex].id(), []);
      addShapes.push(actShapeListChange);
    }
    addRandomArrow(i, layers[actLayerIndex], actShapeListChange);
    addRandomRect(i, layers[actLayerIndex], actShapeListChange);
    addRandomText(i, layers[actLayerIndex], actShapeListChange);
  }
  postMessage(new ShapesChangedWorkerEvent(addShapes));
}

function addRandomArrow(index: number, layer: any /* Konva.Layer */, shapesChanged: ShapeChangeByLayerID) {
  const points: number[] = [];
  for (let j = 0; j < 3; j++) {
    const x = Math.floor((Math.random() * 1000));
    const y = Math.floor((Math.random() * 1000));
    points.push(x, y);
  }
  const actArrow =  new Konva.Arrow({
    points: points,
    stroke: 'black',
    strokeWidth: 5,
    tension: Math.random(),
    elementID: `Arrow_${index}`
  });
  layer.add(actArrow);
  // @todo continue!
  shapesChanged.shapes.push(actArrow.toJSON());
}

function addRandomRect(i: number, layer: any /*Konva.Layer*/, actShapeListChange: ShapeChangeByLayerID) {
  const rectX =  Math.floor((Math.random() * 1000))
  const rectY =  Math.floor((Math.random() * 1000))
  const rectWidth =  Math.floor((Math.random() * 500))
  const rectHeight =  Math.floor((Math.random() * 500));
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
    elementID: 'Rect_' + i,
    width: rectWidth,
    height: rectHeight,
    isBlinking: isBlinking,
    originalFill: fillColor,
    blinkFill: blinkColor,
    strokeScaleEnabled: true,
  });
  layer.add(actRect);
  actShapeListChange.shapes.push(actRect.toJSON());
  if (isBlinking) {
    blinkingElements.push(actRect);
  }
}

function addRandomText(i: number, layer: any /*Konva.Layer*/, actShapeListChange: ShapeChangeByLayerID) {
  const textX = Math.floor((Math.random() * 1000));
  const textY = Math.floor((Math.random() * 1000));
  const actText = new Konva.Text({
    x: textX,
    y: textY,
    text: 'Text ' + i,
    fontSize: 22,
    fontFamily: 'Calibri',
    fill: colors[Math.floor(Math.random() * colors.length)],
    elementID: 'Text_' + i,
    strokeScaleEnabled: true,
  });
  layer.add(actText);
  actShapeListChange.shapes.push(actText.toJSON());
}

function startBlinkingUpdate() {
  if (!blinkingUpdate) {
    blinkingUpdate = interval(1000).subscribe(() => {
      if (blinkingElements && blinkingElements.length > 0) {
        const changeShapes = [] as ShapeChangeByLayerID[];
        blinkingElements.forEach(element => {
          const layer = element.getLayer();
          if (layer) {
            let actShapeListChange = changeShapes.find(shapeListChange => shapeListChange.layerId === layer.id());
            if (!actShapeListChange) {
              actShapeListChange = new ShapeChangeByLayerID(layer.id(), []);
              changeShapes.push(actShapeListChange);
            }
            if (element.attrs.blinkFill && element.attrs.originalFill) {
              if (element.fill() === element.attrs.originalFill) {
                element.attrs.fill = element.attrs.blinkFill;
              } else {
                element.attrs.fill = element.attrs.originalFill;
              }
              element.attrs.x += Math.floor(Math.random() * 20) - 10;
              element.attrs.y += Math.floor(Math.random() * 20) - 10;
              actShapeListChange.shapes.push(element.toJSON());
            }
          }
        });
        postMessage(new ShapesChangedWorkerEvent([], changeShapes));
      }
    });
  }
}


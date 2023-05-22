import {
  AddLayerWorkerEvent,
  GenerateWorkerEvent, ShapeChangeByLayerID, ShapesChangedWorkerEvent,
  WorkerEvent,
  WorkerEventType
} from "src/app/_models/worker-events-types";
import 'node_modules/konva/konva.min.js';
import {interval, Subscription} from "rxjs";

let Konva = (globalThis as any).Konva;

let blinkingUpdate: Subscription | null = null;
let blinkingElements: any[] = []; // Konva.Rect[]
const colors = ['red', 'orange', 'black', 'blue', 'green'];
const layers: any[] = []; // Konva.Layer

startBlinkingUpdate();

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
  }
}

function addNewLayer() {
  const actLayer = new Konva.Layer( { name: `Layer_${layers.length}`, id: `Layer_${layers.length}` } );
  layers.push(actLayer);
  postMessage( new AddLayerWorkerEvent([actLayer.toJSON()]));
}

function addRandomObjects(amount: number) {
  const addedShapes: ShapeChangeByLayerID[] = [];
  for (let i = 0; i < amount; i++) {
    const actLayerIndex = layers.length - 1;
    let actShapeList = addedShapes.find(shapeList => shapeList.layerId === layers[actLayerIndex].id());
    if (!actShapeList) {
      actShapeList = new ShapeChangeByLayerID(layers[actLayerIndex].id(), []);
      addedShapes.push(actShapeList);
    }

    addRandomArrow(i, layers[actLayerIndex], actShapeList);
    addRandomRect(i, layers[actLayerIndex], actShapeList);
    addRandomText(i, layers[actLayerIndex], actShapeList);
  }
  postMessage(new ShapesChangedWorkerEvent(addedShapes));
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

  shapesChanged.shapes.push(actArrow.toJSON());
}

function addRandomRect(index: number, layer: any /* Konva.Layer */, shapesChanged: ShapeChangeByLayerID) {
  const originalFillColor = colors[Math.floor(Math.random() * colors.length)];
  const otherColors = colors.filter((c) => c !== originalFillColor);
  const blinkFillColor = otherColors[Math.floor(Math.random() * otherColors.length)];
  const isBlinking = Math.random() < 0.2;
  const actRect = new Konva.Rect({
    x: Math.floor((Math.random() * 1000)),
    y: Math.floor((Math.random() * 1000)),
    fill: originalFillColor,
    stroke: 'black',
    strokeWidth: 5,
    elementID: `Rect_${index}`,
    width: Math.floor((Math.random() * 500)),
    height: Math.floor((Math.random() * 500)),
    isBlinking: isBlinking,
    originalFillColor: originalFillColor,
    blinkFillColor: blinkFillColor,
  });
  layer.add(actRect);
  shapesChanged.shapes.push(actRect.toJSON());
  if (isBlinking) {
    blinkingElements.push(actRect);
  }
}

function addRandomText(index: number, layer: any /* Konva.Layer */, shapesChanged: ShapeChangeByLayerID) {
  const textX = Math.floor((Math.random() * 1000));
  const textY = Math.floor((Math.random() * 1000));
  const actText = new Konva.Text({
    x: textX,
    y: textY,
    text: `Text_${index}`,
    fontSize: 22,
    fontFamily: 'Calibri',
    fill: colors[Math.floor(Math.random() * colors.length)],
    elementID: `Text_${index}`
  });
  layer.add(actText);
  shapesChanged.shapes.push(actText.toJSON());
}

function startBlinkingUpdate() {
  blinkingUpdate = interval(1000).subscribe(() => {
    if (blinkingElements.length > 0) {
      const changeShapes: ShapeChangeByLayerID[] = [];
      blinkingElements.forEach((element) => {
        const layer = element.getLayer();
        if (layer) {
          let actShapeListChange = changeShapes.find(change => change.layerId === layer.id());
          if (!actShapeListChange) {
            actShapeListChange = new ShapeChangeByLayerID(layer.id(), []);
            changeShapes.push(actShapeListChange);
          }
          if (element.attrs.blinkFillColor && element.attrs.originalFillColor) {
            if (element.fill() === element.attrs.originalFillColor) {
              element.attrs.fill = element.attrs.blinkFillColor;
            } else {
              element.attrs.fill = element.attrs.originalFillColor;
            }
            actShapeListChange.shapes.push(element.toJSON());
          }
        }
      });

      postMessage(new ShapesChangedWorkerEvent([], changeShapes));
    }
  });
}

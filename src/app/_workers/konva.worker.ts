import {
  AddLayerWorkerEvent,
  GenerateWorkerEvent, ShapeChangeByLayerID,
  WorkerEvent,
  WorkerEventType
} from "src/app/_models/worker-events-types";
import 'node_modules/konva/konva.min.js';

let Konva = (globalThis as any).Konva;

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
  }
}

function addNewLayer() {
  const actLayer = new Konva.Layer( { name: `Layer_${layers.length}`, id: `Layer_${layers.length}` } );
  layers.push(actLayer);
  postMessage( new AddLayerWorkerEvent([actLayer.toJSON()]));
}

function addRandomObjects(amount: number) {

  for (let i = 0; i < amount; i++) {

  }
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

}


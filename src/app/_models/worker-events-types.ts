export enum WorkerEventType {
  GENERATE = 'GENERATE',
  ADD_LAYER = 'ADD_LAYER',
  SHAPES_CHANGED = 'SHAPES_CHANGED'
}

export class WorkerEvent {
  type: WorkerEventType;

  constructor(type: WorkerEventType) {
    this.type = type;
  }
}

export class AddLayerWorkerEvent extends WorkerEvent {
  layers: string[];

  constructor(layers: string[]) {
    super(WorkerEventType.ADD_LAYER);
    this.layers = layers;
  }
}

export class GenerateWorkerEvent extends WorkerEvent {
  count: number;

  constructor(count: number) {
    super(WorkerEventType.GENERATE);
    this.count = count;
  }
}

export class ShapesChangedWorkerEvent extends WorkerEvent {
  addShapes?: ShapeChangeByLayerID[];
  changedShapes?: ShapeChangeByLayerID[];
  removedShapes?: ShapeChangeByLayerID[];
}

export class ShapeChangeByLayerID {
  layerId: string;
  shapes: string[];

  constructor(layerId: string, shapes: string[]) {
    this.layerId = layerId;
    this.shapes = shapes;
  }
}

export enum WorkerEventType {
  GENERATE = 'GENERATE' as any,
  LAYER_ADDED = 'LAYER_ADDED' as any,
  SHAPES_CHANGED = 'SHAPES_CHANGED' as any,
}

export class WorkerEvent {
  type: WorkerEventType;
  constructor(type: WorkerEventType) {
    this.type = type;
  }
}

export class GenerateEvent extends WorkerEvent {
  count: number;

  constructor(count: number) {
    super(WorkerEventType.GENERATE);
    this.count = count
  }
}

export class LayerAddedEvent extends WorkerEvent {
  layers?: string[];

  constructor(layers: string[]) {
    super(WorkerEventType.LAYER_ADDED);
    this.layers = layers;
  }
}

export class ShapeListChangedWorkerEvent extends WorkerEvent {
  addShapes?: ShapeListChangeByLayerID[];
  changeShapes?: ShapeListChangeByLayerID[];
  constructor(
    addShapes?: ShapeListChangeByLayerID[],
    changeShapes?: ShapeListChangeByLayerID[]
  ) {
    super(WorkerEventType.SHAPES_CHANGED);
    this.addShapes = addShapes;
    this.changeShapes = changeShapes;
  }
}

export class ShapeListChangeByLayerID {
  layer_id: string;
  shapes: string[];
  constructor(layer_id: string, shapes: string[]) {
    this.layer_id = layer_id;
    this.shapes = shapes;
  }
}

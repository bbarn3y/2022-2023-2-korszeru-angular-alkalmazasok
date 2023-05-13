import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor() { }

  calculateDistance(shape1X: number, shape1Y: number, shape2X: number, shape2Y: number): number {
    return Math.round(Math.sqrt(Math.pow((shape2X - shape1X), 2) + Math.pow((shape2Y - shape1Y), 2)));
  }
}

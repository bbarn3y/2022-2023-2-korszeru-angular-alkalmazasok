import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor() { }

  calculateDistance(x1: number, y1: number, x2: number, y2: number) {
    const x = x2 - x1;
    const y = y2 - y2;
    return Math.sqrt(x * x + y * y);
  }
}

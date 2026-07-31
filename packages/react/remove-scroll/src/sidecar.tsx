// Fork of https://github.com/theKashey/react-remove-scroll
// MIT License, Copyright (c) Anton Korzunov
import { exportSidecar } from './lib/use-sidecar.js';
import { RemoveScrollSideCar } from './side-effect.js';
import { effectCar } from './medium.js';

export const SideCar = exportSidecar(effectCar, RemoveScrollSideCar);

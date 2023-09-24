import { Beach } from './Beach';
import { ForecastPoint } from './ForecastPoint';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

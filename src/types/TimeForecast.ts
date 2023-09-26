import { BeachForecast } from './BeachForecast';

export interface TimeForecast {
    time: string;
    forecast: Array<BeachForecast>;
}

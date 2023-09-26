import { StormGlass } from '@src/clients';
import { Beach, BeachForecast, TimeForecast } from '@src/types';

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) {}

    public async processForecastForBeaches(
        beaches: Array<Beach>
    ): Promise<Array<TimeForecast>> {
        const pointsWithCorrectSources: Array<BeachForecast> = [];
        for (const beach of beaches) {
            const { lat, lng, name, position } = beach;
            const points = await this.stormGlass.fetchPoints(lat, lng);
            const enrichedBeachData = points.map((pointData) => ({
                lat,
                lng,
                name,
                position,
                rating: 1,
                ...pointData,
            }));
            pointsWithCorrectSources.push(...enrichedBeachData);
        }

        return this.mapForecastByTime(pointsWithCorrectSources);
    }

    private mapForecastByTime(
        forecast: Array<BeachForecast>
    ): Array<TimeForecast> {
        const forecastByTime: Array<TimeForecast> = [];

        for (const point of forecast) {
            const timePoint = forecastByTime.find(
                (forecastObject) => forecastObject.time === point.time
            );

            if (timePoint) {
                timePoint.forecast.push(point);
            } else {
                forecastByTime.push({
                    time: point.time,
                    forecast: [point],
                });
            }
        }

        return forecastByTime;
    }
}

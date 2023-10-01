import { StormGlass } from '@src/clients';
import { Beach, BeachForecast, ForecastPoint, TimeForecast } from '@src/types';
import { InternalError } from '@src/utils';

export class ForecastProcessingInternalError extends InternalError {
    constructor(message: string) {
        super(`Unexpected error during the forecast processing: ${message}`);
    }
}

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) {}

    public async processForecastForBeaches(
        beaches: Array<Beach>
    ): Promise<Array<TimeForecast>> {
        const pointsWithCorrectSources: Array<BeachForecast> = [];

        try {
            for (const beach of beaches) {
                const { lat, lng } = beach;
                const points = await this.stormGlass.fetchPoints(lat, lng);
                const enrichedBeachData = this.enrichBeachData(points, beach);
                pointsWithCorrectSources.push(...enrichedBeachData);
            }

            return this.mapForecastByTime(pointsWithCorrectSources);
        } catch (error) {
            throw new ForecastProcessingInternalError((error as Error).message);
        }
    }

    private enrichBeachData(
        points: ForecastPoint[],
        beach: Beach
    ): BeachForecast[] {
        const { lat, lng, name, position } = beach;

        return points.map((pointData) => ({
            lat,
            lng,
            name,
            position,
            rating: 1,
            ...pointData,
        }));
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

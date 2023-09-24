import { StormGlass } from '@src/clients';
import { Beach, BeachForecast } from '@src/types';

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) {}

    public async processForecastForBeaches(
        beaches: Array<Beach>
    ): Promise<Array<BeachForecast>> {
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

        return pointsWithCorrectSources;
    }
}

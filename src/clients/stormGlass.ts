import { AxiosStatic } from 'axios';

export interface StormGlassPointSource {
    [key: string]: number;
}

export interface StormGlassPoint {
    time: string;
    readonly waveHeight: StormGlassPointSource;
    readonly waveDirection: StormGlassPointSource;
    readonly swellDirection: StormGlassPointSource;
    readonly swellHeight: StormGlassPointSource;
    readonly swellPeriod: StormGlassPointSource;
    readonly windDirection: StormGlassPointSource;
    readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
    hours: Array<StormGlassPoint>;
}

export interface ForecastPoint {
    time: string;
    waveHeight: number;
    waveDirection: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    windDirection: number;
    windSpeed: number;
}

export class StormGlass {
    readonly stormGlassAPIUrl = 'https://api.stormglass.io/v2/weather/point';
    readonly stormGlassAPIParams =
        'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassSource = 'noaa';

    constructor(protected request: AxiosStatic) {}

    public async fetchPoints(
        latitude: number,
        longitude: number
    ): Promise<Array<ForecastPoint>> {
        const response = await this.request.get<StormGlassForecastResponse>(
            `${this.stormGlassAPIUrl}?lat=${latitude}&lng=${longitude}&params=${this.stormGlassAPIParams}&source=${this.stormGlassSource}`,
            {
                headers: {
                    Authorization: process.env.STORM_GLASS_API_KEY,
                },
            }
        );

        return this.normalizeResponse(response.data);
    }

    private normalizeResponse(
        points: StormGlassForecastResponse
    ): Array<ForecastPoint> {
        return points.hours
            .filter(this.isValidPoint.bind(this))
            .map((point) => ({
                time: point.time,
                swellDirection: point.swellDirection[this.stormGlassSource],
                swellHeight: point.swellHeight[this.stormGlassSource],
                swellPeriod: point.swellPeriod[this.stormGlassSource],
                waveDirection: point.waveDirection[this.stormGlassSource],
                waveHeight: point.waveHeight[this.stormGlassSource],
                windDirection: point.windDirection[this.stormGlassSource],
                windSpeed: point.windSpeed[this.stormGlassSource],
            }));
    }

    private isValidPoint(point: Partial<StormGlassPoint>): boolean {
        console.log(
            !!(
                point.time &&
                point.swellDirection?.[this.stormGlassSource] &&
                point.swellHeight?.[this.stormGlassSource] &&
                point.swellPeriod?.[this.stormGlassSource] &&
                point.waveDirection?.[this.stormGlassSource] &&
                point.waveHeight?.[this.stormGlassSource] &&
                point.windDirection?.[this.stormGlassSource] &&
                point.windSpeed?.[this.stormGlassSource]
            )
        );
        return !!(
            point.time &&
            point.swellDirection?.[this.stormGlassSource] &&
            point.swellHeight?.[this.stormGlassSource] &&
            point.swellPeriod?.[this.stormGlassSource] &&
            point.waveDirection?.[this.stormGlassSource] &&
            point.waveHeight?.[this.stormGlassSource] &&
            point.windDirection?.[this.stormGlassSource] &&
            point.windSpeed?.[this.stormGlassSource]
        );
    }
}

import {
    ForecastPoint,
    StormGlassForecastResponse,
    StormGlassPoint,
} from '@src/types';
import { InternalError } from '@src/utils';
import * as HttpUtil from '@src/utils/request';
import { AxiosError } from 'axios';
import config, { IConfig } from 'config';

export class ClientRequestError extends InternalError {
    constructor(message: string) {
        const internalMessage = `Unexpected error when trying to communicate to StormGlass`;
        super(`${internalMessage}: ${message}`);
    }
}

export class StormGlassResponseError extends InternalError {
    constructor(message: string) {
        const internalMessage =
            'Unexpected error returned by the StormGlass service';
        super(`${internalMessage}: ${message}`);
    }
}

const stormGlassResourceConfig: IConfig = config.get(
    'App.resources.StormGlass'
);

export class StormGlass {
    readonly stormGlassAPIParams =
        'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassSource = 'noaa';

    constructor(protected request = new HttpUtil.Request()) {}

    public async fetchPoints(
        latitude: number,
        longitude: number
    ): Promise<Array<ForecastPoint>> {
        try {
            const response = await this.request.get<StormGlassForecastResponse>(
                `${stormGlassResourceConfig.get(
                    'apiUrl'
                )}/weather/point?lat=${latitude}&lng=${longitude}&params=${
                    this.stormGlassAPIParams
                }&source=${this.stormGlassSource}`,
                {
                    headers: {
                        Authorization: stormGlassResourceConfig.get('apiToken'),
                    },
                }
            );

            return this.normalizeResponse(response.data);
        } catch (err) {
            const axiosError = err as AxiosError;

            if (
                axiosError &&
                axiosError.response &&
                HttpUtil.Request.isRequestError(axiosError)
            ) {
                throw new StormGlassResponseError(
                    `Error: ${JSON.stringify(axiosError.response.data)} Code: ${
                        axiosError.response.status
                    }`
                );
            }

            throw new ClientRequestError((err as { message: string }).message);
        }
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

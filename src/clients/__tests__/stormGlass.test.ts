import { StormGlass } from '@src/clients/stormGlass';
import { Response } from '@src/types';
import * as HttpUtil from '@src/utils/request';
import stormGlass3HoursFixture from '@tests/fixtures/stormGlass3HoursFixture.json';
import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormGlassNormalized3HoursFixture.json';

jest.mock('@src/utils/request');

describe('StormGlass Client', () => {
    const MockedRequestClass = HttpUtil.Request as jest.Mocked<
        typeof HttpUtil.Request
    >;

    const mockedRequest =
        new HttpUtil.Request() as jest.Mocked<HttpUtil.Request>;

    it('should return the normalized forecast from the StormGlass service', async () => {
        const latitude = 58.7984;
        const longitude = 17.8081;

        mockedRequest.get.mockResolvedValue({
            data: stormGlass3HoursFixture,
        } as Response);

        const stormGlass = new StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(latitude, longitude);

        expect(response).toEqual(stormGlassNormalized3HoursFixture);
    });

    it('should exclude incomplete data points', async () => {
        const latitude = 58.7984;
        const longitude = 17.8081;

        const incompleteResponse = {
            hours: [
                {
                    windDirection: {
                        noaa: 300,
                    },
                    time: '2020-04-26T00:00+00:00',
                },
            ],
        };

        mockedRequest.get.mockResolvedValue({
            data: incompleteResponse,
        } as Response);

        const stormGlass = new StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(latitude, longitude);

        expect(response).toEqual([]);
    });

    it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
        const latitude = 58.7984;
        const longitude = 17.8081;

        mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

        const stormGlass = new StormGlass(mockedRequest);

        await expect(
            stormGlass.fetchPoints(latitude, longitude)
        ).rejects.toThrow(
            'Unexpected error when trying to communicate to StormGlass: Network Error'
        );
    });

    it('should get a StormGlassResponseError service when the StormGlass service responds with an error', async () => {
        const latitude = 58.7984;
        const longitude = 17.8081;

        MockedRequestClass.isRequestError.mockReturnValue(true);
        mockedRequest.get.mockRejectedValue({
            response: {
                status: 429,
                data: { errors: ['Rate limit reached'] },
            },
        });

        const stormGlass = new StormGlass(mockedRequest);

        await expect(
            stormGlass.fetchPoints(latitude, longitude)
        ).rejects.toThrow(
            'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate limit reached"]} Code: 429'
        );
    });
});

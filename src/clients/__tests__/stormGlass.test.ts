import { StormGlass } from '@src/clients/stormGlass';
import stormGlass3HoursFixture from '@tests/fixtures/stormGlass3HoursFixture.json';
import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormGlassNormalized3HoursFixture.json';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass Client', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    it('should return the normalized forecast from the StormGlass service', async () => {
        const latitude = 58.7984;
        const longitude = 17.8081;

        mockedAxios.get.mockResolvedValue({ data: stormGlass3HoursFixture });

        const stormGlass = new StormGlass(axios);
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

        mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

        const stormGlass = new StormGlass(axios);
        const response = await stormGlass.fetchPoints(latitude, longitude);

        expect(response).toEqual([]);
    });

    it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
        const latitude = 58.7984;
        const longitude = 17.8081;

        mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

        const stormGlass = new StormGlass(mockedAxios);

        await expect(
            stormGlass.fetchPoints(latitude, longitude)
        ).rejects.toThrow(
            'Unexpected error when trying to communicate to StormGlass: Network Error'
        );
    });

    it('should get a StormGlassResponseError service when the StormGlass service responds with an error', async () => {
        const latitude = 58.7984;
        const longitude = 17.8081;

        mockedAxios.get.mockRejectedValue({
            response: {
                status: 429,
                data: { errors: ['Rate limit reached'] },
            },
        });

        const stormGlass = new StormGlass(mockedAxios);

        await expect(
            stormGlass.fetchPoints(latitude, longitude)
        ).rejects.toThrow(
            'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate limit reached"]} Code: 429'
        );
    });
});

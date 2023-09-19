import { StormGlass } from '@src/clients/stormGlass';
import stormGlass3HoursFixture from '@tests/fixtures/stormGlass3HoursFixture.json';
import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormGlassNormalized3HoursFixture.json';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass Client', () => {
    it('should return the normalized forecast from the StormGlass service', async () => {
        const latitude = 58.7984;
        const longitude = 17.8081;

        axios.get = jest
            .fn()
            .mockResolvedValue({ data: stormGlass3HoursFixture });

        const stormGlass = new StormGlass(axios);
        const response = await stormGlass.fetchPoints(latitude, longitude);

        expect(response).toEqual(stormGlassNormalized3HoursFixture);
    });
});

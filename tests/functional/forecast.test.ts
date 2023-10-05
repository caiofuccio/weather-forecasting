import { BeachModel } from '@src/models/beach';
import { BeachPosition } from '@src/types';
import nock from 'nock';
import stormGlass3HoursFixture from '../fixtures/stormGlass3HoursFixture.json';
import { apiForecastResponse1Beach } from '@tests/fixtures';

describe('Beach forecast functional tests', () => {
    beforeEach(async () => {
        await BeachModel.deleteMany({});
        const defaultBeach = {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: BeachPosition.E,
        };

        const beach = new BeachModel(defaultBeach);
        await beach.save();
    });

    it('should return a forecast with just a few times', async () => {
        nock('https://api.stormglass.io:443', {
            encodedQueryParams: true,
            reqheaders: {
                Authorization: (): boolean => true,
            },
        })
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get('/v2/weather/point')
            .query({
                lat: '-33.792726',
                lng: '151.289824',
                params: /(.*)/,
                source: 'noaa',
            })
            .reply(200, stormGlass3HoursFixture);

        const { body, status } = await global.testRequest.get('/forecast');

        expect(status).toBe(200);
        expect(body).toEqual(apiForecastResponse1Beach);
    });
});

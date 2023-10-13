import { Controller, Get } from '@overnightjs/core';
import { BeachModel } from '@src/models/beach';
import { ForecastService } from '@src/services/forecast';
import { Request, Response } from 'express';

const forecast = new ForecastService();

@Controller('forecast')
export class ForecastController {
    @Get('')
    public async getForecastForLoggedUser(
        _: Request,
        res: Response
    ): Promise<void> {
        try {
            const beaches = await BeachModel.find({});
            const forecastData = await forecast.processForecastForBeaches(
                beaches
            );
            res.status(200).send(forecastData);
        } catch (error) {
            res.status(500).send({ error: 'Something went wrong' });
        }
    }
}

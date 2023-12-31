import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import { BeachModel } from '@src/models/beach';
import { ForecastService } from '@src/services/forecast';
import { Request, Response } from 'express';

const forecast = new ForecastService();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController {
    @Get('')
    public async getForecastForLoggedUser(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const beaches = await BeachModel.find({ user: req.decoded?.id });
            const forecastData = await forecast.processForecastForBeaches(
                beaches
            );
            res.status(200).send(forecastData);
        } catch (error) {
            logger.error(error);
            res.status(500).send({ error: 'Something went wrong' });
        }
    }
}

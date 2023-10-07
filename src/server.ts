import './utils/module-alias';
import { Server } from '@overnightjs/core';
import * as database from '@src/database';
import bodyParser from 'body-parser';
import { Application } from 'express';
import { BeachesController, ForecastController } from './controllers';

export class SetupServer extends Server {
    constructor(private port = 8080) {
        super();
    }

    public async init(): Promise<void> {
        this.setupExpress();
        this.setupControllers();
        await this.databaseSetup();
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json());
    }

    private setupControllers(): void {
        const forecastController = new ForecastController();
        const beachesController = new BeachesController();
        this.addControllers([forecastController, beachesController]);
    }

    private async databaseSetup(): Promise<void> {
        await database.connect();
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.info('Server listening on port: ', this.port);
        });
    }

    public async close(): Promise<void> {
        await database.close();
    }

    public getApp(): Application {
        return this.app;
    }
}

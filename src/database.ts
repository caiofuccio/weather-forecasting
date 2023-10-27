import config, { IConfig } from 'config';
import { connect as mongooseConnect, connection } from 'mongoose';
import logger from './logger';

const dbConfig: IConfig = config.get('App.database');

export const connect = async (): Promise<void> => {
    try {
        await mongooseConnect(dbConfig.get('mongoUrl'));
        logger.info('Connected to database successfully');
    } catch (error) {
        logger.error(
            `Error while trying to connect to database: ${
                (error as Error).message
            }`
        );
    }
};

export const close = (): Promise<void> => connection.close();

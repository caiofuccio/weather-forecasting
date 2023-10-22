import config, { IConfig } from 'config';
import { connect as mongooseConnect, connection } from 'mongoose';

const dbConfig: IConfig = config.get('App.database');

export const connect = async (): Promise<void> => {
    try {
        await mongooseConnect(dbConfig.get('mongoUrl'));
        console.log('Connected to database successfully');
    } catch (error) {
        console.log(
            'Error while trying to connect to database:',
            (error as Error).message
        );
    }
};

export const close = (): Promise<void> => connection.close();

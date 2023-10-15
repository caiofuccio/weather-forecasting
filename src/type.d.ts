import http from 'http';
import { DecodedUser } from './types/DecodedUser';

declare module 'express-serve-static-core' {
    export interface Request extends http.IncomingMessage, Express.Request {
        decoded?: DecodedUser;
    }
}

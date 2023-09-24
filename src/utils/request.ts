import { RequestConfig, Response } from '@src/types';
import axios, { AxiosError } from 'axios';

export class Request {
    constructor(private request = axios) {}

    public get<T>(
        url: string,
        config: RequestConfig = {}
    ): Promise<Response<T>> {
        return this.request.get<T, Response<T>>(url, config);
    }

    public static isRequestError(error: AxiosError): boolean {
        return !!(error.response && error.response.status);
    }
}

import { AxiosResponse } from 'axios';

export interface Response<T = unknown> extends AxiosResponse<T> {}

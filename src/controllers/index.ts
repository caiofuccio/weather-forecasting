import { CUSTOM_VALIDATION } from '@src/utils';
import { Response } from 'express';
import mongoose from 'mongoose';

export * from './beaches';
export * from './forecast';

export abstract class BaseController {
    protected sendCreateUpdatedErrorResponse(
        res: Response,
        error: mongoose.Error.ValidationError | Error
    ): void {
        if (error instanceof mongoose.Error.ValidationError) {
            const clientErrors = this.handleClientErrors(error);
            this.createResponse(res, clientErrors.code, clientErrors.error);
        } else {
            this.createResponse(res, 500, 'Something went wrong');
        }
    }

    private handleClientErrors(error: mongoose.Error.ValidationError): {
        code: number;
        error: string;
    } {
        const duplicatedKindErrors = Object.values(error.errors).filter(
            (error) => error.kind === CUSTOM_VALIDATION.DUPLICATED
        );

        if (duplicatedKindErrors.length) {
            return {
                code: 409,
                error: error.message,
            };
        } else return { code: 422, error: error.message };
    }

    private createResponse(
        res: Response,
        code: number,
        error: string
    ): Response {
        return res.status(code).send({
            code,
            error,
        });
    }
}

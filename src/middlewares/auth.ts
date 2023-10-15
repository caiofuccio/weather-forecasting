import { AuthService } from '@src/services/auth';
import { NextFunction, Request, Response } from 'express';

export function authMiddleware(
    req: Partial<Request>,
    res: Partial<Response>,
    next: NextFunction
): void {
    const token = req.headers?.['x-access-token'];
    try {
        const decodedUser = AuthService.decodeToken(token as string);
        req.decoded = decodedUser;
        next();
    } catch (error) {
        res.status?.(401).send({
            code: 401,
            error: (error as Error).message,
        });
    }
}

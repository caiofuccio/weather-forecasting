import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { DecodedUser } from '@src/types';

export class AuthService {
    public static async hashPassword(
        password: string,
        salt = 10
    ): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    public static async comparePasswords(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public static generateToken(payload: object): string {
        return jwt.sign(payload, config.get<string>('App.auth.key'), {
            expiresIn: config.get<string>('App.auth.tokenExpiresIn'),
        });
    }

    public static decodeToken(token: string): DecodedUser {
        return jwt.verify(
            token,
            config.get<string>('App.auth.key')
        ) as DecodedUser;
    }
}

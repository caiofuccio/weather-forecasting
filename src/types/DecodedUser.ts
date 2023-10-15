import { User } from './User';

export interface DecodedUser extends Omit<User, '_id'> {
    id: string;
}

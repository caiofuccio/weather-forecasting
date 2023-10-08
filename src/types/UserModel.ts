import { Document } from 'mongoose';
import { User } from './User';

export interface UserModel extends Omit<User, '_id'>, Document {}

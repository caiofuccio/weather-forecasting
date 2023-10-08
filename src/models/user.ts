import { UserModel } from '@src/types/UserModel';
import mongoose, { Model } from 'mongoose';

const schema = new mongoose.Schema<UserModel>(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: { type: String, required: true },
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                (ret.id = ret._id), delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export const User: Model<UserModel> = mongoose.model('User', schema);

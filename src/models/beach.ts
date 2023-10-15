import { Beach } from '@src/types';
import mongoose, { Document, Model, Schema } from 'mongoose';

interface BeachModel extends Omit<Beach, '_id'>, Document {}

const schema = new mongoose.Schema<BeachModel>(
    {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        name: { type: String, required: true },
        position: { type: String, required: true },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        } as unknown as string,
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export const BeachModel: Model<BeachModel> = mongoose.model('Beach', schema);

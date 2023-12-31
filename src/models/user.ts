import logger from '@src/logger';
import { AuthService } from '@src/services/auth';
import { UserModel } from '@src/types/UserModel';
import { CUSTOM_VALIDATION } from '@src/utils';
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

schema.path('email').validate(
    async (email: string) => {
        const emailCount = await mongoose.models.User.countDocuments({ email });

        return !emailCount;
    },
    'already exists in the database.',
    CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<UserModel>('save', async function (): Promise<void> {
    if (!this.password || !this.isModified('password')) {
        return;
    }

    try {
        const hashedPassword = await AuthService.hashPassword(this.password);
        this.password = hashedPassword;
    } catch (error) {
        logger.error(`Error hashing the password for the user ${this.name}`);
    }
});

export const User: Model<UserModel> = mongoose.model('User', schema);

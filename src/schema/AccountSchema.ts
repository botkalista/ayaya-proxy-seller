
import { getMongoose } from '../repository/Repository'

const mongoose = getMongoose();

export type AccountType = {
    username: string,
    email: string,
    password: string,
    subscription: number,
    quota: number
}

export const AccountSchema = new mongoose.Schema<AccountType>({
    username: { required: true, type: String },
    email: { required: true, type: String },
    password: { required: true, type: String },
    subscription: { required: true, type: Number },
    quota: { required: true, type: Number }
});

export const AccountModel = mongoose.model<AccountType>('accounts', AccountSchema);


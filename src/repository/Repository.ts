import * as mongoose from 'mongoose';


export function init(dbUri: string, dbName: string) {
    mongoose.connect(dbUri, { dbName });
}

export function getMongoose() {
    return mongoose;
}
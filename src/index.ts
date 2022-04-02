import * as dotenv from 'dotenv';
dotenv.config();

import * as Repository from './repository/Repository';
Repository.init(process.env.DB_URI, process.env.DB_NAME);

import * as express from 'express';
import * as cors from 'cors';

const app = express();
app.use(cors());

import { executeRequest, getAccount } from './controllers/ProxyController';


app.get('/info', async (req, res) => {
    try {
        const [username, password] = Buffer.from(req.headers.authorization.replace('Basic ', ''), 'base64').toString().split(':');
        const account = await getAccount(username, password);
        return res.json({
            quota: account.quota,
            subscription: account.subscription
        });
    } catch (ex) {
        return res.status(500).json({ error: ex.message });
    }
});

app.use((req, res, next) => {
    const now = new Date().toLocaleTimeString('it-IT');
    console.log(now, req.ip, req.method, req.url);
    executeRequest(req, res);
});



app.listen(8600);



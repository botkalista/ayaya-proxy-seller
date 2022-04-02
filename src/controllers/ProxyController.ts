
import fetch from 'node-fetch';

import type { Request, Response } from 'express';
import { AccountModel } from '../schema/AccountSchema';


export async function getAccount(username: string, password: string) {
    const account = await AccountModel.findOne({ username, password });
    return account;
}

export async function executeRequest(request: Request, response: Response) {

    let step = 0;

    try {
        const [username, password] = Buffer.from(request.headers['proxy-authorization'].replace('Basic ', ''), 'base64').toString().split(':');
        step = 1;
        const account = await getAccount(username, password);

        if (!account) return response.status(401).json({ error: 'Account not found' });

        if (account.subscription == 0) {

            if (account.quota <= 0) return response.status(402).json({ error: 'Quota exceeded' });

            return fetch(request.url, { method: request.method, headers: request.headers as any }).then(async fetchResponse => {
                const contentLength = fetchResponse.headers.get('content-length');
                account.quota -= parseInt(contentLength);
                if (account.quota < 0) account.quota = 0;
                response.setHeader('ayaya-proxy-ip', request.hostname);
                response.setHeader('ayaya-proxy-mode', 'FREE');
                response.setHeader('ayaya-proxy-quota', account.quota);
                await account.save();
                fetchResponse.body.pipe(response);
            });


        } else {
            //TODO: Use premium proxies
        }

        throw Error('NO HANDLERS');

    } catch (ex) {
        console.error(ex);
        if (step == 0) return response.status(401).json({ error: 'Error during authentication' });
        return response.status(500).json({ error: ex.message });
    }


}
const https = require('https');
const http = require('http');
const helpers = require('./helpers');

async function main () {
    const opts = helpers.parseArgs(process.argv);

    const accountSid = opts.accountSid;
    const syncKey = opts.syncKey;
    const authToken = opts.authToken;
    const campaignId = opts.campaignId;
    const env = opts.env || "production";
    const start = opts.start;
    const end = opts.end;
    const testMode = opts.testMode !== undefined;
    const httpLib = env === "localhost" ? http : https;

    if(!accountSid || !syncKey || !authToken || !start || !end || !campaignId) {
        throw new Error('accountSid, syncKey, authToken, campaignId, start and end parameters are required');
    }

    console.log('Fetching data from Kick server...\n');
    const kickData = await helpers.makeRequest(
        httpLib,
        `${helpers.urls[env]}/impact-sync?start=${start}&end=${end}${testMode ? '&testmode=true' : ''}`,
        {
            headers: {
                authorization: `Bearer ${syncKey}`,
                'x-account-sid': accountSid
            }
        }
    );

    console.log(`Partner ID: ${kickData.partnerId}`);
    console.log(`Account SID: ${accountSid}`);
    console.log(`Transactions fetched: ${kickData.transactions.length}`);

    // console.log(kickData);

    for(const transaction of kickData.transactions) {
        try {
            const data = {
                ItemSku1: `KICK${transaction.id}`,
                ItemPrice1: transaction.value,
                ItemQuantity1: 1,
                Test: testMode,
                CampaignId: parseInt(campaignId),
                MediaPartnerId: kickData.partnerId,
                OrderId: `KICK-${transaction.id}`,
                CustomerEmail: transaction.email,
                ActionTrackerId: 1111,
                EventDate: transaction.date
            };

            // console.log(data);

            await helpers.makeRequest(https, `https://api.impact.com/Advertisers/${accountSid}/Conversions`, {
                auth: `${accountSid}:${authToken}`,
                headers: {
                    'content-type': 'application/json',
                },
                method: 'POST'
            }, JSON.stringify(data));
        } catch(e) {
            console.error(`Error when syncing transaction ${transaction.id}`);
            console.error(e);
        }
    }
}

main()
    .catch(e => {
        console.error(e);

        process.exit(1);
    });

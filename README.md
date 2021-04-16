Kick -> Impact Sync Script
==

Requirements: Node.js 8+

Running script
--
```
node index.js --accountSid {impactAccountSid} --authToken {impactAuthToken} --campaignId {impactCampaignId} --syncKey {kickSyncKey} --start {startDate} --end {endDate}
```

For example:
```
node index.js --accountSid test-sid --authToken 123 --campaignId 123 --syncKey secret  --start 2021-01-01 --end 2021-04-16
```

Parameters description:

|Param              | Description                                               |
|-------------------|---------------------------                                |
|accountSid       | Account SID from Impact (can be found in API settings)    |
|authToken        | Auth Token from Impact (can be found in API settings)     |
|campaignId       | Id of Impact Campaign where conversions should be registered |
|syncKey            | Secret Key received from Kick |
|start              | Start date in format YYYY-MM-DD |
|end              | End date in format YYYY-MM-DD |
|testMode           | Enabling it will send test conversions |

What it does?
--

Script works in two steps:

1. Retrieve transactions for given date range from Kick server
2. Call Impact [Create Conversion](https://developer.impact.com/default/documentation/Adv-v8#/Conversions/CreateConversion) API endpoint

Example data that will be send to Impact API:
```json
{
  "ItemSku1": "KICK-1",
  "ItemPrice1": 100,
  "ItemQuantity1": 1,
  "Test": false,
  "CampaignId": 123,
  "MediaPartnerId": "test-partner",
  "OrderId": "KICK-1",
  "CustomerEmail": "user1@example.com",
  "ActionTrackerId": 1111,
  "EventDate": "2020-02-01T00:00:00.000Z"
}
```

FAQ
--
**Is it safe to pass Impact Auth Token to this script?**

Auth token is used only for making a call to Impact API. It's not stored nor sent to any other server.

**Will running script multiple times for the same date range result in duplicated conversions in Impact?**

No, `OrderId` parameter in request to Impact is used to uniquely identify conversion so sending same conversion multiple times will have no effect.

# Cryptocurrency-Tracker

This project was built with Turbo 360. To learn more, click here: https://www.turbo360.co

## Get Started For Local Testing
After cloning into repo, cd to project root directory and run npm install:

```
$ npm install
```

To run dev server, install Turbo CLI globally:

```
$ sudo npm install turbo-cli -g
```

Then run devserver from project root directory:

```
$ turbo devserver
```

To build for production, run build:

```
$ npm run build
```

## Documentation

When this function is hit with an HTTPS GET request it will return curated information on a variety of different exchanges. Below is a list of what information it will return.

Deployment link:
```
https://production.turbo360-vector.com/cryptocurrency-tracker-vector-caqpsd/getBitcoinPrices
```

| Query   | Required | Options                                                         |
|---------|----------|-----------------------------------------------------------------|
| timeout | no       | any number < 0 (milliseconds to timeout requests to an exchange)|

Note: Most exchanges will reply within 2500 milliseconds, some like lakebtc are may take longer

### List of Exchanges
    1. Cex.io
    2. GDAX.com
    3. bitstamp.net
    4. bitfinex.com
    5. gemini.com
    6. kraken.com
    7. lakebtc.com
    8. btcc.com
    9. itbit.com
    10. exmo.com
   
### Notes on Errors
    * "parsing error": This will be returned on the exchange's bid place if the GET request returns something other than JSON. This may mean the exchange is down right now and experiencing an error.
    * "bid find error" & "ask find error": This means the website returned something other than what was expected. This may mean that the API is under maintenance
    * "request timed out": This means that the website did not return a response before your timeout period expired  

### Example 1 - Default GET Request

You can access this vector with a simple get request. You should do this if you do not care how long it takes the exchange to reply.

#### Step 1

Hit the deployment link:
```
https://production.turbo360-vector.com/cryptocurrency-tracker-vector-caqpsd/getBitcoinPrices
```

### JSON Payload

The JSON payload will contain the following information:

| Overview     |                                                                                              |
|--------------|----------------------------------------------------------------------------------------------|
| confirmation | Will return success if everything succeeded or failure if there was an error                 |
| time         | This is the date and time the function finished sending all the requests and started waiting |
| bids         | This contains information on bids across exchanges                                           |
| asks         | This contains information on asks across exchanges                                           |

| bids             |                                                                        |
|------------------|------------------------------------------------------------------------|
| average          | The average bid across all exchanges                                   |
| highest exchange | This will be the name of the exchange with the highest bid             |
| exchanges        | This is a list of exchanges with each of their exchange rate (BTC/USD) |

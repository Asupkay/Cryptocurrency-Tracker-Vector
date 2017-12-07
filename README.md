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

Note: Most exchanges will reply within 2500 milliseconds, some like lakebtc may take longer

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
* `parsing error`: This will be returned on the exchange's bid place if the GET request returns something other than JSON. This may mean the exchange is down right now and experiencing an error.
* `bid find error` & `ask find error`: This means the website returned something other than what was expected. This may mean that the API is under maintenance
* `request timed out`: This means that the website did not return a response before your timeout period expired  

### Example 1 - Default GET Request

You can access this vector with a simple get request. You should do this if you do not care how long it takes the exchange to reply.

#### Step 1

Hit the deployment link:
```
https://production.turbo360-vector.com/cryptocurrency-tracker-vector-caqpsd/getBitcoinPrices
```

### Example 2 - GET Request With Timeout

#### Step 1 

Choose a timeout time measured in milliseconds more than 0 I use around 2500 as that will get all exchanges besides 1 usually (lakebtc). 1000 milliseconds = 1 second

### Step 2

Concatenate the timeout onto the end of the string as a query parameter.

Example:
```
https://production.turbo360-vector.com/cryptocurrency-tracker-vector-caqpsd/getBitcoinPrices?timeout=2500
```

### Step 3

Hit the URL you created in the previous step and you should be returned a JSON object.

### JSON Payload

The JSON payload will contain the following information:

#### Example JSON payload:

```json
{
    "confirmation": "success",
    "time": "2017-12-06T22:41:47.090Z",
    "bids": {
        "average": 13667.182999999999,
        "highestExchange": "cex",
        "exchanges": {
            "cex": 14540,
            "gdax": 13925.24,
            "bitstamp": 13521,
            "bitfinex": 13390,
            "gemini": 13633.92,
            "kraken": 13700,
            "lakebtc": 13422.28,
            "btcc": 13100,
            "itbit": 13492.73,
            "exmo": 13946.66
        }
    },
    "asks": {
        "average": 13730.544,
        "lowestExchange": "bitfinex",
        "exchanges": {
            "cex": 14595.06,
            "gdax": 13950,
            "bitstamp": 13530,
            "bitfinex": 13398,
            "gemini": 13633.93,
            "kraken": 13758.5,
            "lakebtc": 13425.06,
            "btcc": 13496,
            "itbit": 13571.99,
            "exmo": 13946.9
        }
    }
}
```

#### Overview of JSON structure:

| Overview     |                                                                                              |
|--------------|----------------------------------------------------------------------------------------------|
| confirmation | Will return success if everything succeeded or failure if there was an error                 |
| time         | This is the date and time the function finished sending all the requests and started waiting |
| bids         | This contains information on bids across exchanges                                           |
| asks         | This contains information on asks across exchanges                                           |

Note: On confirmation failure there will be a message attribute that will contain more information on why it failed.

#### How `bids` are formatted:

| bids             |                                                                            |
|------------------|----------------------------------------------------------------------------|
| average          | The average bid across all exchanges                                       |
| highest exchange | This will be the name of the exchange with the highest bid                 |
| exchanges        | This is a list of exchanges with each of their highest bid price (BTC/USD) |

#### How `asks` are formatted:

| asks             |                                                                           |
|------------------|---------------------------------------------------------------------------|
| average          | The average ask across all exchanges                                      |
| lowest exchange  | This will be the name of the exchange with the lowest ask                 |
| exchanges        | This is a list of exchanges with each of their lowest ask price (BTC/USD) |

#### How `exchanges` are formatted

| exchanges     |                                                         |
|---------------|---------------------------------------------------------|
| exchange name | Exchange name with the exchange bid or ask price in USD |

### Recommended Use

Use this vector to track bitcoin bid and ask prices across exchanges. Good examples of uses of this vector are charts of Bitcoin prices over time, and arbitrage bots.

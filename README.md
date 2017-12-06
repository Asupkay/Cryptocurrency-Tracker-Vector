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

### Example 1 - Default GET Request

You can access this vector with a simple get request. You should do this if you do not care how long it takes the exchange to reply.

#### Step 1

Hit the deployment link:
```
https://production.turbo360-vector.com/cryptocurrency-tracker-vector-caqpsd/getBitcoinPrices
```

### JSON Payload

The JSON payload will contain the following information
| Overview     |                                                                                              |
|--------------|----------------------------------------------------------------------------------------------|
| confirmation | Will return success if everything succeeded or failure if there was an error                 |
| time         | This is the date and time the function finished sending all the requests and started waiting |


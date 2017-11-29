var https = require("https");

module.exports = {
	getBitcoinPrices: (req, res) => {
        getCexIOPrice().then((cexIOInfo) => {
            getGdaxPrice().then((gdaxInfo) => {
                getBitstampPrice().then((bitstampInfo) => {
                let exchangeBids = {};
                let exchangeAsks = {};

                exchangeBids.cexio = cexIOInfo.bid;
                exchangeAsks.cexio = cexIOInfo.ask;
                exchangeBids.gdax = gdaxInfo.bid;
                exchangeAsks.gdax = gdaxInfo.ask;
                exchangeBids.bitstamp = bitstampInfo.bid;
                exchangeAsks.bitstamp = bitstampInfo.ask;

                let statInfo = resolveInformation(exchangeBids, exchangeAsks);

                res.status(200).json({
                    confirmation: 'success',
                    bids: {
                        average: statInfo.averageBid,
                        highestExchange: statInfo.highestBidExchange,
                        exchanges: exchangeBids
                    },
                    asks: {
                        average: statInfo.averageAsk,
                        lowestExchange: statInfo.lowestAskExchange,
                        exchanges: exchangeAsks
                    }
                });
                }).catch((error) => {
                    res.status(500).json({
                        confirmation: 'failure',
                        message: "Bitstamp error " + error.message
                    });
                });
            }).catch((error) => {
                res.status(500).json({
                    confirmation: 'failure',
                    message: "Gdax error " + error.message
                });
            });
        }).catch((error) => {
            res.status(503).json({
                confirmation: 'failure',
                message: "Cexio error " + error.message
            });
        });   
	}

}

function resolveInformation(bids, asks) {
    let amountOfExchanges = 0;

    let highestBidExchange;
    let highestBidAmount = 0;

    let lowestAskExchange;
    let lowestAskAmount = Infinity;

    let averageBid = 0;
    let averageAsk = 0;

   

    for(let key in bids) {
        amountOfExchanges++;
        cBid = bids[key];

        averageBid += cBid;

        if(cBid > highestBidAmount) {
            highestBidExchange = key;
            highestBidAmount = cBid;
        }
    }

    for(let key in asks) {
        cAsk = asks[key];

        averageAsk += asks[key]

        if(cAsk < lowestAskAmount) {
            lowestAskExchange = key;
            lowestAskAmount = cAsk;
        }
    }

    averageBid = averageBid/amountOfExchanges;
    averageAsk = averageAsk/amountOfExchanges;

    returnInformation = {
        highestBidExchange: highestBidExchange,
        lowestAskExchange: lowestAskExchange,
        averageBid: averageBid,
        averageAsk: averageAsk
    }

    return returnInformation;
}

function getCexIOPrice() {
    let promise = new Promise(
    function(resolve, reject) {
            https.get('https://cex.io/api/ticker/BTC/USD', (res) => {
            res.on('data', (d) => {
                bitcoinJSONData = JSON.parse(d)
                console.log("Cex.io:\n $j", bitcoinJSONData);
                resolve(bitcoinJSONData);
            });
        });
    });
    return promise;
}

function getGdaxPrice() {
    let promise = new Promise(
    function(resolve, reject) {
            
            const option = {
                hostname: 'api.gdax.com',
                path: '/products/BTC-USD/ticker',
                headers: {
                    'User-Agent': 'Node-JS Exchange Checker'
                }
            };

            https.get(option, (res) => {
            res.on('data', (d) => {
                bitcoinJSONData = JSON.parse(d)
                console.log("Gdax.com:\n $j", bitcoinJSONData);
                bitcoinJSONData.bid = parseFloat(bitcoinJSONData.bid);
                bitcoinJSONData.ask = parseFloat(bitcoinJSONData.ask);
                resolve(bitcoinJSONData);
            });
        });
    });
    return promise;
}

function getBitstampPrice() {
    let promise = new Promise(
    function(resolve, reject) {
            https.get('https://www.bitstamp.net/api/ticker', (res) => {
            res.on('data', (d) => {
                bitcoinJSONData = JSON.parse(d)
                console.log("Gdax.com:\n $j", bitcoinJSONData);
                bitcoinJSONData.bid = parseFloat(bitcoinJSONData.bid);
                bitcoinJSONData.ask = parseFloat(bitcoinJSONData.ask);
                resolve(bitcoinJSONData);
            });
        });
    });
    return promise;
}

function getCoinMarketCapPrice() {
    var promise = new Promise(
    function(resolve, reject) {
            https.get('https://api.coinmarketcap.com/v1/ticker/bitcoin/', (res) => {
            res.on('data', (d) => {
                bitcoinJSONData = JSON.parse(d)
                console.log("CoinMarketCap:\n $j", bitcoinJSONData);
                resolve(bitcoinJSONData[0].price_usd);
            });
        });
    });
    return promise;
}

function getCoinBasePrice() {
    var promise = new Promise(
    function(resolve, reject) {
            https.get('https://api.coinbase.com/v2/prices/BTC-USD/buy', (res) => {
            res.on('data', (d) => {
                bitcoinJSONData = JSON.parse(d)
                console.log("Coinbase:\n $j", bitcoinJSONData);
                resolve(bitcoinJSONData.data.amount);
            });
        });
    });
    return promise;
}



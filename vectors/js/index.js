var https = require("https");

module.exports = {


	getBitcoinPrices: (req, res) => {
        getCexIOPrice().then((cexIOInfo) => {
            let bids = {};
            let asks = {};

            bids.cexio = cexIOInfo.bid;
            asks.cexio = cexIOInfo.ask;

            let statInfo = resolveInformation(bids, asks);

            res.status(200).json({
                confirmation: 'success',
                averageBid: statInfo.averageBid,
                highestBidEx: statInfo.highestBidExchange,
                bid: bids,
                averageAsk: statInfo.averageAsk,
                lowestAskEx: statInfo.lowestAskExchange,
                ask: asks
            });
        }).catch((error) => {
            res.status(503).json({
                confirmation: 'failure',
                message: error.message
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
        averageAsk = asks[key]

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
    var promise = new Promise(
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



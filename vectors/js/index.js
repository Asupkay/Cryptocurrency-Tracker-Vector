const https = require("https");
const url = require('url');

let unparsedURLs = ['https://cex.io/api/ticker/BTC/USD', 'https://api.gdax.com/products/BTC-USD/ticker', 'https://www.bitstamp.net/api/ticker', 'https://api.bitfinex.com/v1/ticker/BTCUSD', 'https://api.gemini.com/v1/pubticker/btcusd']


module.exports = {
	getBitcoinPrices: (req, res) => {
        let promises = [];
        
        unparsedURLs.map((item) => {
            let URL = url.parse(item)
            let promise = getExchangePrice(URL);
            promises.push(promise);
        });
            
        let time = new Date();
  
        Promise.all(promises).then(values => {
            let exchangeBids = {};
            let exchangeAsks = {};

            exchangeBids.cex = values[0].bid;
            exchangeAsks.cex = values[0].ask;
            exchangeBids.gdax = values[1].bid;
            exchangeAsks.gdax = values[1].ask;
            exchangeBids.bitstamp = values[2].bid;
            exchangeAsks.bitstamp = values[2].ask;
            exchangeBids.bitfinex = values[3].bid;
            exchangeAsks.bitfinex = values[3].ask;
            exchangeBids.gemini = values[4].bid;
            exchangeAsks.gemini = values[4].ask;

            let statInfo = resolveInformation(exchangeBids, exchangeAsks);

            res.status(200).json({
                confirmation: 'success',
                time: time,
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
                error: error.message
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

function getExchangePrice(url) {
    let promise = new Promise(
    function(resolve, reject) {
            
            const option = {
                hostname: url.host,
                path: url.path,
                headers: {
                    'User-Agent': 'Node-JS Exchange Checker'
                }
            };

            https.get(option, (res) => {
            res.on('data', (d) => {
                bitcoinJSONData = JSON.parse(d)
                bitcoinJSONData.bid = parseFloat(bitcoinJSONData.bid);
                bitcoinJSONData.ask = parseFloat(bitcoinJSONData.ask);
                resolve(bitcoinJSONData);
            });
        });
    });
    return promise;
}

const https = require("https");
const url = require('url');

let unparsedURLs = [['https://cex.io/api/ticker/BTC/USD'], ['https://api.gdax.com/products/BTC-USD/ticker'], ['https://www.bitstamp.net/api/ticker'], ['https://api.bitfinex.com/v1/ticker/BTCUSD'], ['https://api.gemini.com/v1/pubticker/btcusd'], ['https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD', 'result.XXBTZUSD.b[0]', 'result.XXBTZUSD.a[0]'], ['https://api.lakebtc.com/api_v2/ticker/', 'btcusd.bid', 'btcusd.ask'], ['https://spotusd-data.btcc.com/data/pro/ticker?symbol=BTCUSD', "ticker.BidPrice", "ticker.AskPrice"], ['https://api.itbit.com/v1/markets/XBTUSD/ticker']]

module.exports = {
	getBitcoinPrices: (req, res) => {
        let promises = [];
        
        unparsedURLs.map((item) => {
            let URL = url.parse(item[0])
            let promise = getExchangePrice(URL, item[1], item[2]);
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

            exchangeBids.kraken = parseFloat(values[5].result.XXBTZUSD.b[0]);
            exchangeAsks.kraken = parseFloat(values[5].result.XXBTZUSD.a[0]);

            exchangeBids.lakebtc = parseFloat(values[6].btcusd.bid);
            exchangeAsks.lakebtc = parseFloat(values[6].btcusd.ask);

            exchangeBids.btcc = values[7].ticker.BidPrice;
            exchangeAsks.btcc = values[7].ticker.AskPrice;

            exchangeBids.itbit = values[8].bid;
            exchangeAsks.itbit = values[8].ask;

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

function getExchangePrice(url, pathToBid, pathToAsk) {
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
                if(pathToBid == null && pathToAsk == null) {
                    bitcoinJSONData.bid = parseFloat(bitcoinJSONData.bid);
                    bitcoinJSONData.ask = parseFloat(bitcoinJSONData.ask);
                } else {
                    bitcoinJSONData[pathToBid] = parseFloat(bitcoinJSONData[pathToBid]);
                    bitcoinJSONData[pathToAsk] = parseFloat(bitcoinJSONData[pathToAsk]);
                }
                console.log(bitcoinJSONData);
                resolve(bitcoinJSONData);
            });
        });
    });
    return promise;
}

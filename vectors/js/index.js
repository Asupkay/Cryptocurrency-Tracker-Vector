const https = require("https");
const url = require('url');

//https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object

let unparsedURLs = [['https://cex.io/api/ticker/BTC/USD'], ['https://api.gdax.com/products/BTC-USD/ticker'], ['https://www.bitstamp.net/api/ticker'], ['https://api.bitfinex.com/v1/ticker/BTCUSD'], ['https://api.gemini.com/v1/pubticker/btcusd'], ['https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD', 'result.XXBTZUSD.b', 'result.XXBTZUSD.a', 0], ['https://api.lakebtc.com/api_v2/ticker/', 'btcusd.bid', 'btcusd.ask'], ['https://spotusd-data.btcc.com/data/pro/ticker?symbol=BTCUSD', "ticker.BidPrice", "ticker.AskPrice"], ['https://api.itbit.com/v1/markets/XBTUSD/ticker']]

module.exports = {
	getBitcoinPrices: (req, res) => {
        let promises = [];
        
        unparsedURLs.map((item) => {
            let URL = url.parse(item[0])
            let promise = getExchangePrice(URL, item[1], item[2], item[3]);
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

            exchangeBids.kraken = values[5].bid;
            exchangeAsks.kraken = values[5].ask;

            exchangeBids.lakebtc = values[6].bid;
            exchangeAsks.lakebtc = values[6].ask;

            exchangeBids.btcc = values[7].bid;
            exchangeAsks.btcc = values[7].ask;

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
        cBid = bids[key];
        if(cBid != "error") {
            amountOfExchanges++;

            averageBid += cBid;

            if(cBid > highestBidAmount) {
                highestBidExchange = key;
                highestBidAmount = cBid;
            }
        }
    }

    for(let key in asks) {
        cAsk = asks[key];
        
        if(cAsk != "error") {
            averageAsk += asks[key]

            if(cAsk < lowestAskAmount) {
                lowestAskExchange = key;
                lowestAskAmount = cAsk;
            }
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

function getExchangePrice(url, pathToBid, pathToAsk, position) {
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
                let returnedData = {};
                if(pathToBid == null && pathToAsk == null) {
                    if(!bitcoinJSONData.bid) {
                        returnedData.bid = "error";
                    }
                    if(!bitcoinJSONData.ask) {
                        returnedData.ask = "error";
                    }
                
                    returnedData.bid = parseFloat(bitcoinJSONData.bid);
                    returnedData.ask = parseFloat(bitcoinJSONData.ask);
                } else {
                    pathToBid = pathToBid.split(".");
                    pathToAsk = pathToAsk.split(".");

                    let bidPrice = bitcoinJSONData;
                    pathToBid.map((item) => {
                        bidPrice = bidPrice[item];
                    });
                    
                    let askPrice = bitcoinJSONData;
                    pathToAsk.map((item) => {
                        askPrice = askPrice[item];
                    });

                    if(!bidPrice || !askPrice) {
                        returnedData.bid = "error";
                        returnedData.ask = "error";
                    } else {
                        if(position) {
                            returnedData.bid = parseFloat(bidPrice[position]);
                            returnedData.ask = parseFloat(askPrice[position]);
                        } else {
                            returnedData.bid = parseFloat(bidPrice);
                            returnedData.ask = parseFloat(askPrice);
                        }
                    }
                }
                console.log(returnedData);
                resolve(returnedData);
            });
        });
    });
    return promise;
}

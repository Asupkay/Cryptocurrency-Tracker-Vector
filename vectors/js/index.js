const https = require("https");
const url = require('url');

let unparsedURLs = [['cex', 'https://cex.io/api/ticker/BTC/USD'], ['gdax', 'https://api.gdax.com/products/BTC-USD/ticker'], ['bitstamp', 'https://www.bitstamp.net/api/ticker'], ['bitfinex', 'https://api.bitfinex.com/v1/ticker/BTCUSD'], ['gemini', 'https://api.gemini.com/v1/pubticker/btcusd'], ['kraken', 'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD', 'result.XXBTZUSD.b', 'result.XXBTZUSD.a', 0], /*['lakebtc', 'https://api.lakebtc.com/api_v2/ticker/', 'btcusd.bid', 'btcusd.ask'],*/ ['btcc', 'https://spotusd-data.btcc.com/data/pro/ticker?symbol=BTCUSD', 'ticker.BidPrice', 'ticker.AskPrice'], ['itbit', 'https://api.itbit.com/v1/markets/XBTUSD/ticker'], ['exmo', 'https://api.exmo.com/v1/ticker/', 'BTC_USD.buy_price', 'BTC_USD.sell_price']]

//TODO: Add req query for the coin
//TODO: Make ethereum have both usd and price in bitcoin

module.exports = {
	getBitcoinPrices: (req, res) => {
        getBidAndAsk(req, res, unparsedURLs); 
	},
    getEthereumPrices: (req, res) => {
        //TODO: Change this to a function of the bitcoin one 
    }
}

//Gets bitcoins overall price from coin market cap
function getBitcoinOverallAverage() {
    let promise = new Promise((resolve, reject) => {
        https.get('https://api.coinmarketcap.com/v1/ticker/bitcoin/', (rest) => {
            let fulldata;
            rest.on('data', (d) => {
                if(fulldata) {
                    fulldata += d;
                } else {
                    fulldata = d;
                }
            });
            rest.on('end', () => {
                let bitcoinPrice = parseInt(JSON.parse(fulldata)[0].price_usd);
                resolve(bitcoinPrice);
            });
        }); 
    });
    return promise;
}

//Get the bid and ask price from a list of unparsedURLS
function getBidAndAsk(req, res, unparsedURLs) {
    let promises = [];
    let names = [];
   
    let timeout = req.query.timeout;
    if(timeout) {
        timeout = parseInt(req.query.timeout);
        if(timeout <= 0) {
            res.status(500).json({
                confirmation: 'failure',
                message: 'Timeout must be greater than 0'
            });
            return;
        }   
    }
    
    unparsedURLs.map((item) => {
        names.push(item[0]);
        let URL = url.parse(item[1])
        let promise = getExchangePrice(URL, item[2], item[3], item[4], timeout);
        promises.push(promise);
    });
        
    let time = new Date();

    Promise.all(promises).then((values) => {
        let exchangeBids = {};
        let exchangeAsks = {};

        for(let i = 0; i < names.length; i++) {
            exchangeBids[names[i]] = values[i].bid;
            exchangeAsks[names[i]] = values[i].ask;
        }

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


//Get the average and the lowest and highest bid ask and return that
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
        if(typeof cBid === 'number') {
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
        
        if(typeof cAsk === 'number') {
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

//Get the bid and ask price from the exchange
function getExchangePrice(url, pathToBid, pathToAsk, position, timeout) {
    let promise = new Promise(
    function(resolve, reject) {
            
        const option = {
            hostname: url.host,
            path: url.path,
            headers: {
                'User-Agent': 'Node-JS Exchange Checker'
            }
        };

        let getRequest = https.get(option, (res) => {
            let fulldata;
            res.on('data', (d) => {
                if(fulldata) {
                    fulldata += d;
                } else {
                    fulldata = d;
                }
            });
            res.on('end', () => {
                let returnedData = {};
                
                try {
                    bitcoinJSONData = JSON.parse(fulldata)
                } catch (error) {
                    returnedData.bid = "parsing error";
                    returnedData.ask = "parsing error";
                }

                if(pathToBid == null && pathToAsk == null) {
                    if(!bitcoinJSONData.bid) {
                        returnedData.bid = "bid find error (API probably returned error)";
                    }
                    if(!bitcoinJSONData.ask) {
                        returnedData.ask = "ask find error (API probably returned error)";
                    }
                
                    returnedData.bid = parseFloat(bitcoinJSONData.bid);
                    returnedData.ask = parseFloat(bitcoinJSONData.ask);
                } else {
                    pathToBid = pathToBid.split(".");
                    pathToAsk = pathToAsk.split(".");

                    let bidPrice = bitcoinJSONData;
                    let error = false;
                    pathToBid.map((item) => {
                        if(!error) {
                            bidPrice = bidPrice[item];
                            if(!bidPrice) {
                                error = true;
                            }
                        }
                    });
                   
                     
                    let askPrice = bitcoinJSONData;
                    pathToAsk.map((item) => {
                        if(!error) { 
                            askPrice = askPrice[item];
                            if(!askPrice) {
                                error = true;
                            }
                        }
                    });

                    if(error) {
                        returnedData.bid = "bid find error (API probably returned error)";
                        returnedData.ask = "ask find error (API probably returned error)";
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
                resolve(returnedData);
            });
        });

        getRequest.on('error', (e) => {
            let returnedData = {};
            returnedData.bid = "request timed out";
            returnedData.ask = "request timed out";
            resolve(returnedData);
        });

        if(timeout) {
            getRequest.setTimeout(timeout, () => {
                let returnedData = {};
                returnedData.bid = "request timed out";
                returnedData.ask = "request timed out";
                resolve(returnedData);
            });
        }
    });
    return promise;
}

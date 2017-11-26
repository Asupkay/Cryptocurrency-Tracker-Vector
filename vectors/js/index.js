var https = require("https");

module.exports = {
	getBitcoinPrices: (req, res) => {
        getCoinMarketCapPrice().then((coinMarketCapPrice) => {
            getCoinBasePrice().then((coinBasePrice) => {
                res.status(200).json({
                    confirmation: 'success',
                    btcAverage: coinMarketCapPrice,
                    coinBaseBuy: coinBasePrice
                });
            }).catch((error) => {

            });
        }).catch((error) => {
            res.status(503).json({
                confirmation: 'failure',
                message: error
            });
        });   
	}

}

function getCoinMarketCapPrice() {
    var promise = new Promise(
    function(resolve, reject) {
            https.get('https://api.coinmarketcap.com/v1/ticker/bitcoin/', (res) => {
            res.setEncoding("utf-8");
            res.on('data', (d) => {
                bitcoinJSONData = JSON.parse(d)
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
            res.setEncoding("utf-8");
            res.on('data', (d) => {
                bitcoinJSONData = JSON.parse(d)
                resolve(bitcoinJSONData.data.amount);
            });
        });
    });
    return promise;
}

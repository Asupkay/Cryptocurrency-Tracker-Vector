/* Define your vectors here. To run the samples below,
   from the root directory run the devserver:
   $ turbo devserver

   then navigate to: 
   http://localhost:3000/vectors/sample

   Deploy the vectors by running from root directory:
   $ turbo vectors
*/

// import npm packages here:
// var turbo = require('turbo360')

module.exports = {

	getBitcoinPrices: (req, res) => {
		res.status(200).json({
			confirmation: 'success',
			data: 'This is a sample Vector!'
		})
	}

}
